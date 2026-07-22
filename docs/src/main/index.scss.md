<!-- DOCGEN:START -->
# index.scss
<!-- DOCGEN:END -->

# Бандл `main`

Исходник: `src/main/index.scss` → собирается в `dist/main.min.css`. Authored в SCSS (partials в `src/main/`, конфиг в `src/main/_config.scss`); сборка — `npm run build`. Этот документ описывает **скомпилированный** CSS и разметку.

## Что это

`main` — основной бандл CSS-фреймворка ST_style. Реализует систему утилитарных HTML-атрибутов, CSS-сброс, типографику, систему отступов, grid-сетку, управление видимостью и базовые компоненты (`icon`, `mask`, `editor`).

**Ключевой принцип**: стили управляются через HTML-атрибуты (`mt="6"`, `col="12 lg-3"`, `ds="none lg-block"`), а не классы. Под капотом — CSS Custom Properties: атрибут устанавливает переменную, а правило-«применятель» читает эту переменную.

**Подход к адаптивности**: mobile-first. Базовые значения — без медиа-запроса (для `xs`, ≥0px). Для каждого брейкпоинта добавляется `min-width` медиа-запрос, который переопределяет CSS Custom Property.

---

## Подключение

Репозиторий приватный. Установка через npm по токену (см. корневой `README.md`):

```bash
npm install "git+https://<PAT>@github.com/cat-of-summer/css_projects.git#v0.1.0"
```

```js
import '@cat-of-summer/st-style/main.css';      // → dist/main.min.css
import '@cat-of-summer/st-style/effects.css';   // → dist/effects.min.css
```

CDN (jsDelivr `/npm/`) заработает после публикации пакета в публичный npm:

```
https://cdn.jsdelivr.net/npm/@cat-of-summer/st-style@0.1.0/dist/main.min.css
```

Кастомизация при сборке — `@use '.../scss/main/config' with (...)` (см. `README.md`).

---

## Брейкпоинты

Единая шкала задаётся картой `$breakpoints` в `src/main/_config.scss` и управляет
утилитами **и** контейнером. Базовое (без префикса) значение действует с ≥0px;
префикс брейкпоинта подключается с его `min-width`.

| Префикс | min-width | Описание               |
|---------|-----------|------------------------|
| *(нет)* | 0px       | Базовое, все экраны    |
| `xs`    | 360px     | Телефон                |
| `sm`    | 576px     | Большой телефон        |
| `md`    | 768px     | Планшеты               |
| `lp`    | 1024px    | Ноутбуки               |
| `lg`    | 1280px    | Широкие экраны         |
| `dt`    | 1536px    | Десктопы               |
| `xl`    | 1920px    | Широкоформатные        |

> **Note:** базовое (безпрефиксное) значение действует на всех ширинах. `m="3 lg-6"` —
> это «3 везде, 6 на lg+». `m="xs-3"` — 3 начиная с ≥360px. Имена/пороги брейкпоинтов
> меняются в одном месте — `$breakpoints`.

---

## `:root` — кастомные свойства

### Базовый шрифт и ramp

```css
--font-size: 10px;                     /* база (env): ramp px / cqw в query */
--fs-scale:  1;                        /* групповой множитель [fs], наследуется */

/* объявлена на * (не в :root!), чтобы пересчитываться НА КАЖДОМ элементе */
* { --fs: calc(var(--font-size) * var(--fs-scale)); }   /* эффективная база элемента */
```

`--font-size` — база всей типографики. Токены `--fs-*` — **безразмерные множители**;
реальный размер считается прямо в свойстве: `font-size: calc(var(--fs-h1) * var(--fs))`.

> **Почему `--fs` на `*`, а не в `:root`.** CSS-переменные наследуют уже
> **подставленное** значение: `--fs`, объявленная в `:root`, «заморозила» бы там
> `--font-size` и `--fs-scale`, и групповой `[fs]` / fluid-в-`query` не работали бы
> (потомок не переподставляет свои значения). Объявление на `*` заставляет `--fs`
> вычисляться в контексте каждого элемента — с его наследуемыми `--font-size`/`--fs-scale`.

На отступы, grid и `max-width` контейнера `--font-size` **не** влияет.

**Ramp — fluid `clamp()` по якорям.** На каждый брейкпоинт эмитится
переменная-якорь `--font-size-<bp>` (плюс `--font-size-base` для `<xs`):

```css
--font-size-base: 10px;  --font-size-xs: 10.75px;  --font-size-sm: 11.5px;
--font-size-md: 12.25px; --font-size-lp: 13px;     --font-size-lg: 13.75px;
--font-size-dt: 14.5px;  --font-size-xl: 15.25px;   /* по умолчанию 10px + n·0.75px */
```

Между двумя соседними якорями `--font-size` **плавно** интерполируется по `100vw`
(один `clamp()`-сегмент на интервал), поэтому переход непрерывный, а в самих
брейкпоинтах значение точно равно якорю. Итог: body ≈12→18px, h1 ≈32→49px без
скачков; отступы остаются на своей шкале.

**Свои значения из макета.** Задай якоря в проектном `:root` (глобально — ramp
считается на `:root`):

```css
:root { --font-size-md: 16px; --font-size-lg: 20px; --font-size-xl: 22px; }
```

Либо в build-time конфиге картой `$font-sizes-bp: (md: 16px, lg: 20px, …)`
(незаданные брейкпоинты донастраиваются линейно из `$fs-step`). Значения в точках
точные; наклон между ними печётся при сборке (CSS не умеет делить `length/length`,
поэтому коэффициент при `vw` — build-time). Для точной fluid-параллели **внутри**
`container="query"` задавай якоря в конфиге — оттуда же берётся cqw-калибровка.

> Один общий `clamp()` через все точки невозможен (это один линейный участок).
> Поэтому — по сегменту `clamp()` на интервал; media-запрос лишь переключает
> сегмент, ступеней нет.

> `1rem` теперь зависит от ширины (не фиксированные 10px). В разметке опирайся на
> токены (`tx="h2"`, `--fs-*`), а не на сырые `rem`.

### Размеры шрифтов

Токены — безразмерные множители (`--fs-h1: 3.2`, `--fs-p: 1.2`); applier домножает
их на `--fs` (`font-size: calc(var(--fs-h1) * var(--fs))`), поэтому размер
масштабируется вместе с ramp, `[fs]`-множителем и container-query. Значения px ниже —
для базового брейкпоинта (`--font-size: 10px`):

