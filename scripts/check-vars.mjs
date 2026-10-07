#!/usr/bin/env node
// Reports `var(--name)` without a fallback whose `--name` is declared nowhere
// in the given CSS. Declarations are pooled across all files: the framework's
// and the project's variables usually live in different bundles.
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
const USE = /var\(\s*(--[\w-]+)\s*([,)])/g;

/**
 * @param {{ file: string, css: string }[]} sources
 * @param {{ ignore?: string[] }} [options]
 * @returns {{ file: string, line: number, column: number, name: string }[]}
 */
export function findUndefinedVars(sources, { ignore = [] } = {}) {
  const declared = new Set();
  const texts = sources.map(({ file, css }) => ({ file, css: stripComments(css) }));
  for (const { css } of texts) {
    for (const m of css.matchAll(DECL)) declared.add(m[1] || m[2]);
  }
  const found = [];
  for (const { file, css } of texts) {
    for (const m of css.matchAll(USE)) {
      const name = m[1];
      if (m[2] === ',' || declared.has(name)) continue;
      if (ignore.some((prefix) => name.startsWith(prefix))) continue;
      const before = css.slice(0, m.index);
      const line = before.split('\n').length;
      const column = m.index - before.lastIndexOf('\n');
      found.push({ file, line, column, name });
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
  for (const { file, line, column, name } of found) {
    console.warn(`${file}:${line}:${column}  ${name} is not defined`);
  }
  console.log(`checked ${sources.length} file(s): ${found.length} undefined var() reference(s)`);
  return strict && found.length ? 1 : 0;
}

// npm links bins as symlinks, so compare real paths.
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
