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

## Чек-лист: элемент макета → атрибут

Проходить при сборке **каждого** компонента, до того как писать свой CSS. Если элемент попадает
в строку таблицы, берётся атрибут, а не своё правило с медиазапросом.

| Элемент макета | Атрибут | Пример |
|----------------|---------|--------|
| Кнопка-иконка: крестик, бургер, стрелка, соцсеть, «наверх» | `icon` — зона клика шире иконки | `<button icon aria-label="Закрыть">…</button>` |
| Одноцветная иконка, цвет из CSS | `mask` + `--mask`, `--color` | `<i icon="square" mask style="--mask: url(x.svg)">` |
| Показать/скрыть на ступени | `ds` | `ds="none lp-flex"` |
| Flex/grid-ряд с промежутками | `ds="flex gap-N"`, `grid="gap-N"` | `ds="flex gap-4"` |
| Колонки | `grid` + `col` | `col="12 md-6 lp-4"` |
| Вертикальные отступы | `m`, `mt`, `mb`, `p`, `pt`, `pb` | `mt="6 lp-12"` |
| Обёртка секции, поля по бокам | `container` + `gutter` в `$breakpoints` | `<div container>` |
| Абсолютное/фиксированное позиционирование, центр | `ps` | `ps="absolute center"` |
| Обрезка, прокрутка по оси | `ov` | `ov="hidden"`, `ov="scroll y"` |
| Текст в N строк с многоточием | `lc` | `lc="2 lp-3"` |
| Размер и вес текста из токенов | `tx`, `fw` | `tx="h3" fw="semibold"` |
| Кастомный чекбокс/радио | `label` + `checkbox`/`radio` | см. «Формы» |
| HTML из CMS | `.editor` | `<div class="editor">` |
| Размер по контенту / во весь родитель | `fluid` / `cover` | `fluid`, `cover` |
| Заголовок, строки которого в макете выровнены по длине | `balance` | `<h2 balance>` |
| Медиазапрос в своём SCSS | `st.up()`, `st.down()` | см. «SCSS-хелперы» |
| Своя сетка в SCSS | `st.cols(N)`, `st.fr()` — не голый `1fr` | `@include st.cols(4)` |

> [!warning] Проверить отдельно
> - **Зона клика не видна** ни на скриншоте, ни в попиксельном сравнении. Мелкие кнопки
>   (меньше 24px) без `icon` — ошибка, даже если вёрстка совпала с макетом. Проверять и то, что
>   спрятано в закрытых модалках и меню.
> - У `[icon]` `box-sizing: content-box`: явный `width` с `padding` увеличивает кнопку.
> - Reset снимает с `button`, `input`, `textarea` **всё**, включая outline. Фокус возвращать
>   самостоятельно (`:focus-visible`). Что ещё снято — «CSS Reset → Что снимает reset и как вернуть».

---

## Справочник атрибутов

Все атрибутные утилиты бандла. Колонка «Когда ставить» — повод взять атрибут, а не писать своё правило.

| Атрибут | Что делает | Когда ставить | Пример |
|---------|------------|---------------|--------|
| `container` | max-width и боковые поля по `$breakpoints` | обёртка содержимого каждой секции | `<div container>` |
| `grid` | CSS Grid на N колонок `minmax(0, 1fr)` + `gap-*` | ряд карточек, колонки контента | `grid="gap-4"`, `grid="10"` |
| `col` | span и старт ячейки, по брейкпоинтам | каждый прямой потомок `grid` | `col="12 md-6 lp-4"` |
| `ds` | display по брейкпоинтам + `gap-*` для flex/grid | показать/скрыть на ступени, flex-ряд | `ds="none lp-flex gap-4"` |
| `m`, `mt`, `mb` | вертикальный margin по шкале `--space-step` | отступы между блоками | `mt="6 lp-12"` |
| `p`, `pt`, `pb` | вертикальный padding по шкале | внутренние отступы секций и карточек | `p="8 lp-16"` |
| `tx` | размер шрифта из токена `--fs-*` | текст, размер которого есть в токенах | `tx="h3"` |
| `fw` | вес шрифта из токена `--fw-*` | вес отличается от унаследованного | `fw="semibold"` |
| `lc` | обрезка в N строк с многоточием | превью текста, заголовки карточек | `lc="2 lp-3"` |
| `balance` | `text-wrap: balance` | заголовок, в макете выровненный по строкам | `<h2 balance>` |
| `ps` | position, центрирование | абсолют/фикс, бейджи, оверлеи | `ps="absolute center"` |
| `ov` | overflow по осям | обрезка, горизонтальная прокрутка | `ov="scroll x"` |
| `icon` | flex-центровка + невидимая зона клика `--icon-area` | **любая** кнопка-иконка: крестик, бургер, стрелка, соцсеть | `<button icon aria-label="Меню">` |
| `mask` | одноцветная иконка через `mask` | иконка, цвет которой задаётся из CSS | `mask style="--mask: url(x.svg)"` |
| `fluid` | `fit-content` по обеим осям | размер по содержимому | `fluid` |
| `cover` | `100%` по обеим осям | растянуть на весь родитель | `cover` |
| `checkbox`, `radio` | стилизуемый чекбокс/радио | `span` внутри `label` с нативным `input` | см. «Формы» |