| Переменная  | Множитель | px (база) |
|-------------|-----------|-----------|
| `--fs-h1`   | ×3.2      | 32px |
| `--fs-h2`   | ×2.4      | 24px |
| `--fs-h3`   | ×2.0      | 20px |
| `--fs-h4`   | ×1.8      | 18px |
| `--fs-h5`   | ×1.6      | 16px |
| `--fs-h6`   | ×1.4      | 14px |
| `--fs-p`    | ×1.2      | 12px |

**Свои токены** — тоже безразмерные множители. Добавь ключ в карту `$font-sizes`
конфига (сгенерит `[tx="p1"]`), либо задай рантайм-переменную и примени через
`--tx-mult` (или прямым `calc`):

```css
:root { --fs-p1: calc(1.1 * var(--fs-p)); }   /* = 1.32 (×1.1 от p) */
```
```html
<p tx style="--tx-mult: var(--fs-p1)">…</p>
<p style="font-size: calc(var(--fs-p1) * var(--fs))">…</p>   <!-- эквивалент -->
```

> Применяй множитель через реальный `font-size` (`… * var(--fs)`) — тогда он fluid.
> `style="font-size: var(--fs-p1)"` **не** сработает: `--fs-p1` — множитель, не длина.

### Веса шрифтов

| Переменная        | Значение |
|-------------------|----------|
| `--fw-thin`       | 100      |
| `--fw-extralight` | 200      |
| `--fw-light`      | 300      |
| `--fw-normal`     | 400      |
| `--fw-medium`     | 500      |
| `--fw-semibold`   | 600      |
| `--fw-bold`       | 700      |
| `--fw-extrabold`  | 800      |
| `--fw-black`      | 900      |

### Шкала отступов

```css
--space-step: 4px;
```

**Формула**: `mt="N"` → `margin-top: calc(N * var(--space-step))` = `N × 4px`.

Утилиты `m/mt/mb`, `p/pt/pb`, `gap` хранят **число-множитель** в custom-property (`--mt`, `--mb`, `--pt`, `--pb`, `--gap`, `--gap-x`, `--gap-y`), а applier умножает на `--space-step` через `calc()`. Это позволяет внутри `container="query"` подменить `--space-step` на `cqw` — и **все** отступы автоматически становятся пропорциональны ширине.

Шкала множителей: `0..25` для margin/padding, `1..15` для gap. Масштаб шрифта — отдельно (`[fs]`, `±1..10` шагов по 5%).

---

## CSS Reset

Фреймворк включает полный сброс браузерных стилей:

```css
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0; padding: 0; border: 0;
    font-family: inherit;
    font-style: inherit;
    color: inherit;
    vertical-align: middle;
}
```

- `html`: `font-size: var(--font-size)`, `overflow-x: hidden`, `scroll-behavior: smooth`, `text-size-adjust: none`, `-webkit-font-smoothing: antialiased`, `-moz-osx-font-smoothing: grayscale`, `text-rendering: optimizeLegibility`
- `body`: `user-select: none`, `overflow-x: hidden`, `font-size: var(--font-size)`, `line-height: 1`, `overflow-wrap: break-word`, `hyphens: auto`
- `picture`, `video`, `canvas`, `svg`: `display: block; max-width: 100%; height: auto`
- `img`, `iframe`: `width: 100%; height: 100%; object-fit: cover; object-position: center`
- `input`, `textarea`, `button`: `font-size: var(--fs-p)`, `outline: none` при фокусе
- `textarea`: `resize: vertical; field-sizing: content`
- `table`: `border-collapse: collapse; border-spacing: 0`
- `li`: `list-style: none`
- `:disabled`: `cursor: not-allowed`
- `h1–h6`,`p`: `font-weight: inherit; overflow-wrap: break-word`
- `h1–h6`: `text-wrap: balance`; `p`: `text-wrap: pretty`
- `h1–p`: размеры из `--fs-*` переменных
- `button`: без фона и бордера
- `a`, `button`: `cursor: pointer`

### Кросс-браузерные правки

Reset фреймворка делает два «агрессивных» шага — `user-select: none` на `body` и
`display: block` на медиа (`picture/video/canvas/svg`). Чтобы они не ломали штатное
поведение, добавлены точечные восстановления:

- **`html { text-size-adjust: none }`** — отключает раздувание шрифта в landscape на
  мобильном Safari (с `-webkit-` префиксом).
- **`:where(input, textarea) { -webkit-user-select: auto }`** — на Safari `user-select: none`
  у `body` блокирует выделение и редактирование текста в полях; правило возвращает ввод.
- **`:where(textarea) { white-space: revert }`** — фикс переноса строк в `<textarea>` (Safari).
- **`::placeholder { color: unset }`** — сбрасывает приглушённый UA-цвет плейсхолдера
  (фреймворк ровняет только шрифт плейсхолдера).
- **`:where(meter) { appearance: revert }`** — возвращает `<meter>` возможность стилизации.
- **`:where([contenteditable]:not([contenteditable="false"]))`** — `user-modify: read-write`
  + `-webkit-user-select: auto` + `overflow-wrap: break-word`: редактируемые области остаются
  рабочими, несмотря на `user-select: none` у `body`.
- **`:where(dialog:modal) { all: revert }`** + `:where(summary) { list-style: none }`
  + `::-webkit-details-marker { display: none }` — глобальный сброс `border/margin/padding`
  ломает нативный модальный `<dialog>` и добавляет лишний маркер `<details>`; правила это
  восстанавливают (безвредны, если нативные элементы не используются).
- **`:where([hidden]) { display: none }`** — стоит **последним** в файле. Author-уровневое
  `display: block` на `picture/video/svg/canvas` иначе перебивает UA-правило `[hidden]`
  (specificity у обоих 0,0,0 → выигрывает правило, идущее позже по порядку), и `<svg hidden>`
  оставался бы видимым.

---

## Атрибут `tx` — размер шрифта (именованный токен)

Применяется к **любому** элементу. Устанавливает `font-size` с `!important` из
токенов `--fs-*`. (Раньше это был атрибут `fs`; теперь `fs` — множитель, см. ниже.)

