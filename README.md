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

Releases are triggered by **pushing a tag** (not by ordinary pushes):

```bash
# bump "version" in package.json, commit, then:
git tag v0.1.0
git push origin v0.1.0
```

`.github/workflows/release.yml` builds `dist/` and creates a GitHub Release with
`main.min.css` and `effects.min.css` attached. Ordinary pushes run only
`ci.yml`, which validates that the SCSS compiles.

## A. Install from the (private) repository

The repository is private, so consumers authenticate with a read-only token.

1. Create a **fine-grained PAT**: GitHub → Settings → Developer settings →
   Fine-grained tokens → repository `css_projects`, permission **Contents:
   Read-only**.
2. Install a tagged version (the `prepare` script compiles `dist/` automatically):

   ```bash
   npm install "git+https://<PAT>@github.com/cat-of-summer/css_projects.git#v0.1.0"
   ```

   Or declare it in `package.json` and keep the token out of the URL (better for CI):

   ```json
   "dependencies": {
     "@cat-of-summer/st-style": "git+https://github.com/cat-of-summer/css_projects.git#v0.1.0"
   }
   ```

   ```bash
   git config --global url."https://x:${GH_TOKEN}@github.com/".insteadOf "https://github.com/"
   npm install
   ```

3. Use the compiled CSS:

   ```js
   import '@cat-of-summer/st-style/main.css';
   import '@cat-of-summer/st-style/effects.css';
   ```

   Or import the SCSS source and override config (see **Configuration** above).

> ⚠️ `npm ci --ignore-scripts` skips `prepare`, so `dist/` won't be built. In
> such pipelines, add `sass` and run `npm run build` (or compile the SCSS) yourself.

## B. CDN (after publishing — future)

While the repository is private there is no public CDN: jsDelivr/unpkg only serve
public sources, and a token can't be placed in a browser URL. Once the package is
published to public npm (`npm publish` — `prepack` compiles `dist/` into the
tarball), the CDN works with no project changes:

```
https://cdn.jsdelivr.net/npm/@cat-of-summer/st-style@0.1.0/dist/main.min.css
https://cdn.jsdelivr.net/npm/@cat-of-summer/st-style@0.1.0/dist/effects.min.css
```

## C. Download release artifacts (now)

Each GitHub Release has the compiled files attached. For a private repo,
downloading requires authentication:

```bash
gh release download v0.1.0 -R cat-of-summer/css_projects
```