---

## Подключение

Пакет опубликован в публичном npm, токен не нужен:

```bash
npm install @cat-of-summer/st-style
```

```js
import '@cat-of-summer/st-style/main.css';      // → dist/main.min.css
import '@cat-of-summer/st-style/effects.css';   // → dist/effects.min.css
```

CDN (jsDelivr), версию подставить нужную:

```
https://cdn.jsdelivr.net/npm/@cat-of-summer/st-style@<версия>/dist/main.min.css
```

Кастомизация при сборке — `@use '.../scss/main/config' with (...)`, миксины брейкпоинтов для
своих SCSS — см. «SCSS-хелперы: брейкпоинты и сетки».

### Проверка CSS-переменных

Ссылка на необъявленную переменную (`var(--bgColor-attention-emphasis)` при опечатке или
переименовании токена) проходит молча: свойство становится невалидным и сбрасывается. Пакет
ставит CLI `st-style-check-vars`, который находит такие ссылки в собранном CSS:

```bash
npx st-style-check-vars --strict dist/ node_modules/@cat-of-summer/st-style/dist/
# dist/assets/app.css:1:5821  --bgColor-attention-emphasis is not defined
```

- Проверяются `var(--x)` **без** fallback, в том числе вложенные в fallback (`var(--y, var(--x))`).
  `var(--x, …)` не помечается.
- Объявления (`--x: …`, `@property --x`) собираются со **всех** переданных файлов и каталогов
  разом, поэтому CSS фреймворка передаётся вместе с проектным.
- `--strict` — код выхода 1 при находках (CI, `postbuild`, шаг после purge). Без него — только
  предупреждения.
- `--ignore <префикс>` (повторяемый) — пропустить переменные, которые задаются из JS или
  inline-стилем: `--ignore --js-`.

Из Node — та же проверка функцией:
`import { findUndefinedVars } from '@cat-of-summer/st-style/check-vars'`, на входе
`[{ file, css }]`. Сборка самого фреймворка (`npm run build`) прогоняет её по своему `dist/`.

---

## Брейкпоинты

Единая шкала задаётся картой `$breakpoints` в `src/main/_config.scss` и управляет
утилитами, масштабом шрифта **и** контейнером. Базовое (без префикса) значение
действует с ≥0px; префикс брейкпоинта подключается с его `min-width`.

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

Поля брейкпоинта:

| Поле | Обязательно | По умолчанию | Смысл |
|------|-------------|--------------|-------|
| `min` | да | — | порог `min-width` |
| `design` | нет | `min` | ширина макета, к которой откалибрована шкала |
| `font` | нет | `$font-size` (10px) | чему равен `1rem` на ширине `design` |
| `container` | нет | fluid | max-width `[container]` в px на ширине `design` |
| `gutter` | нет | предыдущая ступень | горизонтальные поля `[container]` в px на ширине `design` |

> **Note:** базовое (безпрефиксное) значение действует на всех ширинах. `m="3 lg-6"` —
> это «3 везде, 6 на lg+». `m="xs-3"` — 3 начиная с ≥360px. Имена/пороги брейкпоинтов
> меняются в одном месте — `$breakpoints`.