```html
<p tx="h2">Крупный текст</p>
<span tx="h5">Маленький заголовок</span>
<div tx="p">Обычный текст</div>
```

| Значение  | Множитель | px (база) |
|-----------|-----------|-----------|
| `tx="h1"` | ×3.2      | 32px |
| `tx="h2"` | ×2.4      | 24px |
| `tx="h3"` | ×2.0      | 20px |
| `tx="h4"` | ×1.8      | 18px |
| `tx="h5"` | ×1.6      | 16px |
| `tx="h6"` | ×1.4      | 14px |
| `tx="p"`  | ×1.2      | 12px |

Кастомные ключи добавляются в карту `$font-sizes` конфига → появляется `tx="p1"`.

---

## Атрибут `fw` — вес шрифта

Применяется к **любому** элементу. Устанавливает `font-weight` с `!important`.

```html
<h3 fw="light">Лёгкий заголовок</h3>
<span fw="extrabold">Жирный текст</span>
<p fw="normal">Обычный текст</p>
```

| Значение          | font-weight |
|-------------------|-------------|
| `fw="thin"`       | 100         |
| `fw="extralight"` | 200         |
| `fw="light"`      | 300         |
| `fw="normal"`     | 400         |
| `fw="medium"`     | 500         |
| `fw="semibold"`   | 600         |
| `fw="bold"`       | 700         |
| `fw="extrabold"`  | 800         |
| `fw="black"`      | 900         |

---

## Атрибут `fs` — групповой множитель размера

Знаковый множитель `font-size` для элемента **и его потомков** (наследуется через
`--fs-scale`). Шаг — 5% (`$fs-scale-step`). Потомок переопределяет своим `fs`.

```html
<section fs="2">          <!-- вся группа ×1.10 -->
  <h2>заголовок ×1.10</h2>
  <p>текст ×1.10</p>
  <p fs="d1">этот абзац ×0.95 (переопределил)</p>
</section>
```

**Формула:** `fs="N"` → `--fs-scale: 1 + N×0.05`; `fs="dN"` → `1 − N×0.05`
(`d` = down). `fs="0"` — нейтрально (×1.00).

| Токен     | Множитель |
|-----------|-----------|
| `fs="d4"` | ×0.80 |
| `fs="d2"` | ×0.90 |
| `fs="0"`  | ×1.00 |
| `fs="2"`  | ×1.10 |
| `fs="4"`  | ×1.20 |

**По брейкпоинтам** (mobile-first, больший выигрывает): `fs="lg-2"`, `fs="lg-d2"`.

```html
<div fs="2 lg-4">          <!-- ×1.10 на xs–lp, ×1.20 на lg+ -->
<div fs="d1 md-0">         <!-- ×0.95 → ×1.00 с md -->
```

**Доступно:** `1..10` вверх (`N`) и вниз (`dN`) — `$fs-max` в конфиге — для каждого
брейкпоинта. Масштаб касается только шрифта (не отступов).

> Ставь `fs` на **контейнер-обёртку**. На самом элементе токены/дефолты (`tx`,
> `:where(h1..p)`) сохраняют свой размер (`<p fs="2">` = размер `p` ×1.10), а голый
> `<div>`/`<span>` с `fs` берёт базовый размер ×множитель.

---

## Атрибут `ps` — position элемента

Применяется к **любому** элементу. Устанавливает `position` с `!important`. Значение `centered` делает: `left: 50%; top: 50%; transform: translate(-50%, -50%)`.

```html
<h3 ps="relative">Лёгкий заголовок</h3>
<span ps="absolute centered">Жирный текст</span>
<p ps="fixed">Обычный текст</p>
```

| Значение          | position    |
|-------------------|-------------|
| `ps~="relative"`  | relative    |
| `ps~="absolute"`  | absolute    |
| `ps~="fixed"`     | fixed       |
| `ps~="sticky"`    | sticky      |

Центрирование

```
ps="center"
```

- размещает элемент по центру контейнера
- центрирование происходит по X и Y одновременно

---

Частичное центрирование

```
ps="center-x"
```

- центрирует элемент по горизонтали

```
ps="center-y"
```

- центрирует элемент по вертикали

---

Комбинированное использование

```
ps="absolute center"
ps="fixed center-x center-y"
```

- применяется позиционирование + центрирование

---

Правила интерпретации

1. `ps` всегда определяет поведение position-логики элемента
2. `center` имеет приоритет над частичными модификаторами
3. `center-x` и `center-y` могут использоваться независимо или совместно
4. Центрирование применяется только к позиционируемым элементам (absolute / fixed / sticky)

---

Примеры использования

```
<h3 ps="relative">Title</h3>

<div ps="absolute center">
    Centered modal
</div>

<span ps="fixed center-x">
    Horizontally centered bar
</span>

<p ps="sticky center-y">
    Vertically aligned block
</p>
```

---

## Атрибут `ov` — overflow элемента

Применяется к **любому** элементу. Устанавливает `overflow` с `!important`.

```html
<h3 ov="">Лёгкий заголовок</h3>
<span ov="x">Жирный текст</span>
<p ov="hidden">Обычный текст</p>
<p ov="scroll-x">Обычный текст</p>
```

| Значение          | overflow                                  |
|-------------------|-------------------------------------------|
| `ov=""`            | overflow-x: visible; overflow-y: visible |
| `ov="x"`           | overflow-x: visible; overflow-y: hidden  |
| `ov="y"`           | overflow-x: hidden; overflow-y: visible  |
| `ov="scroll x"`    | overflow-x: auto; overflow-y: hidden     |
| `ov="scroll y"`    | overflow-x: hidden; overflow-y: auto     |
| `ov="hidden"`      | overflow-x: hidden; overflow-y: hidden   |

---

## Система ограничения количества строк в элементе — `lc`

> **Важно**: фреймворк управляет ограничением количества через свойства `-webkit-line-clamp: var(--line-clamp) !important;` `display: -webkit-box !important;` `-webkit-box-orient: vertical !important;` `overflow: hidden !important`, где `--line-clamp` изначально `0`, при значение `0` устанавливается `-webkit-line-clamp: none` и может быть числом **0-10**;

### Синтаксис

