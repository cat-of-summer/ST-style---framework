#!/usr/bin/env node
// Reports `var(--name)` without a fallback whose `--name` is declared nowhere
// in the given CSS. Declarations are pooled across all files: the framework's
// and the project's variables usually live in different bundles. A var() in the
// fallback of another var() is reported only when every var() around it is
// undeclared too: in `var(--a, var(--b))` with --a declared the chain resolves
// before --b.
//
//   st-style-check-vars [--strict] [--ignore <prefix>]... <file.css|dir>...
//
// --strict      exit 1 when something is reported (default: warn, exit 0)
// --ignore      skip names starting with <prefix> (variables set from JS or
//               inline styles); repeatable

import { readFileSync, readdirSync, realpathSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));

// `--name:` as a property, or `@property --name` (registered, has initial-value).
const DECL = /(?:^|[{;\s])(--[\w-]+)\s*:|@property\s+(--[\w-]+)/g;
const VAR = /var\(\s*(--[\w-]+)\s*(,?)/iy;
const STRING = /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/y;

// Every var() with the names of the var()s whose fallback it sits in, innermost
// last. One pass with a stack of open parentheses, so any nesting depth works.
function uses(css) {
  const out = [];
  const stack = [];
  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    if (ch === '"' || ch === "'") {
      STRING.lastIndex = i;
      if (STRING.test(css)) i = STRING.lastIndex - 1;
    } else if (ch === '(') {
      stack.push(null);
    } else if (ch === ')') {
      stack.pop();
    } else if ((ch === 'v' || ch === 'V') && !/[\w-]/.test(css[i - 1] || '')) {
      VAR.lastIndex = i;
      const m = VAR.exec(css);
      if (!m) continue;
      out.push({ index: i, name: m[1], fallback: m[2] === ',', outer: stack.filter(Boolean) });
      stack.push(m[1]);
      i = VAR.lastIndex - 1;
    }
  }
  return out;
}

/**
 * @param {{ file: string, css: string }[]} sources
 * @param {{ ignore?: string[] }} [options]
 * @returns {{ file: string, line: number, column: number, name: string, fallbackOf?: string }[]}
 *   fallbackOf — the var() whose fallback this one is (undeclared as well).
 */
export function findUndefinedVars(sources, { ignore = [] } = {}) {
  const declared = new Set();
  const texts = sources.map(({ file, css }) => ({ file, css: stripComments(css) }));
  for (const { css } of texts) {
    for (const m of css.matchAll(DECL)) declared.add(m[1] || m[2]);
  }
  const ignored = (name) => ignore.some((prefix) => name.startsWith(prefix));
  const found = [];
  for (const { file, css } of texts) {
    for (const { index, name, fallback, outer } of uses(css)) {
      if (fallback || declared.has(name) || ignored(name)) continue;
      // The chain resolves earlier: an outer var() is declared or set from JS.
      if (outer.some((o) => declared.has(o) || ignored(o))) continue;
      const before = css.slice(0, index);
      const line = before.split('\n').length;
      const column = index - before.lastIndexOf('\n');
      found.push({ file, line, column, name, ...(outer.length && { fallbackOf: outer.at(-1) }) });
    }
  }
  return found;
}

function collect(path, out) {
  if (statSync(path).isDirectory()) {
    for (const item of readdirSync(path)) collect(join(path, item), out);
  } else if (path.endsWith('.css')) {
    out.push({ file: path, css: readFileSync(path, 'utf8') });
  }
  return out;
}

function main(argv) {
  const ignore = [];
  const paths = [];
  let strict = false;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--strict') strict = true;
    else if (argv[i] === '--ignore') ignore.push(argv[++i]);
    else paths.push(argv[i]);
  }
  if (paths.length === 0) {
    console.error('usage: st-style-check-vars [--strict] [--ignore <prefix>]... <file.css|dir>...');
    return 2;
  }
  const sources = paths.flatMap((p) => collect(p, []));
  const found = findUndefinedVars(sources, { ignore });
  for (const { file, line, column, name, fallbackOf } of found) {
    const chain = fallbackOf ? ` (fallback of ${fallbackOf}, not defined either)` : '';
    console.warn(`${file}:${line}:${column}  ${name} is not defined${chain}`);
  }
  console.log(`checked ${sources.length} file(s): ${found.length} undefined var() reference(s)`);
  return strict && found.length ? 1 : 0;
}

// npm links bins as symlinks, so compare real paths.
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
