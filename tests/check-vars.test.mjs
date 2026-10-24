// findUndefinedVars from scripts/check-vars.mjs: var() without a fallback whose
// variable is declared nowhere, including chains of fallbacks.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findUndefinedVars } from '../scripts/check-vars.mjs';

const names = (css, options) => findUndefinedVars([{ file: 'a.css', css }], options).map((u) => u.name);

test('plain var() without a fallback: reported when undeclared', () => {
  assert.deepEqual(names(':root { --a: 1px } .x { margin: var(--a) var(--b) }'), ['--b']);
  assert.deepEqual(names('@property --a { syntax: "*"; inherits: false } .x { margin: var(--a) }'), []);
  assert.deepEqual(names('.x { margin: var(--b, 2px) }'), []);
});

test('fallback chain: the inner var() matters only when the outer one is undeclared too', () => {
  // Primer: the first link is declared, the legacy name in the fallback is not.
  const primer = ':root { --fgColor-default: #1f2328 } .x { color: var(--fgColor-default, var(--color-fg-default)) }';
  assert.deepEqual(names(primer), []);

  const broken = findUndefinedVars([{ file: 'a.css', css: '.x { box-shadow: var(--inset, var(--legacy-inset)) }' }]);
  assert.deepEqual(broken.map(({ name, fallbackOf }) => [name, fallbackOf]), [['--legacy-inset', '--inset']]);

  assert.deepEqual(names('.x { color: var(--a, var(--b, var(--c))) }'), ['--c']);
  assert.deepEqual(names(':root { --b: 0 } .x { color: var(--a, var(--b, var(--c))) }'), []);
});

test('nested parentheses: calc() inside a fallback and siblings after the chain', () => {
  assert.deepEqual(names(':root { --a: 0 } .x { width: var(--a, calc(var(--b) * 2)) }'), []);
  assert.deepEqual(names(':root { --a: 0 } .x { margin: var(--a, calc(1px + 2px)) var(--c) }'), ['--c']);
  assert.deepEqual(names('.x { width: calc(var(--d) + var(--e, 1px)) }'), ['--d']);
});

test('strings and comments are not parsed; --ignore covers the chain too', () => {
  assert.deepEqual(names('.x::before { content: "var(--q) )" } /* var(--r) */ .y { margin: var(--s) }'), ['--s']);
  assert.deepEqual(names('.x { width: var(--js-w, var(--fallback-w)) }', { ignore: ['--js-'] }), []);
  assert.deepEqual(names('.x { width: var(--js-w) }', { ignore: ['--js-'] }), []);
});

test('line and column point at the var()', () => {
  const [u] = findUndefinedVars([{ file: 'a.css', css: '.x {\n  margin: var(--b);\n}' }]);
  assert.deepEqual([u.line, u.column], [2, 11]);
});