```html
<!-- Одно значение (применяется на всех размерах экрана) -->
<p lc="0">       <!-- не применяется -->
<p lc="1">          <!-- 1 строка -->
<p lc="5">        <!-- 5 строк -->

<!-- Responsive: несколько значений через пробел -->
<!-- Значения применяются в порядке брейкпоинтов, ПОСЛЕДНЕЕ выигрывает -->
<p lc="3 lg-6">  <!-- 3 строки на xs/sm/md/lp, 6 строк на lg+ -->
<p lc="4 md-0 lg-10"> <!-- 4 строки → не применяется → 10 строк -->
```

### Доступные значения

Числа **1–10** для каждого брейкпоинта:

```
lc="0"  lc="1"  lc="2"  ...  lc="10"       -- базовые (без префикса, ≥0px)
lc="xs-0" ... lc="xs-10"                    -- ≥360px
lc="sm-0" ... lc="sm-10"                    -- ≥576px
lc="md-0" ... lc="md-10"                    -- ≥768px
lc="lp-0" ... lc="lp-10"                    -- ≥1024px
lc="lg-0" ... lc="lg-10"                    -- ≥1280px
lc="dt-0" ... lc="dt-10"                    -- ≥1536px
lc="xl-0" ... lc="xl-10"                    -- ≥1920px
```

---


## Система отступов — `m`, `mt`, `mb`, `p`, `pt`, `pb`

> **Важно**: фреймворк управляет **только вертикальными** отступами (top / bottom). Горизонтальные (`margin-left`, `margin-right`, `padding-left`, `padding-right`) задаются в компонентных CSS-файлах.

### Атрибуты

| Атрибут | Свойство                             |
|---------|--------------------------------------|
| `m`     | `margin-top` + `margin-bottom`       |
| `mt`    | `margin-top`                         |
| `mb`    | `margin-bottom`                      |
| `p`     | `padding-top` + `padding-bottom`     |
| `pt`    | `padding-top`                        |
| `pb`    | `padding-bottom`                     |

### Синтаксис

```html
<!-- Одно значение (применяется на всех размерах экрана) -->
<section mt="6">       <!-- margin-top: 24px -->
<div mb="12">          <!-- margin-bottom: 48px -->
<article p="5">        <!-- padding-top: 20px + padding-bottom: 20px -->

<!-- Responsive: несколько значений через пробел -->
<!-- Значения применяются в порядке брейкпоинтов, ПОСЛЕДНЕЕ выигрывает -->
<section mt="3 lg-6">  <!-- mt: 12px на xs/sm/md/lp, 24px на lg+ -->
<div mb="4 md-8 lg-12"> <!-- mb: 16px → 32px → 48px -->
```

### Доступные значения

Числа **0–25** (шаг ×4px) для каждого брейкпоинта:

```
mt="0"  mt="1"  mt="2"  ...  mt="25"       -- базовые (без префикса, ≥0px)
mt="xs-0" ... mt="xs-25"                    -- ≥360px
mt="sm-0" ... mt="sm-25"                    -- ≥576px
mt="md-0" ... mt="md-25"                    -- ≥768px
mt="lp-0" ... mt="lp-25"                    -- ≥1024px
mt="lg-0" ... mt="lg-25"                    -- ≥1280px
mt="dt-0" ... mt="dt-25"                    -- ≥1536px
mt="xl-0" ... mt="xl-25"                    -- ≥1920px
```

Те же диапазоны доступны для `mb`, `m`, `p`, `pt`, `pb`.

### Примеры из реального проекта

```html
<section mt="3">                       <!-- секция: отступ сверху 12px -->
<section mt="6">                       <!-- секция: отступ сверху 24px -->
<div mb="12">                          <!-- блок: отступ снизу 48px -->
<nav mt="16">                          <!-- навигация: отступ сверху 64px -->
<button class="button" p="5">          <!-- кнопка: padding по вертикали 20px -->
```

---

## Секции и контейнер

### `section`

Семантический тег `<section>` автоматически получает: `position: relative; width: 100%; margin: auto`.

### Атрибут `container`

Обёртка с адаптивным `max-width` **и** контекстом масштабирования отступов. Применяется к любому элементу. Значение — набор слов-токенов через пробел, задающих **три независимые оси** (все mobile-first, с bp-префиксами):

| Ось | Токены | Что делает |
|-----|--------|-----------|
| **режим** | `query` / `static` (+ `md-query`, `lg-static`, …) | per-breakpoint: `query` делает элемент **источником** — потомки масштабируют отступы в `cqw`; `static` — фиксированные px. При конфликте на одном уровне побеждает `static` (безопасный дефолт — выкл). |
| **шаг** | число: `1`, `md-2`, `lg-4`, … | per-breakpoint интенсивность: шаг = `N × $cq-unit` (build-time `$cq-unit = 0.4cqw`): `1 → 0.4cqw` (= bare `query`), `2 → 0.8cqw`, `5 → 2cqw`. Диапазон `1…$cq-max` (по умолчанию `20`). |
| **ось Y** | `block` (глобально, без bp) | там где активен `query`, источник отслеживает и высоту (`container-type: size`, включает `cqh`). Под `static` игнорируется. |

> **Голый `container` (без `query`/`static`) — только лэйаут** (ширина, центрирование, адаптивный `max-width`). Он **не** источник масштабирования и **не** container-query контекст. Чтобы включить `cqw`, добавь `query`.

```html
<div container>...</div>                        <!-- только лэйаут + max-width, отступы в px -->
<div container="query">...</div>                <!-- источник: отступы масштабируются в cqw -->
<div container="query block">...</div>          <!-- + отслеживание высоты (cqh) -->
<div container="query lg-static">...</div>      <!-- cqw до lg, фикс px от lg -->
<div container="static md-query">...</div>      <!-- фикс px до md, cqw от md -->
<div container="query 2 md-1 lg-5">...</div>    <!-- шаг 0.8cqw → 0.4cqw (md) → 2cqw (lg) -->
```

**Адаптивный `max-width`** применяется ко всем вариантам `container` (значения `container` в `$breakpoints`; ниже первой ступени контейнер fluid — 100%):

| Ширина экрана | max-width      |
|---------------|----------------|
| <360px        | 100% (fluid)   |
| ≥360px (xs)   | 340px          |
| ≥576px (sm)   | 540px          |
| ≥768px (md)   | 720px          |
| ≥1024px (lp)  | 960px          |
| ≥1280px (lg)  | 1200px         |
| ≥1536px (dt)  | 1320px         |
| ≥1920px (xl)  | 1600px         |

