# st-style

Attribute-driven CSS utility framework. Authored in SCSS, shipped as compiled CSS.

- **`main`** — layout/typography/spacing/grid/display utilities + reset.
- **`effects`** — hover/animation effects (`scale`, `pulse`, `float`, `ripple`, …).

Markup uses attributes instead of classes:

```html
<section container>
  <div grid gap-4>
    <article col="12 md-6" p="4 md-8" tx="p" fs="1 md-2">…</article>
  </div>
</section>
<button scale="hover" shadow="hover active">Click</button>
```

## Container scaling

`[container]` drives fluid, container-relative spacing. All spacing utilities
(`[m]`/`[p]`/`[gap]`) are multiples of `--space-step`; inside a scaling **source**
`--space-step` becomes `cqw`, so the whole subtree scales with the container's
width. Font-size scales in parallel via `--cq-fs` (calibrated so it matches the
per-breakpoint design px at 100% container width). Три оси задаются одним
атрибутом, токены через пробел:

| ось | токены | что делает |
|-----|--------|-----------|
| **query / static** | `query`, `static`, `md-query`, `lg-static`, … | per-breakpoint: `query` — элемент становится источником (потомки масштабируются в `cqw`); `static` — фиксированный px. `static` побеждает при конфликте. |
| **число** | `1`, `md-2`, `lg-5`, … | per-breakpoint cq-step: `N → N * $cq-unit` cqw (build-time `$cq-unit = 0.4cqw`, т.е. `1 → 0.4cqw` = bare `query`, `2 → 0.8cqw`, `5 → 2cqw`). На источнике — шаг для потомков; на голом `[container]` — переопределяет шаг **относительно предка-источника**, сам источником не становясь. |
| **block** | `block` | глобальный флаг: где `query` активен, источник ещё и по высоте (`container-type: size`, включает `cqh`). Под `static` игнорируется. |

```html
<!-- cqw до md, фикс px md–lg, крупнее (2cqw) от lg -->
<section container="query md-static lg-5">
  <article p="4">…</article>

  <!-- ребёнок: свой шаг 0.8cqw ОТНОСИТЕЛЬНО секции-источника, не новый источник -->
  <div container="md-2 lg-1"><p p="4">…</p></div>
</section>
```

Голый `[container]` — только лэйаут (ширина/центрирование/max-width-ладдер), **не**
источник масштабирования; добавь `query`, чтобы включить `cqw`.

**Множитель — рантайм.** `--cq-step` — множитель отступов внутри `query`, полный
аналог `--space-step` (снаружи): правило `@container` подставляет `--cq-step` в
`--space-step`. Переопредели его в CSS/`style`, чтобы ремасштабировать контейнер:

```html
<div container="query" style="--cq-step: 0.6cqw">…</div>   <!-- как style="--space-step: …" -->
```

Токены `query`/число — шорткаты для `--cq-step`. Build-time конфиг
(`src/main/_config.scss`): `$cq-unit` (cqw в одном числовом шаге), `$cq-max` (верхняя
граница чисел). Рантайм-переменные: `--cq-step` (множитель) и `--cq-fixed` (фикс-шаг
для `static`, по умолчанию `= --space-step`).

**Сырой `cqw` вручную.** Если пишешь `font-size: 4cqw` в своём CSS — поставь
`query` на предке: он задаёт `container-type: inline-size`, и `cqw` резолвится
относительно него. Но сырой `cqw` **не выключается** токеном `static` (он зависит
от `container-type`, а не от имени `query-ctx`). Штатный шрифт (`h1`–`p`, `[tx]`,
`--fs-*`) переключается fluid↔fixed автоматически — он идёт через `--font-size` ←
`--cq-fs` (под `query` калиброванный cqw, под `static` фикс px). Используй эти
токены, а не сырой `cqw`.

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
`main` knobs are scales (`$fs-max`/`$space-max`/`$gap-max`/`$lc-max`), the fluid
typography ramp (`$fs-step` default anchors + `$font-sizes-bp` per-breakpoint
overrides, `$fs-scale-step`) and
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