---

## Масштабирование: `html { font-size: …vw }`

На каждом брейкпоинте `html` получает `font-size: font / design × 100vw`. На ширине
`design` это ровно `font` px, дальше — пропорционально ширине окна. Ниже первого
брейкпоинта действует его шкала, выше последнего масштабирование продолжается.

```css
html { font-size: 2.7777777778vw }                                  /* <360: шкала xs */
@media (min-width: 360px) { html { font-size: 2.7777777778vw } }    /* 10 / 360 */
@media (min-width: 768px) { html { font-size: 1.3020833333vw } }    /* 10 / 768 */
/* … */
```

Все размеры фреймворка — в `rem`: токены шрифта `--fs-*`, шаг отступов
`--space-step`, max-width `[container]`. Поэтому внутри брейкпоинта раскладка
масштабируется целиком и выглядит одинаково:

| Ширина | 1rem | `h1` (3.2rem) | `p="5"` (5 × 0.4rem) |
|--------|------|---------------|----------------------|
| 768px (md)  | 10px   | 32px   | 20px |
| 1023px (md) | 13.3px | 42.6px | 26.6px |
| 1024px (lp) | 10px   | 32px   | 20px |

На границе брейкпоинта масштаб скачком переходит к шкале следующего — это и есть
«жёсткое» масштабирование: у каждого брейкпоинта своя картинка макета.

Размеры из макета переводятся делением на `font`: 16px → `1.6rem`, 320px → `32rem`.

> [!warning]
> Шрифт в `vw` почти не реагирует на масштаб браузера (Ctrl +/−): при зуме меняется
> ширина вьюпорта в CSS-пикселях, и `1rem` пересчитывается обратно.

**Свой макет** — build-time конфиг:

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

Без пересборки шкалу переопределяют правилом на `html` в проектном CSS
(`@media (min-width: 768px) { html { font-size: calc(12 / 768 * 100vw) } }`).

---

## SCSS-хелперы: брейкпоинты и сетки

Модуль `scss/main/media` (`src/main/_media.scss`) даёт миксины и функции по той же карте
`$breakpoints`, что и бандл. CSS он не выводит.

| API | Результат |
|-----|-----------|
| `@include up(lp) { … }` | `@media (min-width: <min lp>)` — тот же порог, что у префикса `lp-` |
| `@include down(md) { … }` | `@media (max-width: <min md> − 0.02px)` |
| `@include between(md, lp) { … }` | от `min md` до `min lp` не включая |
| `rem(24px)` | `2.4rem` — px макета делятся на `$font-size` |
| `rem(24px, lp)` | делятся на `font` ступени `lp` |
| `bp(lp)` | карта ступени; неизвестное имя останавливает сборку с ошибкой |
| `@include cols(4)` | `grid-template-columns: repeat(4, minmax(0, 1fr))` |
| `fr()`, `fr(2)` | `minmax(0, 1fr)`, `minmax(0, 2fr)` — трек для своего шаблона колонок |

Чтобы брейкпоинты задавались в одном месте, конфиг настраивается в проектном partial, а все
файлы подключают его, а не пакет напрямую:

```scss
// _st.scss
@forward '@cat-of-summer/st-style/scss/main/config' with (
  $breakpoints: (
    xs: (min: 320px,  design: 380px,  container: 340px,  gutter: 20px),
    md: (min: 768px,  container: 700px),
    lp: (min: 1024px, design: 1440px, container: 1200px, gutter: 40px),
  )
);
@forward '@cat-of-summer/st-style/scss/main/media';
```

```scss
// global.scss
@use 'st';
@use '@cat-of-summer/st-style/scss/main';

// header.scss — компилируется отдельно, но видит те же брейкпоинты
@use 'st';
.hbar { height: st.rem(56px); @include st.up(lp) { height: st.rem(80px, lp); } }
```

Своих миксинов `lp`/`md`/`mob` в проекте не заводить: при смене `$breakpoints` они разойдутся
с фреймворком.