Базовые стили: `position: relative; width: 100%; margin: auto` (через `:where()` — нулевая специфичность, легко переопределяется проектом).

### Как работает масштабирование

Все step-утилиты (`m`, `mt`, `mb`, `p`, `pt`, `pb`, `gap`) считаются как `calc(N × var(--space-step))`. По умолчанию `--space-step: 4px` — фикс. Внутри **источника** (`query`) правило `@container` подменяет `--space-step` на `var(--cq-step)` (cqw), и **все** отступы разом становятся пропорциональны ширине контейнера.

**Шрифт** масштабируется параллельно, через `--cq-fs`: внутри `query` правило `@container` подменяет `--font-size` на откалиброванный `cqw`, подобранный так, что при 100% ширине контейнера пиксельный размер `h1`/`tx`/`--fs-*` совпадает с фикс-режимом на этом брейкпоинте (у́же контейнер → плавно меньше). Под `static` шрифт замораживается в px (`--cq-fs: var(--font-size)`). Кастомные токены (`--fs-p1`) вливаются автоматически.

> **`--cq-step` — это множитель, полный аналог `--space-step`, только в `cqw`.** Снаружи контейнера ты ремасштабируешь всё, переопределяя `--space-step`; внутри `query` — переопределяя `--cq-step` (правило `@container` подставляет его в `--space-step`). Токены `query`/число — просто шорткаты, которые проставляют `--cq-step`.

```html
<!-- снаружи: множитель --space-step (px) -->
<div style="--space-step: 6px"><p p="5">5 × 6px = 30px</p></div>

<!-- внутри query: тот же приём, множитель --cq-step (cqw) -->
<div container="query" style="--cq-step: 0.6cqw"><p p="5">5 × 0.6cqw = 3cqw</p></div>
```

«Гонки» px↔cqw нет: cqw-подмена действует, только пока предок несёт служебное имя `query-ctx`; иначе берётся базовое `--space-step` — обычный каскад.

### Токены-шорткаты для `--cq-step`

| Токен | Что ставит в `--cq-step` |
|-------|--------------------------|
| `query` | `$cq-unit` cqw (по умолчанию `0.4cqw`) — «1 шаг» |
| число `N` | `N × $cq-unit` cqw (напр. `5 → 2cqw`); `container="1"` ≡ `query` |
| `static` | `var(--cq-fixed)` — фикс px (по умолчанию = `--space-step`) |

`$cq-unit` и `$cq-max` (верхняя граница чисел) — **build-time** конфиг (`src/main/_config.scss`, меняется через `@use … with (...)`). В рантайме переопределяй `--cq-step` (или `--cq-fixed` для `static`) в CSS/`style` — этого достаточно.

```html
<div container="query">                     <!-- шаг 0.4cqw -->
    <div m="5">margin = 5 × 0.4cqw = 2cqw</div>
    <h1>font-size fluid: при 100% ширине = дизайн-px этого брейкпоинта</h1>
</div>
```

**Пример** при ширине 1200px и `--cq-step: 0.4cqw` (0.4cqw = 4.8px):
- `m="5"` → `5 × 4.8px` = `24px`
- `<h1>` (lg, контейнер 1200px 100%) → `≈44px` (как в фикс-режиме)

### Режим по брейкпоинтам: `query` / `static`

`query` включает cqw, `static` — фикс px. Оба — базовые и с bp-префиксом, mobile-first; больший брейкпоинт побеждает; при конфликте на одном уровне (`query static`) выигрывает `static`.

```html
<div container="query lg-static">...</div>      <!-- cqw до lg (1280px), фикс px от lg -->
<div container="static md-query">...</div>      <!-- фикс px до md, cqw от md -->
<div container="query md-static lg-query">...   <!-- cqw → фикс (md) → снова cqw (lg) -->
```

`static` не просто «снимает источник» — он изолирует поддерево на фикс px даже под внешним cqw-предком (становится query-ctx контейнером с `--cq-step: var(--cq-fixed)`).

### Число как интенсивность (по брейкпоинтам)

```html
<div container="query 2 md-1 lg-5">
    <p p="4">шаг 0.8cqw → 0.4cqw (md) → 2cqw (lg); padding = 4 × шаг</p>
</div>
```

Под `static` число игнорируется (фикс px побеждает — `static` эмитится последним):

```html
<div container="query lg-static lg-5">...</div>  <!-- на lg: фикс px, «5» проигнорирован -->
```

### Источник vs не-источник (шаг относительно родителя)

Источником (container-query контекстом) элемент становится **только** при `query`/`static`. Голый `container` и «числовой» `container` (без `query`/`static`) — **не** источники. Отсюда два разных смысла числа:

```html
<div container="query">                        <!-- ИСТОЧНИК, ширина 1000px, шаг 0.4cqw -->
    <p p="4">4 × 0.4cqw = 1.6cqw = 16px</p>

    <!-- ребёнок БЕЗ query: НЕ источник → число меняет шаг
         ОТНОСИТЕЛЬНО родителя (cqw всё ещё от 1000px) -->
    <div container="2">
        <p p="4">4 × 0.8cqw(1000px) = 3.2cqw = 32px</p>
    </div>

    <!-- ребёнок С query: НОВЫЙ источник → cqw от него самого -->
    <div container="query 2" style="width: 500px">
        <p p="4">4 × 0.8cqw(500px) = 16px</p>
    </div>
</div>
```

Так `container="md-5 lg-1"` на ребёнке меняет интенсивность относительно родителя-источника, а `container="query md-5 lg-1"` переносит точку отсчёта на сам элемент.

> Если над «числовым» контейнером нет ни одного `query`-предка — масштабировать не от чего: правило `@container` не срабатывает, `--space-step` остаётся базовым (число без эффекта). Сырой `cqw` в таком месте резолвится от вьюпорта (дефолт CSS).

### `block` — высота и `cqh`

Глобальный флаг (без bp). Где активен `query`, источник получает `container-type: size` и начинает отслеживать высоту — доступен `cqh`. Под `static` игнорируется.

