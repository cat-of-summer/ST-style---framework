<!-- DOCGEN:START -->
# st_main.css
<!-- DOCGEN:END -->

## Что это

`st_main.css` — основной файл CSS-фреймворка ST_style. Реализует систему утилитарных HTML-атрибутов, CSS-сброс, типографику, систему отступов, grid-сетку, управление видимостью и базовые компоненты (`icon`, `mask`, `editor`).

**Ключевой принцип**: стили управляются через HTML-атрибуты (`mt="6"`, `col="12 lg-3"`, `ds="none lg-block"`), а не классы. Под капотом — CSS Custom Properties: атрибут устанавливает переменную, а правило-«применятель» читает эту переменную.

**Подход к адаптивности**: mobile-first. Базовые значения — без медиа-запроса (для `xs`, ≥0px). Для каждого брейкпоинта добавляется `min-width` медиа-запрос, который переопределяет CSS Custom Property.

---

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/cat-of-summer/css_projects/ST_style/st_main.min.css">
```

---

## Брейкпоинты

| Префикс | min-width | max-width   | Описание                 |
|---------|-----------|-------------|--------------------------|
| `xs`    | 0px       | 359.98px    | Самые маленькие экраны   |
| `sm`    | 360px     | 767.98px    | Мобильные                |
| `md`    | 768px     | 1023.98px   | Планшеты                 |
| `lp`    | 1024px    | 1279.98px   | Ноутбуки                 |
| `lg`    | 1280px    | 1535.98px   | Широкие экраны           |
| `dt`    | 1536px    | 1919.98px   | Десктопы                 |
| `xl`    | 1920px    | —           | Широкоформатные          |

Для `-only` вариантов (только атрибут `d`) используются диапазоны `min + max`.

**CSS-переменные брейкпоинтов** доступны в `:root`:
```css
--xs-min: 0px
--sm-min: 360px
--md-min: 768px
--lp-min: 1024px
--lg-min: 1280px
--dt-min: 1536px
--xl-min: 1920px
/* max = следующий min − 0.02px */
```

---

## `:root` — кастомные свойства

### Базовый шрифт

```css
--font-size: 10px  /* 1rem = 10px во всём документе */
```

Это самое важное число: `font-size` у `html` выставлен в `var(--font-size)`, поэтому `1.2rem = 12px`, `2rem = 20px`.

### Размеры шрифтов

| Переменная  | Значение | px   |
|-------------|----------|------|
| `--fs-h1`   | 3.2rem   | 32px |
| `--fs-h2`   | 2.4rem   | 24px |
| `--fs-h3`   | 2.0rem   | 20px |
| `--fs-h4`   | 1.8rem   | 18px |
| `--fs-h5`   | 1.6rem   | 16px |
| `--fs-h6`   | 1.4rem   | 14px |
| `--fs-p`    | 1.2rem   | 12px |

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
--space-step: 4px

--space-0:  0px   -- space-5:  20px  -- space-10: 40px  -- space-15: 60px  -- space-20: 80px
--space-1:  4px   -- space-6:  24px  -- space-11: 44px  -- space-16: 64px  -- space-21: 84px
--space-2:  8px   -- space-7:  28px  -- space-12: 48px  -- space-17: 68px  -- space-22: 88px
--space-3:  12px  -- space-8:  32px  -- space-13: 52px  -- space-18: 72px  -- space-23: 92px
--space-4:  16px  -- space-9:  36px  -- space-14: 56px  -- space-19: 76px  -- space-24: 96px
                                                          -- space-25: 100px
```

**Формула**: `N × 4px`. `mt="5"` → `margin-top: 20px`.

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