> [!warning] Голый `1fr` в своих сетках
> `1fr` — это `minmax(auto, 1fr)`: колонка не сужается меньше min-content своего содержимого.
> Заголовок с `white-space: nowrap` или длинное слово («ОБРАЗОВАТЕЛЬНЫХ») раздувают колонку,
> соседние сжимаются, сетка вылезает за экран. Колонки задавать через `st.cols(N)` или
> `st.fr()`: `grid-template-columns: st.fr(2) st.fr()`. `[grid]` уже так устроен.

---

## `:root` — кастомные свойства

### Размеры шрифтов

Токены — длины в `rem` из карты `$font-sizes`. Значения px — на ширине `design`
при `font: 10px`:

| Переменная  | Значение | px на эталоне |
|-------------|----------|---------------|
| `--fs-h1`   | 3.2rem   | 32px |
| `--fs-h2`   | 2.4rem   | 24px |
| `--fs-h3`   | 2rem     | 20px |
| `--fs-h4`   | 1.8rem   | 18px |
| `--fs-h5`   | 1.6rem   | 16px |
| `--fs-h6`   | 1.4rem   | 14px |
| `--fs-p`    | 1.2rem   | 12px |

Их применяют `h1`–`p`, `[tx]`, `input/textarea/button`, `body` (`--fs-p`) и `.editor`.

**Свои токены.** Добавь ключ в карту `$font-sizes` (сгенерит `[tx="lead"]`) либо
задай рантайм-переменную и применяй как обычную длину:

```css
:root { --fs-lead: 1.8rem; }
```
```html
<p tx style="--tx: var(--fs-lead)">…</p>
<p style="font-size: var(--fs-lead)">…</p>   <!-- то же самое -->
```

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
--space-step: 0.4rem;
```

**Формула**: `mt="N"` → `margin-top: calc(N * var(--space-step))` = `N × 0.4rem`
(4px на эталонной ширине).

Утилиты `m/mt/mb`, `p/pt/pb`, `gap` хранят **число-множитель** в custom-property (`--mt`, `--mb`, `--pt`, `--pb`, `--gap`, `--gap-x`, `--gap-y`), а applier умножает на `--space-step` через `calc()`. Переопредели `--space-step` на обёртке — и все отступы внутри перемасштабируются одним значением.

Шкала множителей: `0..25` для margin/padding, `1..15` для gap.

---

## CSS Reset

Фреймворк включает полный сброс браузерных стилей:

```css
:where(*:not(svg, svg *, img, video, canvas, iframe), *::before, *::after) {
    all: unset;
    display: revert;
    box-sizing: border-box;
}
```

> [!warning]
> `all: unset` снимает с элементов форм всё: рамку, фон, курсор у `input`, outline фокуса.
> Поля и кнопки стилизуются с нуля, фокус возвращается своим правилом `:focus-visible`.

- `html`: `font-size` в `vw` по брейкпоинтам (см. «Масштабирование»), `overflow-x: hidden`, `scrollbar-gutter: stable`, `scroll-behavior: smooth`, `text-size-adjust: none`, `-webkit-font-smoothing: antialiased`, `-moz-osx-font-smoothing: grayscale`, `text-rendering: optimizeLegibility`
- `body`: `user-select: none`, `overflow-x: hidden`, `font-size: var(--fs-p)`, `line-height: 1`, `overflow-wrap: break-word`, `hyphens: auto`
- ширина `html` и `body` не задаётся: при классической полосе прокрутки `100vw` сделал бы их шире окна на ширину полосы
- место под полосу прокрутки зарезервировано всегда (`scrollbar-gutter: stable`): макет не сдвигается, когда полоса появляется или скролл блокируют через `overflow: hidden` на `html`/`body`. Блокировкам, которые ставят `body` в `position: fixed` inline-стилем, reset задаёт `width: auto !important; right: 0`, чтобы `body` не заходил под зарезервированное место. На оверлейных полосах (macOS, мобильные) правило ничего не меняет. Отключить — `html { scrollbar-gutter: auto }`
- `vertical-align: middle` — только у медиа (`svg`, `img`, `video`, `canvas`, `iframe`), полей (`input`, `select`, `textarea`, `button`, `meter`, `progress`), `span[checkbox|radio]` и `[icon~="inline"]`. Строчный текст (`mark`, `code`, `a`, `span`) стоит на `baseline`: с `middle` строчный элемент другого размера проседал ниже строки на 1–2px
- `picture`, `video`, `canvas`, `svg`: `display: block; max-width: 100%; height: auto`
- `img`, `iframe`: `width: 100%; height: 100%; object-fit: cover; object-position: center`
- `input`, `textarea`, `button`: `font-size: var(--fs-p)`; outline фокуса снят `all: unset` и возвращён только для `:focus-visible`
- `textarea`: `resize: vertical; field-sizing: content`
- `table`: `border-collapse: collapse; border-spacing: 0`
- `li`: `list-style: none`
- `:disabled`: `cursor: not-allowed`
- `h1–h6`,`p`: `font-weight: inherit; overflow-wrap: break-word`
- `p`: `text-wrap: pretty`. Заголовки переносятся жадно, как в Figma; баланс строк включается атрибутом `balance`
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
- **`[hidden]:not([hidden="until-found"]) { display: none !important }`** — стоит сразу после
  сброса. `display: revert` из reset — авторское правило, оно перебивает UA-правило `[hidden]`,
  и без этой правки элемент с `hidden` оставался бы видимым. Правило **не** в `:where()`:
  специфичность 0,2,0 с `!important` побеждает и проектные классы, и `ds` (0,1,0 `!important`),
  поэтому `<div hidden ds="flex">` скрыт. `hidden="until-found"` не трогается: его браузер прячет
  через `content-visibility`, а `display: none` сломал бы поиск по странице.

### Что снимает reset и как вернуть

| Что пропало | Почему | Как вернуть |
|-------------|---------|-------------|
| Outline фокуса мышью у ссылок, кнопок, полей | `all: unset`; для клавиатуры возвращён через `:where(:focus-visible)` | свой стиль — правило `:focus-visible { outline: … }` |
| `vertical-align: middle` у строчного текста | намеренно: `mark`, `code`, `a` проседали ниже строки | `vertical-align: middle` на нужном элементе |
| Рамка, фон, `appearance` у `input`, `button`, `select` | `all: unset` | стилизовать с нуля или `appearance: revert` |
| Маркеры списков | `li { list-style: none }` | `li { list-style: revert }` — `.editor` маркеры тоже не возвращает |
| Отступы и жирность у `h1–h6`, `p`, `ul`, `blockquote` | `all: unset` | `m`/`p`, `fw`, свой CSS; для CMS-контента — `.editor` |
| Подчёркивание и цвет ссылок | `all: unset` | `text-decoration: underline`, свой цвет |
| Выделение текста мышью | `body { user-select: none }` | `user-select: text` на нужном блоке |
| Баланс строк заголовков | не включён намеренно | атрибут `balance` |
| Скрытие по `hidden` | `display: revert` перебивает UA | уже возвращено правилом `[hidden]` выше, ничего делать не нужно |

---

## Атрибут `tx` — размер шрифта (именованный токен)

Применяется к **любому** элементу. Устанавливает `font-size` с `!important` из
токенов `--fs-*`.

```html
<p tx="h2">Крупный текст</p>
<span tx="h5">Маленький заголовок</span>
<div tx="p">Обычный текст</div>
<p tx style="--tx: 1.8rem">Свой размер</p>
```

| Значение  | Токен     | px на эталоне |
|-----------|-----------|---------------|
| `tx="h1"` | `--fs-h1` | 32px |
| `tx="h2"` | `--fs-h2` | 24px |
| `tx="h3"` | `--fs-h3` | 20px |
| `tx="h4"` | `--fs-h4` | 18px |
| `tx="h5"` | `--fs-h5` | 16px |
| `tx="h6"` | `--fs-h6` | 14px |
| `tx="p"`  | `--fs-p`  | 12px |

Голый `tx` без значения — `1rem` (или `--tx`, если задан). Кастомные ключи
добавляются в карту `$font-sizes` конфига → появляется `tx="lead"`.

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

## Атрибут `ps` — position элемента

Применяется к **любому** элементу. Устанавливает `position` с `!important`. Значение `center` делает: `left: 50%; top: 50%; transform: translate(-50%, -50%)`.

```html
<h3 ps="relative">Лёгкий заголовок</h3>
<span ps="absolute center">Жирный текст</span>
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
<div ov="hidden">…</div>
<div ov="x">…</div>          <!-- содержимое выходит только по горизонтали -->
<div ov="scroll x">…</div>   <!-- горизонтальная прокрутка -->
```

Ось в значении — та, по которой содержимое остаётся доступным; другая ось обрезается через `clip`.
В паре с `auto` браузер вычисляет `clip` как `hidden` (так требует спецификация), на вид разницы нет.

| Значение          | overflow                                  |
|-------------------|-------------------------------------------|
| `ov=""`            | overflow-x: visible; overflow-y: visible |
| `ov="x"`           | overflow-x: visible; overflow-y: clip    |
| `ov="y"`           | overflow-x: clip; overflow-y: visible    |
| `ov="scroll"`      | overflow-x: auto; overflow-y: auto       |
| `ov="scroll x"`    | overflow-x: auto; overflow-y: clip       |
| `ov="scroll y"`    | overflow-x: clip; overflow-y: auto       |
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
<section mt="6">       <!-- margin-top: 2.4rem -->
<div mb="12">          <!-- margin-bottom: 4.8rem -->
<article p="5">        <!-- padding-top: 2rem + padding-bottom: 2rem -->

<!-- Responsive: несколько значений через пробел -->
<!-- Значения применяются в порядке брейкпоинтов, ПОСЛЕДНЕЕ выигрывает -->
<section mt="3 lg-6">  <!-- mt: 1.2rem на xs/sm/md/lp, 2.4rem на lg+ -->
<div mb="4 md-8 lg-12"> <!-- mb: 1.6rem → 3.2rem → 4.8rem -->
```