```html
<!-- cqh работает: size-контейнер отслеживает и ширину, и высоту -->
<div container="query block" style="height: 400px">
    <div style="height: 50cqh"><!-- 200px --></div>
    <div m="5"><!-- margin по-прежнему от ширины (cqw) --></div>
</div>

<!-- cqh НЕ работает: inline-size высоту не отслеживает -->
<div container="query">
    <div style="height: 50cqh"><!-- 0px --></div>
</div>
```

### Сырой `cqw` / `cqh` в проектном CSS

`1cqw` = 1% ширины ближайшего предка-**источника** (`query`/`static`), `1cqh` = 1% его высоты (только под `block`). Источник можно использовать напрямую в проектном CSS:

```css
.card__title { font-size: 3cqw; }
.card__image { height: 25cqh; }   /* нужен container="query block" */
```

> **Голый `container` больше НЕ создаёт container-query контекст** (только лэйаут + `max-width`). Для сырых `cqw`/`cqh` нужен `query`/`static` на предке.

> **`font-size` и брейкпоинты.** Сырой `font-size: 3cqw` **не выключается** токеном `static` (он зависит от `container-type`, а не от имени `query-ctx`). Штатный шрифт (`h1`–`p`, `tx`, `--fs-*`) переключается fluid↔fixed автоматически, потому что идёт через `--font-size` ← `--cq-fs` (правило `@container`): под `query` — калиброванный cqw, под `static` — фикс px. Для своего кода используй эти токены, а не сырой `cqw`:

```html
<div container="query lg-static">
    <h2>fluid до lg, фикс px от lg — автоматически (через --cq-fs)</h2>
    <h2 style="font-size: 6cqw">останется fluid и на lg (static не влияет на сырой cqw)</h2>
</div>
```

### Рантайм-override (аналог `--space-step`)

| Переменная | Дефолт | Аналог | Что делает |
|---|---|---|---|
| `--cq-step` | `0.4cqw` | `--space-step` (px) | множитель отступов внутри `query`; переопредели в CSS/`style`, чтобы ремасштабировать контейнер |
| `--cq-fixed` | `var(--space-step)` | — | фикс-шаг, к которому откатывается `static` |

```html
<div container="query" style="--cq-step: 0.6cqw">крупнее весь контейнер</div>
<div container="static" style="--cq-fixed: 6px">фикс 6px вместо 4px</div>
```

### Вложенность

Источники вкладываются и масштабируются независимо — каждый по своей ширине. `@container` в проектном CSS смотрит на ближайшего предка-источника (служебное имя `query-ctx`; плюс имя `container`).

```html
<div container="query">                              <!-- 1200px → 0.4cqw = 4.8px -->
    <div container="query" style="width: 600px">     <!-- 600px → 0.4cqw = 2.4px -->
        <div m="5"><!-- 5 × 0.4cqw(600px) = 12px --></div>
    </div>
</div>
```

### Частые кейсы

```html
<!-- 1. Просто адаптивная обёртка (без масштабирования) -->
<section mt="6"><div container>...</div></section>

<!-- 2. Fluid, который «замерзает» на десктопе -->
<div container="query lg-static">...</div>

<!-- 3. Масштаб только на мелких, фикс на крупных -->
<div container="query md-static">...</div>

<!-- 4. Наоборот: фикс на мобилке, fluid от планшета -->
<div container="static md-query">...</div>

<!-- 5. Разная «сила» по брейкпоинтам -->
<div container="query 3 md-2 lg-6">...</div>

<!-- 6. Дочерний блок с меньшим шагом относительно секции -->
<div container="query"><aside container="1">...</aside></div>

<!-- 7. Вложенный источник со своим отсчётом + высота (cqh) -->
<div container="query block"><div container="query 2" style="width:50%">...</div></div>

<!-- 8. Переопределить множитель точечно -->
<div container="query" style="--cq-step: 0.5cqw">...</div>
```

### Паттерн вёрстки секции

```html
<section mt="6">
    <div container="query lg-static">
        <!-- отступы масштабируются с шириной до lg, затем фиксируются -->
    </div>
</section>
```

---

## Grid-система — атрибуты `grid` и `col`

### Контейнер `grid`

```html
<div grid="">         <!-- 12-колоночная CSS Grid -->
<div grid="12">       <!-- то же самое, явно -->
<div grid="10">       <!-- 10-колоночная CSS Grid -->
```

Применяет: `display: grid; grid-template-columns: repeat(N, 1fr)`.

Количество колонок хранится в переменной `--grid-columns` (12 по умолчанию).

### Колонки `col`

Дочерние элементы внутри `grid`-контейнера получают атрибут `col`.

**Span (ширина в колонках):**

```html
<div col="6">          <!-- занимает 6 из 12 колонок -->
<div col="12">         <!-- на всю ширину -->
<div col="3">          <!-- 3 из 12 (25%) -->
```

**Responsive span:**

```html
<!-- Несколько значений через пробел — mobile-first -->
<div col="12 lg-3">    <!-- 12 колонок на мобилке, 3 на lg+ -->
<div col="12 md-6 lg-4">  <!-- 12 → 6 → 4 колонки -->
```

**Позиция начала `start`:**

```html
<div col="start-2">        <!-- начать со 2-й колонки (xs) -->
<div col="lg-start-3">     <!-- начать с 3-й колонки только на lg+ -->
<div col="4 start-2">      <!-- span 4, начало со 2-й -->
<div col="4 lg-start-4">   <!-- span 4 (xs), start-4 на lg+ -->
```

**Доступные значения span**: 1–12 для каждого брейкпоинта (`xs`, `sm`, `md`, `lp`, `lg`, `dt`, `xl`).

**Доступные значения start**: `start-1` ... `start-12` для каждого брейкпоинта.

Для управления отступами можно использовать атрибут gap (подробнее в блоке про ds (display)):

```html
<div grid="gap-1">
<div grid="12 gap-x-5">
<div grid="10 gap-y-3">
```

### Полный пример паттерна карточек

```html
<!-- 4 карточки в ряд на десктопе, 1 на мобилке -->
<section mt="6">
    <div container>
        <div class="services" grid="">
            <article col="12 lg-3" sheen="hover" shadow="hover focus" tabindex="0">
                <!-- содержимое карточки -->
            </article>
            <article col="12 lg-3" sheen="hover" shadow="hover focus" tabindex="0">
                <!-- содержимое карточки -->
            </article>
        </div>
    </div>
</section>
```

---

## Атрибут `ds` — управление отображением