- `html`: `font-size: var(--font-size)`, `overflow-x: hidden`, `scroll-behavior: smooth`
- `body`: `user-select: none`, `overflow-x: hidden`, `font-size: var(--fs-p)`, `line-height: 1`
- `picture`, `video`, `canvas`, `svg`: `display: block; max-width: 100%; height: auto`
- `img`, `iframe`: `width: 100%; height: 100%; object-fit: cover; object-position: center`
- `input`, `textarea`, `button`: `font-size: var(--fs-p)`, `outline: none` при фокусе
- `li`: `list-style: none`
- `h1–h6`,`p`: `font-weight: inherit; overflow-wrap: break-word`
- `h1–p`: размеры из `--fs-*` переменных
- `button`: без фона и бордера
- `a`, `button`: `cursor: pointer`

---

## Атрибут `fs` — размер шрифта

Применяется к **любому** элементу. Устанавливает `font-size` с `!important`.

```html
<p fs="h2">Крупный текст</p>
<span fs="h5">Маленький заголовок</span>
<div fs="p">Обычный текст</div>
```

| Значение  | Размер   | px   |
|-----------|----------|------|
| `fs="h1"` | 3.2rem   | 32px |
| `fs="h2"` | 2.4rem   | 24px |
| `fs="h3"` | 2.0rem   | 20px |
| `fs="h4"` | 1.8rem   | 18px |
| `fs="h5"` | 1.6rem   | 16px |
| `fs="h6"` | 1.4rem   | 14px |
| `fs="p"`  | 1.2rem   | 12px |

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

## Атрибут `sz` — точечный font-size

Применяется к **любому** элементу. Устанавливает `font-size` с `!important`. В отличие от `fs` (шкала h1–p), `sz` задаёт конкретный множитель шага `--sz-step`.

```html
<p sz="14">font-size = 14 × --sz-step</p>
<span sz="md-16 lg-20">16px на md, 20px на lg</span>
```

**Формула:** `sz="N"` → `font-size: calc(N * var(--sz-step))`.

**Значения `--sz-step`:**
- Снаружи `[container]`: `1px` (производное от `--space-step / 4`).
- Внутри `[container]`: `0.1cqw` (автоматически, через `--space-step` → cqw-режим).
- Override: `style="--sz-step: 1.2px"` или `style="--cq-step: 0.3cqw"`.

**Доступные значения:** 1, 2, 3, …, 16, 18, 20 для каждого брейкпоинта (`xs/sm/md/lp/lg/dt/xl`).

```html
<p sz="12">                  <!-- 12px (вне cqw) -->
<p sz="14" container>...</p> <!-- становится сам контейнером, sz=14 от его ширины -->
<p sz="12 lg-16">            <!-- 12px на xs–lp, 16px на lg+ -->
```

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
lc="0"  lc="1"  lc="2"  ...  lc="10"       -- базовые (xs, ≥0px)
lc="sm-0" ... lc="sm-10"                    -- ≥360px
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
mt="0"  mt="1"  mt="2"  ...  mt="25"       -- базовые (xs, ≥0px)
mt="sm-0" ... mt="sm-25"                    -- ≥360px
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

Обёртка с адаптивным `max-width` и **container-query**-контекстом. Применяется к любому элементу через атрибут.

```html
<div container>...</div>              <!-- inline-size container -->
<div container="block">...</div>      <!-- size container (по ширине и высоте) -->
```

**Адаптивный `max-width`:**

| Ширина экрана | max-width |
|---------------|-----------|
| ≥0px (xs)     | 320px     |
| ≥360px (sm)   | 340px     |
| ≥595px        | 550px     |
| ≥768px (md)   | 720px     |
| ≥1024px (lp)  | 960px     |
| ≥1280px (lg)  | 1200px    |
| ≥1536px (dt)  | 1320px    |
| ≥1920px (xl)  | 1600px    |

Базовые стили: `position: relative; width: 100%; margin: auto` (через `:where()` — нулевая специфичность, легко переопределяется проектом).

### cqw-режим масштабирования