### Доступные значения

Числа **0–25** (шаг ×0.4rem) для каждого брейкпоинта:

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
<section mt="3">                       <!-- секция: отступ сверху 1.2rem -->
<section mt="6">                       <!-- секция: отступ сверху 2.4rem -->
<div mb="12">                          <!-- блок: отступ снизу 4.8rem -->
<nav mt="16">                          <!-- навигация: отступ сверху 6.4rem -->
<button class="button" p="5">          <!-- кнопка: padding по вертикали 2rem -->
```

---

## Секции и контейнер

### `section`

Семантический тег `<section>` автоматически получает: `position: relative; width: 100%; margin: auto`.

### Атрибут `container`

Обёртка с адаптивным `max-width`. Применяется к любому элементу, значение не нужно.

```html
<div container>...</div>
```

**Адаптивный `max-width`** — из значений `container` в `$breakpoints`. Задаются в px на
эталонной ширине, а в CSS попадают в `rem` (`container / font`), поэтому контейнер
масштабируется вместе со шрифтом и отступами. Ниже первой ступени контейнер fluid — 100%:

| Ширина экрана | max-width | на эталоне |
|---------------|-----------|------------|
| <360px        | 100% (fluid) | — |
| ≥360px (xs)   | 34rem  | 340px  |
| ≥576px (sm)   | 54rem  | 540px  |
| ≥768px (md)   | 72rem  | 720px  |
| ≥1024px (lp)  | 96rem  | 960px  |
| ≥1280px (lg)  | 120rem | 1200px |
| ≥1536px (dt)  | 132rem | 1320px |
| ≥1920px (xl)  | 160rem | 1600px |

Базовые стили: `position: relative; width: 100%; margin: auto` (через `:where()` — нулевая специфичность, легко переопределяется проектом).

**Горизонтальные поля** — поле `gutter` ступени в `$breakpoints`, в px на ширине `design`. В CSS
попадает `padding-left/right` в `rem`. Ступень без `gutter` наследует поля предыдущей, ниже первой
ступени действуют поля первой. `box-sizing: border-box`, поэтому `container` — внешняя ширина,
поля входят в неё:

```scss
$breakpoints: (
  xs: (min: 320px,  design: 380px,  container: 380px,  gutter: 20px),  // контент 340px
  lp: (min: 1024px, design: 1440px, container: 1280px, gutter: 40px),  // контент 1200px
)
```

В дефолтной карте `gutter` не задан, контейнер без полей.

### Паттерн вёрстки секции

```html
<section mt="6">
    <div container>
        <div grid="gap-4">…</div>
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