Управляет CSS-свойством `display` с `!important`. Позволяет показывать/скрывать элементы на разных брейкпоинтах.

### Значения

| Значение  | display       |
|-----------|---------------|
| `none`    | none          |
| `block`   | block         |
| `flex`    | flex          |
| `grid`    | grid          |
| `inline`  | inline        |

### Min-width (mobile-first)

```html
<div ds="none">                 <!-- скрыт на всех экранах -->
<div ds="flex">                 <!-- flex на всех экранах -->
<div ds="none lg-block">        <!-- скрыт до lg, block на lg+ -->
<div ds="block lg-none">        <!-- block до lg, скрыт на lg+ -->
<div ds="none md-flex lg-none"> <!-- flex только на md–lp -->
```

Префиксы: `xs-` (≥360px), `sm-` (≥576px), `md-`, `lp-`, `lg-`, `dt-`, `xl-`. Базовое значение — без префикса (≥0px).

### Gap. Также `gap` используется для управления расстоянием между дочерними элементами контейнера, работает для `grid` и `flex` контейнеров.

Префиксы: `gap-`, `gap-x-`, `gap-y`.

1. `gap-*` задаёт базовый общий промежуток.
2. `gap-x-*` переопределяет только горизонтальную ось.
3. `gap-y-*` переопределяет только вертикальную ось.

Возможные значения от 0 до 15.

### Паттерн из реального проекта

```html
<!-- Кнопка только на мобилке -->
<div container mt="6" ds="block lg-none">
    <button class="button button--wide button--orange" p="5">Забронировать</button>
</div>

<!-- Блок с блокцитатой только на десктопе -->
<div ds="none lg-flex gap-4" class="gallery__blockquote_container">...</div>

<!-- Кнопки навигации слайдера только на десктопе -->
<div class="swiper-button-prev" ds="none lg-grid gap-x-2 gap-y-9">...</div>
```

---

## Атрибут `icon`

Создаёт flex-контейнер для иконок с увеличенной зоной клика.

```html
<div icon="">
    <svg ...></svg>
</div>

<!-- Квадратный (aspect-ratio 1:1) -->
<div icon="square">...</div>

<!-- Inline (не нарушает поток текста) -->
<span icon="inline">...</span>
```

**Что применяется:**
- `display: flex; justify-content: center; align-items: center`
- `cursor: pointer`
- `width: max-content; height: max-content`
- `box-sizing: content-box`
- `::after` — расширяет зону клика на `1rem` во все стороны (прозрачный слой, `z-index: 10`)
- Дочерние элементы: `flex: auto`

**Паттерн для иконки через маску:**

```html
<div icon="square" mask="" class="color_violet" style="--mask: url('/icons/workspace.png')"></div>
```

---

## Атрибут `mask`

CSS-маска для монохромных SVG/PNG иконок. Позволяет управлять цветом иконки через CSS-переменную `--color`.

```html
<!-- Базовый синтаксис -->
<div mask="" style="--mask: url('/path/to/icon.svg'); --color: #542D8C"></div>

<!-- Вместе с icon и цветовым классом -->
<div icon="square" mask="" class="color_violet" style="--mask: url('/icons/icon.png')"></div>
```

**Как работает:**
```css
*[mask] {
    mask: var(--mask) no-repeat center / contain;
    background-color: var(--color);  /* цвет иконки */
}
```

Переменные: `--mask` (URL), `--color` (цвет, по умолчанию `#000`).

> **Паттерн**: сам элемент становится цветной заливкой, «вырезанной» по форме маски. Цвет задаётся через CSS-класс (`.color_violet`, `.color_orange`) или напрямую через `--color`.

---

## Атрибут `fluid`

Подстраивает размер элемента под контент (не растягивается на всю ширину/высоту).

```html
<div fluid="">  <!-- width: fit-content; height: fit-content -->
```

---

## Атрибут `cover`

Растягивает элемент на 100% ширины и высоты родителя.

```html
<div cover="">  <!-- width: 100%; height: 100% -->
```

---

## Класс `.editor`

Восстанавливает типографические стили для HTML-контента, генерируемого CMS (WYSIWYG-редактором). По умолчанию CSS Reset обнуляет все отступы — `.editor` их возвращает.

```html
<div class="editor">
    <h2>Заголовок</h2>
    <p>Текст абзаца</p>
    <ul><li>Пункт</li></ul>
    <table>...</table>
</div>
```

**Что восстанавливается:**
- `h1–h6`: `margin: 1.6rem 0 0.8rem`
- `p`: `margin: 0 0 1rem`
- `a`: `color: blue; text-decoration: underline`
- `strong`, `b`: `font-weight: var(--fw-bold)`
- `em`, `i`: `font-style: italic`
- `ul`, `ol`: `margin: 0 0 1rem 2rem; list-style-position: inside`
- `li`: `list-style: initial; margin-bottom: 0.5rem`
- `blockquote`: `padding-left: 1rem`
- `hr`: `border-top: 1px solid #ccc; margin: 2rem 0`
- `table`: `width: 100%; border-collapse: collapse`
- `th`, `td`: `padding: 0.5rem 1rem; border: 1px solid #ccc`
- `iframe`: `aspect-ratio: 16/9`
- `pre`, `code`: `font-family: monospace; background: #f4f4f4`

---

## Формы — `label`, `checkbox`, `radio`

Фреймворк предоставляет базовую архитектуру для кастомных чекбоксов/радио.

**Обёртка `label`:**
```css
label {
    position: relative;
    cursor: pointer;
}
label > input, label > textarea {
    width: 100%; height: 100%; resize: vertical;
}
```

**Кастомный checkbox/radio:**

```html
<label>
    <input type="checkbox">
    <span checkbox>
        <!-- кастомная SVG-галка -->
        <svg>...</svg>
    </span>
    Текст подписи
</label>
```

Нативный `input` скрывается через `opacity: 0; position: absolute; width: 1px; height: 1px`. Видимый элемент с атрибутом `checkbox` или `radio` — кастомный.

---

## Структура HTML-документа (рекомендуемый паттерн)

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <!-- CSS: сначала фреймворк, потом проектные стили -->
    <link rel="stylesheet" href="main.min.css">
    <link rel="stylesheet" href="effects.min.css">
    <link rel="stylesheet" href="root.css">        <!-- переменные проекта -->
    <link rel="stylesheet" href="header.css">
    <link rel="stylesheet" href="main.css">
    <link rel="stylesheet" href="footer.css">
