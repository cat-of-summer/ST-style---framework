# st-style

Attribute-driven CSS utility framework. Authored in SCSS, shipped as compiled CSS.

- **`main`** — layout/typography/spacing/grid/display utilities + reset.
- **`effects`** — hover/animation effects (`scale`, `pulse`, `float`, `ripple`, …).

Markup uses attributes instead of classes:

```html
<section container>
  <div grid gap-4>
    <article col="12 md-6" p="4 md-8" sz="4 md-6">…</article>
  </div>
</section>
<button scale="hover" shadow="hover active">Click</button>
```

## Development

```bash
npm install      # installs sass, builds dist/ via the prepare script
npm run build    # compile src/ → dist/*.min.css
npm run watch    # rebuild on change
```

Source layout:

```
src/
  _config.scss                              # build-time config (shared partial)
  main/      index.scss + _*.scss partials  # → dist/main.min.css
  effects/   index.scss + _*.scss partials  # → dist/effects.min.css
```

**Conventions** (`build.mjs` relies on these — no script edits needed to extend):

- A **folder** under `src/` whose name does **not** start with `_` is a *bundle*.
  Its `index.scss` is compiled to `dist/<folder>.min.css`. Drop a new
  `src/<name>/index.scss` and it is built automatically.
- A **file or folder** starting with `_` is shared content (a Sass *partial* /
  partials folder), pulled in via `@use` and never compiled on its own.

`dist/` is generated and git-ignored (only minified output is produced). It is
built on `npm install` (`prepare`), on `npm publish` (`prepack`), and in CI to
attach artifacts to releases.

## Configuration

Each bundle has its own config partial in its folder — `src/main/_config.scss`
and `src/effects/_config.scss` — since the two bundles share no settings.

For `main`, `$breakpoints` is the single source of truth: one map drives all
responsive utilities and the `[container]` ladder. Each breakpoint has a `min`
(the `min-width` threshold) and an optional `container` (the `[container]`
max-width from that step up; omit it to keep the container fluid there). Other
`main` knobs are scales (`$sz-max`/`$space-max`/`$gap-max`/`$lc-max`) and
typography tokens. For `effects`, `$durations` is the duration map.

Every variable has `!default`, so a consumer overrides it **before** loading the
relevant bundle:

```scss
@use '@cat-of-summer/st-style/scss/main/config' with (
  $breakpoints: (
    xs: (min: 360px,  container: 340px),
    sm: (min: 576px,  container: 540px),
    md: (min: 768px,  container: 720px),
    lg: (min: 1440px, container: 1320px),
  ),
  $space-max: 40
);
@use '@cat-of-summer/st-style/scss/main';

@use '@cat-of-summer/st-style/scss/effects/config' with (
  $durations: (fast: 0.2s, slow: 1s)
);
@use '@cat-of-summer/st-style/scss/effects';
```

Runtime theming (colours, step sizes, durations) is done with CSS custom
properties — override `--space-step`, `--fs-h1`, `--td-fast`, … in your own CSS.

## Releasing

Releases are triggered by **pushing a `v*` tag** (not by ordinary pushes):

```bash
git tag v0.3.2
git push origin v0.3.2
```

`.github/workflows/release.yml` builds `dist/`, creates a GitHub Release with
`main.min.css` and `effects.min.css` attached, and — when the environment
variable `PUBLISH_METHOD=npm` is set — publishes the package to **npm**
(registry.npmjs.org) and **GitHub Packages**. The published version is derived
from the tag (`v0.3.2` → `0.3.2`), so the tag is the source of truth. Ordinary
pushes run only `ci-cd.yml`, which validates that the SCSS compiles.

## A. Use via npm

Пакет опубликован в публичном реестре npm — токен и `.npmrc` не нужны.

### 1. Установить

```bash
npm install @cat-of-summer/st-style
```

### 2. Использовать

Скомпилированный CSS:

```js
import '@cat-of-summer/st-style/main.css';
import '@cat-of-summer/st-style/effects.css';
```

Или SCSS-источник с переопределением конфига (см. **Configuration** выше):

```scss
@use '@cat-of-summer/st-style/scss/main/config' with (
  $breakpoints: ( … )
);
@use '@cat-of-summer/st-style/scss/main';
```

## B. Скачать артефакты релиза

К каждому GitHub Release прикреплены скомпилированные файлы:

```bash
gh release download v0.3.2 -R cat-of-summer/ST-style---framework
```