Применяет: `display: grid; grid-template-columns: repeat(N, minmax(0, 1fr))`.

Колонки равные при любом содержимом: `minmax(0, 1fr)` не даёт треку раздуваться до
min-content (в отличие от голого `1fr`). Длинное слово в узкой колонке переносится
(`overflow-wrap: break-word` из reset), а текст с `nowrap` обрезается `ov` или `lc`, а не
растягивает сетку. Для своих сеток в SCSS — `st.cols()` / `st.fr()` (см. «SCSS-хелперы»).

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

Создаёт flex-контейнер для иконок с увеличенной зоной клика. Ставится на **каждую** кнопку,
видимая часть которой — иконка: крестик модалки, бургер, поиск, стрелки слайдера и пагинации,
соцсети, «наверх».

```html
<button icon aria-label="Закрыть">
    <svg width="15" height="15">…</svg>
</button>

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
- `::after` — расширяет зону клика на `var(--icon-area, 1rem)` во все стороны (прозрачный слой, `z-index: 10`)
- Дочерние элементы: `flex: auto`
- `icon="inline"`: `display: inline-flex; vertical-align: middle` — иконка в строке текста центрируется по нему

**Размер зоны** — переменная `--icon-area`: `style="--icon-area: 1.5rem"` или правилом в классе.
Иконка 15×15 с зоной `1rem` на эталоне даёт цель 35×35px.

**С явными размерами.** Класс проекта с той же специфичностью, подключённый после фреймворка,
перебивает `width/height: max-content`, так что `width: 1.5rem; height: 1.5rem` работает. Но
`box-sizing` остаётся `content-box`: `padding` добавится к размеру, а не войдёт в него.

Слой `::after` перекрывает соседей на `--icon-area`. Если две иконки стоят ближе, чем
`2 × --icon-area`, уменьшить переменную, чтобы зоны не накладывались.

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

Перенесён в начало документа — раздел «Справочник атрибутов» сразу после чек-листа.

---

## Прогрессивные техники

### `@property` — прогрессивная надстройка

Часть переменных зарегистрирована через `@property`. Это **не обязательная часть** фреймворка — корректность наследования обеспечивается локальным reset на родовых селекторах (`*[m]`, `*[col]`, `*[ds]` и т.д.). `@property` — поверх, для браузеров, которые поддерживают (Chrome 85+, Firefox 128+, Safari 16.4+):

| Свойство          | Тип                    | Initial  | Inherits |
|-------------------|------------------------|----------|----------|
| `--space-step`    | `<length>`             | `0.4rem` | да       |
| `--grid-columns`  | `<integer>`            | `12`     | нет      |
| `--col-span`      | `<integer>`            | `12`     | нет      |
| `--col-start`     | `<integer> \| auto`    | `auto`   | нет      |

**Бонусы там, где поддержано:**
- **Type-safety.** Опечатка типа `style="--space-step: 4remm"` не ломает `calc()` — браузер откатывается к `initial-value`.
- **Анимация.** `transition: --space-step 0.3s` начинает работать — можно плавно менять spacing на hover/focus.

В браузерах без `@property` — те же самые селекторы и custom-properties работают как обычные. Никакого degraded experience.

### `:where()` для reset

Все reset-стили (`html`, `body`, `*`, `img`, `h1–p`, `[container] max-width`) обёрнуты в `:where()` — специфичность **0,0,0**. Проектный класс перебивает reset без `!important`:

```css
/* Проектный CSS */
.hero h1 { font-size: 4.8rem; }   /* перебивает :where(h1) { font-size: var(--fs-h1) } */
.wide-section[container] { max-width: 180rem; }  /* перебивает :where([container]) */
```

**Утилитарные атрибуты НЕ обёрнуты** в `:where()` — они должны побеждать обычные классы (`m="5"` сильнее `.card`).

Единственное исключение внутри reset — `[hidden]:not([hidden="until-found"])` с `!important`:
атрибут `hidden` должен скрывать элемент при любых классах и `ds` (см. «Кросс-браузерные правки»).