</head>
<body>

<header>
    <div container>
        <!-- шапка с навигацией -->
    </div>
</header>

<main>

    <!-- Каждая секция: section > [container] > контент -->
    <section mt="3">
        <div container>
            <div class="section__header">
                <div class="section__title">
                    <h2>Заголовок секции</h2>
                </div>
                <div class="section__subtitle">
                    <h3 fw="light">Подзаголовок</h3>
                </div>
            </div>
        </div>
    </section>

    <!-- Секция с grid-карточками -->
    <section mt="6">
        <div container>
            <div class="cards" grid="">
                <article col="12 lg-3" sheen="hover" shadow="hover" tabindex="0">
                    <!-- карточка -->
                </article>
            </div>
        </div>
    </section>

</main>

<footer>
    <div container>
        <!-- подвал -->
    </div>
</footer>

</body>
</html>
```

---

## `root.css` — переопределение проектных переменных

Каждый проект создаёт `root.css`, который расширяет фреймворк проектными цветами, размерами и компонентами:

```css
html {
    font-family: 'YourFont';
}

:root {
    /* Цветовая палитра проекта */
    --color_orange: #F15A24;
    --color_orange__hover: #D14E1E;
    --color_orange__active: #B9451A;
    --color_violet: #542D8C;
    --color_violet__hover: #452472;
    --color_violet__active: #381e5e;
    --color_violet__disabled: #B4ABC7;
    --color_violet__pale: rgba(84, 45, 140, 0.1);

    /* Переопределение стандартных размеров */
    --mask: url(""); /* базовый путь для масок */
}

/* Переопределение эффектов фреймворка */
*[underline] {
    --underline-offset: -3px;
}
```

**Общий порядок подключения стилей:**
1. Внешние библиотеки (Swiper и т.д.)
2. `main.min.css` — базовый фреймворк
3. `effects.min.css` — анимации
4. `root.css` — проектные переменные
5. `header.css`, `main.css`, `footer.css`, `modals.css` — компоненты

---

## Полный справочник атрибутов

| Атрибут       | Описание                              | Пример                            |
|---------------|---------------------------------------|-----------------------------------|
| `tx`          | Размер шрифта (именованный токен)     | `tx="h2"`, `tx="p"`               |
| `fs`          | Групповой множитель размера (±шаги 5%)| `fs="2"`, `fs="d2 lg-4"`          |
| `fw`          | Толщина шрифта                        | `fw="light"`, `fw="extrabold"`    |
| `m`           | margin-top + margin-bottom            | `m="4"`, `m="4 lg-8"`            |
| `mt`          | margin-top                            | `mt="6"`, `mt="3 lg-6"`          |
| `mb`          | margin-bottom                         | `mb="12"`                         |
| `p`           | padding-top + padding-bottom          | `p="5"`                           |
| `pt`          | padding-top                           | `pt="4 lg-8"`                     |
| `pb`          | padding-bottom                        | `pb="4"`                          |
| `grid`        | CSS Grid контейнер                    | `grid=""`, `grid="10"`           |
| `col`         | Span и позиция в grid                 | `col="12 lg-3"`, `col="start-2"` |
| `ds`          | Display (показать/скрыть)             | `ds="none lg-block"`, `ds="flex"` |
| `container`   | Адаптивный контейнер; оси `query`/`static`, число (шаг), `block` | `container`, `container="query lg-static"`, `container="query 2 md-1"`, `container="query block"` |
| `icon`        | Flex-контейнер иконки                 | `icon=""`, `icon="square"`       |
| `mask`        | CSS-маска для иконок                  | `mask=""` + `style="--mask: url(...)"` |
| `fluid`       | fit-content размеры                   | `fluid=""`                        |
| `checkbox`    | Кастомный стилизуемый чекбокс        | атрибут у `span` внутри `label`  |
| `radio`       | Кастомная стилизуемая радио-кнопка   | атрибут у `span` внутри `label`  |
| `lc`          | Line-clamp (ограничение строк)        | `lc="3"`, `lc="3 lg-0"`           |
| `ps`          | position элемента                     | `ps="absolute center"`            |
| `ov`          | overflow                              | `ov="hidden"`, `ov="scroll y"`    |

---

## Прогрессивные техники

### `@property` — прогрессивная надстройка

Часть переменных зарегистрирована через `@property`. Это **не обязательная часть** фреймворка — корректность наследования обеспечивается локальным reset на родовых селекторах (`*[m]`, `*[col]`, `*[ds]` и т.д.). `@property` — поверх, для браузеров, которые поддерживают (Chrome 85+, Firefox 128+, Safari 16.4+):

| Свойство          | Тип                    | Initial  | Inherits |
|-------------------|------------------------|----------|----------|
| `--space-step`    | `<length>`             | `4px`    | да       |
| `--fs-scale`      | `<number>`             | `1`      | да       |
| `--cq-step`       | `<length>`             | `0.4cqw` | да       |
| `--grid-columns`  | `<integer>`            | `12`     | нет      |
| `--col-span`      | `<integer>`            | `12`     | нет      |
| `--col-start`     | `<integer> \| auto`    | `auto`   | нет      |

**Бонусы там, где поддержано:**
- **Type-safety.** Опечатка типа `style="--space-step: 4pxx"` не ломает `calc()` — браузер откатывается к `initial-value`.
- **Анимация.** `transition: --space-step 0.3s` начинает работать — можно плавно менять spacing на hover/focus.

В браузерах без `@property` — те же самые селекторы и custom-properties работают как обычные. Никакого degraded experience.

### `:where()` для reset

Все reset-стили (`html`, `body`, `*`, `img`, `h1–p`, `[container] max-width`) обёрнуты в `:where()` — специфичность **0,0,0**. Проектный класс перебивает reset без `!important`:

```css
/* Проектный CSS */
.hero h1 { font-size: 48px; }   /* перебивает :where(h1) { font-size: 3.2em } */
.wide-section[container] { max-width: 1800px; }  /* перебивает :where([container]) */
```

**Утилитарные атрибуты НЕ обёрнуты** в `:where()` — они должны побеждать обычные классы (`m="5"` сильнее `.card`).