Внутри `*[container]` все step-based утилиты (`m`, `mt`, `mb`, `p`, `pt`, `pb`, `gap`, `sz`) **автоматически масштабируются** с шириной контейнера через `cqw`-единицы.

**Как работает:** внутри контейнера переопределяется `--space-step` на `0.4cqw` (по умолчанию). Все утилиты считают свои значения через `calc(N * var(--space-step))` — значит, и они станут пропорциональны ширине. `--sz-step` производный от `--space-step` (`/4`), поэтому `sz` тоже скейлится.

**Управление:**

```html
<!-- Стандартный режим: 0.4cqw -->
<div container>
    <div m="5">margin = 0.4cqw × 5 = 2cqw</div>
    <p sz="14">font-size = 0.1cqw × 14 = 1.4cqw</p>
</div>

<!-- Более компактный шаг -->
<div container style="--cq-step: 0.3cqw">
    <div m="5">margin = 1.5cqw</div>
</div>

<!-- Развязать sz от cqw — задать абсолютный шаг -->
<div container>
    <p sz="14" style="--sz-step: 1.2px">font-size = 16.8px (фикс)</p>
</div>
```

**Пример:** при ширине контейнера 1200px и `--cq-step: 0.4cqw`:
- `m="5"` → 4.8px × 5 = 24px
- `sz="14"` → 1.2px × 14 = 16.8px

**Вложенность:** оба `[container]` и `[container="block"]` используют одно имя `container`, поэтому `@container` всегда смотрит на **ближайшего** предка-контейнер. Вложенные контейнеры масштабируются по своей ширине.

**Паттерн вёрстки секции:**

```html
<section mt="6">
    <div container>
        <!-- контент секции, все отступы скейлятся с шириной -->
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

Префиксы: `xs-`, `sm-`, `md-`, `lp-`, `lg-`, `dt-`, `xl-`

### Only-варианты (точный брейкпоинт)

Работают только в конкретном диапазоне ширины:

```html
<div ds="xs-only-none">   <!-- скрыт только на xs (0–359.98px) -->
<div ds="sm-only-block">  <!-- block только на sm (360–767.98px) -->
<div ds="md-only-none">   <!-- скрыт только на md (768–1023.98px) -->
<div ds="lp-only-flex">   <!-- flex только на lp (1024–1279.98px) -->
<div ds="lg-only-none">   <!-- скрыт только на lg (1280–1535.98px) -->
<div ds="dt-only-block">  <!-- block только на dt (1536–1919.98px) -->
<div ds="xl-only-flex">   <!-- flex только на xl (1920px+) -->
```

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
    <link rel="stylesheet" href="st_main.min.css">
    <link rel="stylesheet" href="st_animation.min.css">
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
2. `st_main.min.css` — базовый фреймворк
3. `st_effects.min.css` — анимации
4. `root.css` — проектные переменные
5. `header.css`, `main.css`, `footer.css`, `modals.css` — компоненты

---

## Полный справочник атрибутов

| Атрибут       | Описание                              | Пример                            |
|---------------|---------------------------------------|-----------------------------------|
| `fs`          | Размер шрифта                         | `fs="h2"`                         |
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
| `container`   | Адаптивный контейнер + cqw-скейлинг   | `container`, `container="block"` |
| `icon`        | Flex-контейнер иконки                 | `icon=""`, `icon="square"`       |
| `mask`        | CSS-маска для иконок                  | `mask=""` + `style="--mask: url(...)"` |
| `fluid`       | fit-content размеры                   | `fluid=""`                        |
| `checkbox`    | Кастомный стилизуемый чекбокс        | атрибут у `span` внутри `label`  |
| `radio`       | Кастомная стилизуемая радио-кнопка   | атрибут у `span` внутри `label`  |
| `sz`          | Точечный font-size (множитель)        | `sz="14"`, `sz="12 lg-16"`        |
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
| `--sz-step`       | `<length>`             | `1px`    | да       |
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
