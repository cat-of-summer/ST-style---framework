# st-style

Attribute-driven CSS utility framework. Authored in SCSS, shipped as compiled CSS.

- **`main`** — layout/typography/spacing/grid/display utilities + reset.
- **`effects`** — hover/animation effects (`scale`, `pulse`, `float`, `ripple`, …).

Markup uses attributes instead of classes:

```html
<section container>
  <div grid="gap-4">
    <article col="12 md-6" p="4 md-8" tx="p">…</article>
  </div>
</section>
<button scale="hover" shadow="hover active">Click</button>
```

## Масштабирование

`font-size` у `html` задаётся в `vw` отдельно на каждом брейкпоинте:
`font / design × 100vw`. На эталонной ширине `design` получается `1rem = font`
(по умолчанию `design` = `min` брейкпоинта, `font` = 10px). Шрифты (`--fs-*`),
отступы (`--space-step` = 0.4rem) и max-width `[container]` заданы в `rem`, поэтому
внутри брейкпоинта вся раскладка масштабируется пропорционально ширине окна и
выглядит одинаково: md на 768px и на 1000px — одна и та же картинка, просто крупнее.
На границе брейкпоинта масштаб скачком переходит к шкале следующего. Ниже первого и
выше последнего брейкпоинта масштабирование продолжается.

| ширина | 1rem | h1 (3.2rem) |
|--------|------|-------------|
| 768px (md) | 10px | 32px |
| 1023px (md) | 13.3px | 42.6px |
| 1024px (lp) | 10px | 32px |

Размеры из макета переводятся делением на `font`: 16px → `1.6rem`, 320px → `32rem`.

```scss
@use '@cat-of-summer/st-style/scss/main/config' with (
  $breakpoints: (
    xs: (min: 360px,  design: 375px,  container: 343px),
    md: (min: 768px,  container: 720px),
    lg: (min: 1280px, design: 1440px, font: 12px, container: 1320px),
  ),
  $font-sizes: (h1: 4rem, h2: 3rem, h3: 2.4rem, h4: 2rem, h5: 1.8rem, h6: 1.6rem, p: 1.4rem),
);
@use '@cat-of-summer/st-style/scss/main';
```

Без пересборки токены переопределяются в CSS (`:root { --fs-h1: 4rem }`), шкала — правилом
на `html`. `[tx="h1"]` ставит размер токена на любой элемент, свой размер —
`tx style="--tx: 1.8rem"` или просто `font-size: 1.8rem`.

> [!warning]
> Шрифт в `vw` почти не реагирует на масштаб браузера (Ctrl +/−): при зуме меняется
> ширина вьюпорта в CSS-пикселях, и `1rem` пересчитывается обратно. Это плата за
> жёсткое масштабирование макета.

## Development

```bash
npm install      # installs sass, builds dist/ via the prepare script
npm run build    # compile src/ → dist/*.min.css
npm run watch    # rebuild on change
```

Source layout:

```
src/
  main/      index.scss + _*.scss partials  # → dist/main.min.css
             _config.scss (build config), _media.scss (SCSS helpers, no CSS)
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
responsive utilities, the `html` font-size scale and the `[container]` ladder.
Each breakpoint has a `min` (the `min-width` threshold) and optional `design`
(mockup width, default = `min`), `font` (1rem at that width, default
`$font-size` = 10px), `container` (the `[container]` max-width in px at the
design width, emitted in rem; omit it to keep the container fluid there) and
`gutter` (the `[container]` horizontal padding in px at the design width; a step
without it keeps the previous one). Other
`main` knobs are scales (`$space-max`/`$gap-max`/`$lc-max`), `$space-step` and
the typography tokens `$font-sizes`/`$font-weights`. For `effects`, `$durations`
is the duration map.

Project SCSS gets the same breakpoints from `scss/main/media` (`up`, `down`,
`between`, `rem`). Configure once in a project partial and `@use` it everywhere:

```scss
// _st.scss
@forward '@cat-of-summer/st-style/scss/main/config' with ($breakpoints: ( … ));
@forward '@cat-of-summer/st-style/scss/main/media';

// any file
@use 'st';
.card { @include st.up(lp) { padding: st.rem(40px, lp); } }
```

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
git tag v1.2.3
git push origin v1.2.3
```

`.github/workflows/ci-cd.yml` (reusable workflow from `cat-of-summer/git_toolkit`)
runs on every push. On a `v*` tag it additionally builds `dist/`, creates a GitHub
Release with `main.min.css` and `effects.min.css` attached and, with
`PUBLISH_METHOD=npm`, publishes the package to **npm** (registry.npmjs.org). The
published version is derived from the tag (`v1.2.3` → `1.2.3`), so the tag is the
source of truth.

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
gh release download v1.2.3 -R cat-of-summer/ST-style---framework
```
