// Universal SCSS build script.
//
// Every top-level folder under src/ whose name does NOT start with "_" is a
// bundle: its index.scss is compiled to dist/<folder>.min.css (compressed).
// Folders starting with "_" hold shared content/partials and are never
// compiled on their own. Drop a new "<name>/index.scss" folder in src/ and it
// is picked up automatically — no changes here needed.

import { compile } from 'sass';
import { readdirSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'src';
const OUT = 'dist';
const watch = process.argv.includes('--watch');

function findBundles() {
  const bundles = [];
  for (const item of readdirSync(SRC, { withFileTypes: true })) {
    if (!item.isDirectory() || item.name.startsWith('_')) continue;
    const entry = join(SRC, item.name, 'index.scss');
    if (existsSync(entry)) {
      bundles.push({ name: item.name, entry });
    } else {
      console.warn(`skip ${item.name}/ — no index.scss`);
    }
  }
  return bundles;
}

function buildAll() {
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });
  const bundles = findBundles();
  if (bundles.length === 0) {
    console.warn(`No bundles found in ${SRC}/`);
    return;
  }
  for (const { name, entry } of bundles) {
    writeFileSync(`${OUT}/${name}.min.css`, compile(entry, { style: 'compressed' }).css);
    console.log(`built ${name}.min.css`);
  }
}

buildAll();

if (watch) {
  const { watch: fsWatch } = await import('node:fs');
  console.log(`watching ${SRC}/ for changes...`);
  let timer = null;
  fsWatch(SRC, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        buildAll();
      } catch (err) {
        console.error(err.message);
      }
    }, 50);
  });
}
