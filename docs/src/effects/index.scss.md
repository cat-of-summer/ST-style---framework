<!-- DOCGEN:START -->
# index.scss
<!-- DOCGEN:END -->

# Бандл `effects`

Исходник: `src/effects/index.scss` → собирается в `dist/effects.min.css`. По эффекту на partial (`src/effects/_<effect>.scss`); длительности - карта `$durations` в `src/effects/_config.scss`.

## Что это

`effects` - бандл визуальных эффектов ST_style: 25 анимаций и трансформаций через HTML-атрибуты.

**Ключевые принципы:**
- Эффекты управляются HTML-атрибутами: `raise="hover"`, `shadow="hover focus"`, `sheen="hover"`
- Параметры эффекта - CSS-переменные. Бандл их **не объявляет**: значение по умолчанию стоит фолбэком в месте использования (`var(--glow-color, …)`), поэтому переменную можно задать где угодно выше по дереву - на `:root`, на родителе в `:hover`, в `style` (см. "Настройка")
- Модификаторы триггера задаются значениями атрибута через пробел: `scale="hover active"`
- Анимации без триггера запускаются сразу при загрузке страницы

---

## Подключение

```js
import '@cat-of-summer/st-style/effects.css';   // → dist/effects.min.css
```

Установка: `npm install @cat-of-summer/st-style` (публичный npm), см. корневой `README.md`.

---

## Глобальные переменные

Все длительности - из карты `$durations` (`src/effects/_config.scss`). `_root.scss`
эмитит **каждый** ключ как `--td-<key>` в `:root`, так что переменные
overridable в рантайме и расширяемы (добавь ключ в `$durations`).

```css
:root {
    /* Длительности (из $durations) */
    --td-rapid:  0.1s;
    --td-fast:   0.325s;
    --td-medium: 0.55s;
    --td-slow:   0.775s;
    --td-1s: 1s; --td-2s: 2s; --td-3s: 3s;
    --td-5s: 5s; --td-10s: 10s; --td-15s: 15s;

    /* Количество итераций анимаций по умолчанию */
    --iteration-count: 1;
}
```

Длительность каждого эффекта выбирается так, по убыванию приоритета:

1. `td` на самом элементе;
2. `--<эффект>-duration`, заданная на элементе или выше по дереву (`--glow-duration`, `--typing-duration`, `--shimmer-duration` у `shimmer-text`);
3. умолчание эффекта - в описании каждого эффекта ниже.

---

## Атрибут `td` - длительность

Задаёт длительность переходов (`transition-duration`) элемента **и его псевдоэлементов**
(`::before`, `::after`), а также анимаций эффектов на этом элементе: `float`, `pulse`, `sheen`,
`ripple`, `typing-text` и других.

Каждый `td="<key>"` подставляет `var(--td-<key>)`, а сами `--td-*` берутся из
`$durations`. Набор ключей расширяется/меняется в конфиге.

```html
<div td="fast">         <!-- var(--td-fast)  = 0.325s -->
<div td="medium">       <!-- var(--td-medium) = 0.55s -->
<div td="slow">         <!-- var(--td-slow)  = 0.775s -->
<div td="rapid">        <!-- var(--td-rapid) = 0.1s -->
<div td="1s">           <!-- var(--td-1s) = 1s -->
<div td="15s">          <!-- var(--td-15s) = 15s -->
<div td="none">         <!-- 0s: без перехода -->
```

| Значение  | Длительность |
|-----------|-------------|
| `rapid`   | 0.1s         |
| `fast`    | 0.325s       |
| `medium`  | 0.55s        |
| `slow`    | 0.775s       |
| `1s`      | 1s           |
| `2s`      | 2s           |
| `3s`      | 3s           |
| `5s`      | 5s           |
| `10s`     | 10s          |
| `15s`     | 15s          |
| `none`    | 0s           |

`td` действует **только на свой элемент**: `--td` зарегистрирована через
`@property --td { syntax: "*"; inherits: false }`, и потомки её не получают. `<section td="5s">`
не замедлит `scale` у карточек внутри. Значение не из карты (`td="0.3s"`) не распознаётся - переход
станет `0s`; для своей длительности есть `--<эффект>-duration` или новый ключ в `$durations`.

---

## Атрибут `infinite`

Устанавливает `--iteration-count: infinite`: анимации становятся бесконечными. Переменная
наследуется, поэтому `infinite` действует на эффекты элемента **и всех его потомков**.

```html
<div float="" infinite="">      <!-- бесконечное парение -->
<div pulse="" infinite="">      <!-- бесконечная пульсация -->
<div spin="" infinite="">       <!-- бесконечное вращение -->
```

У анимаций с триггером то же значение `infinite` можно указать в самом атрибуте:
`pulse="hover infinite"`.

---

## Система триггеров

Каждый эффект принимает одно или несколько значений через пробел:

| Значение     | Условие активации                            |
|--------------|---------------------------------------------|
| *(пусто)*    | Анимация - сразу при загрузке; переход - см. эффект |
| `hover`      | `:hover`                                    |
| `active`     | `:active`                                   |
| `focus`      | `:focus` (фокус на самом элементе, не внутри него) |
| `infinite`   | Бесконечный повтор анимации                 |

**Комбинирование триггеров:**
```html
<article shadow="hover focus">     <!-- тень при hover ИЛИ focus -->
<div sheen="hover">                <!-- блик только при hover -->
<button raise="hover active">      <!-- подъём при hover, выше при нажатии -->
<div scale="hover" td="fast">      <!-- масштаб при hover, быстрый переход -->
```

---

## Эффекты

### `raise` - подъём

Поднимает элемент вверх по оси Y (`translateY`). Переход `--raise-duration`, по умолчанию `--td-medium`.

```css
/* Переменные и умолчания */
--raise-hover:  0.5em;   /* подъём при hover */
--raise-active: 1em;     /* подъём при active и focus */
```

```html
<div raise="hover">        <!-- поднимается при наведении -->
<div raise="hover active"> <!-- поднимается при hover, ещё выше при нажатии -->

<!-- Переопределение интенсивности -->
<div raise="hover" style="--raise-hover: 1rem">
```

Без триггера (`raise=""`) элемент не поднимается.

---

### `scale` - масштабирование

Масштабирует элемент (`transform: scale()`). Переход `--scale-duration`, по умолчанию `--td-medium`.

```css
--scale-hover:  1.05;   /* увеличение при hover */
--scale-active: 0.95;   /* уменьшение при active и focus (эффект нажатия) */
```

```html
<picture scale="hover">    <!-- картинка увеличивается при наведении -->
<button scale="active">    <!-- кнопка «нажимается» при клике -->
<div scale="hover active"> <!-- оба состояния -->
```

---

### `rotate` - поворот

Вращает элемент (`transform: rotate()`). Переход `--rotate-duration`, по умолчанию `--td-medium`.

```css
--rotate-hover:  3deg;    /* угол поворота при hover */
--rotate-active: -3deg;   /* угол поворота при active и focus */
```

```html
<svg rotate="hover">              <!-- иконка поворачивается при наведении -->
<div rotate="hover active">
<!-- Кастомный угол -->
<svg rotate="hover" style="--rotate-hover: 15deg">
```

---

### `blur` - размытие

Элемент размыт (`filter: blur()`), при `:hover`, `:active` или `:focus` размытие снимается -
эффект появления из размытия. Триггер в значении не нужен: снимается при любом из трёх
состояний. Переход `--blur-duration`, по умолчанию `--td-slow`.

```css
--blur-amount: 5px;    /* степень размытия */
```

```html
<img blur="">                                   <!-- размыт, резкий при hover/active/focus -->
<img blur="" style="--blur-amount: 10px">       <!-- сильнее -->
```

---

### `shadow` - тень

Применяет `box-shadow` при срабатывании событий. Переход `--shadow-duration`, по умолчанию `--td-medium`.

```css
/* hover: 5px 5px 10px rgba(0, 0, 0, 0.2) */
--shadow-hover-offset:  5px;                 /* общий сдвиг, или раздельно: */
--shadow-hover-offsetX: var(--shadow-hover-offset);
--shadow-hover-offsetY: var(--shadow-hover-offset);
--shadow-hover-blur:    10px;
--shadow-hover-color:   rgba(0, 0, 0, 0.2);

/* active и focus: 2px 2px 8px rgba(0, 0, 0, 0.3) — плоская тень нажатия */
--shadow-active-offset:  2px;
--shadow-active-offsetX: var(--shadow-active-offset);
--shadow-active-offsetY: var(--shadow-active-offset);
--shadow-active-blur:    8px;
--shadow-active-color:   rgba(0, 0, 0, 0.3);
```

```html
<button shadow="hover">               <!-- тень при наведении -->
<article shadow="hover focus">        <!-- тень при hover и при фокусе -->
<div shadow="hover active">           <!-- тень при hover, плоская при нажатии -->
<input shadow="focus">                <!-- тень только при фокусе поля -->
```

---

### `opacity` - плавное мигание

Анимация прозрачности `1 → 0 → 1`, плавная (`linear`). Длительность `--opacity-duration`,
по умолчанию `--td-slow`.

```html
<div opacity="">             <!-- мигает один раз при загрузке -->
<div opacity="" infinite=""> <!-- мигает постоянно -->
<div opacity="hover">        <!-- при наведении -->
<div opacity="" td="2s">     <!-- медленнее -->
<div opacity="" style="--opacity-duration: 2s">
```

> [!warning] Не для стеклянных плашек
> Анимация меняет `opacity` всего элемента, а с ним гаснет и размытая подложка
> `backdrop-filter` - см. "`opacity` и `backdrop-filter`" ниже.

---

### `blink` - мигание

Резкое ступенчатое мигание (`step-end`, без плавности). Длительность `--blink-duration`, по умолчанию `1s`.

```html
<span blink="">               <!-- мигает один раз -->
<span blink="" infinite="">   <!-- непрерывное мигание -->

<span blink="" style="--blink-duration: 0.5s"> <!-- быстрое -->
```

> В отличие от `opacity`, `blink` - резкое ступенчатое мигание (`animation-timing-function: step-end`).

---

### `typing-text` - эффект печатной машинки

Анимация появления текста символ за символом с мигающим курсором (`::after`, 1s).

```css
--typing-duration: 3s;     /* время набора */
--typing-steps:    24;     /* количество шагов (≈ кол-во символов) */
--typing-chars:    10;     /* минимальная ширина в символах */
--typing-color:    #000;   /* цвет курсора */
--typing-width:    2px;    /* толщина курсора */
```

```html
<h1 typing-text="">Текст печатается...</h1>

<!-- Кастомные параметры -->
<p typing-text="" style="
    --typing-steps: 18;
    --typing-chars: 18;
    --typing-duration: 2s;
    --typing-color: #542D8C;
">Привет, мир!</p>
```

Элемент получает `display: inline-block; overflow: hidden; white-space: nowrap` автоматически.
`typing-text="hover"` (`active`, `focus`) ставит набор на паузу до триггера.

**Как настроить `--typing-steps` и `--typing-chars`**: оба равны количеству символов в тексте.

---

### `pulse` - пульсация

Лёгкое увеличение/уменьшение (биение) элемента. Длительность `--pulse-duration`, по умолчанию `--td-medium`.

```css
--pulse-scale: 1.03;   /* насколько больше в пике */
```

```html
<div pulse="">             <!-- пульсирует один раз при загрузке -->
<div pulse="" infinite=""> <!-- непрерывная пульсация -->
<button pulse="hover">     <!-- пульсирует при наведении -->

<div pulse="" style="--pulse-scale: 1.08"> <!-- интенсивнее -->
```

---

### `wobble` - покачивание

Элемент качается по оси Z (поворот туда-обратно). Длительность `--wobble-duration`, по умолчанию `--td-fast`.

```css
--wobble-angle: 10deg;    /* угол отклонения */
```

```html
<div wobble="">            <!-- покачивается один раз -->
<div wobble="hover">      <!-- при наведении -->
<div wobble="" infinite=""> <!-- постоянное покачивание -->

<!-- Например, колокольчик/иконка уведомления -->
<div icon="square" wobble="hover" style="--wobble-angle: 15deg">
    <svg ...></svg>
</div>
```

---

### `sheen` - блик (shimmer)

Светлая полоса проходит по элементу через `::before`. Длительность `--sheen-duration`, по умолчанию `--td-medium`.
Элемент получает `position: relative; overflow: hidden` сам - полоса за его края не выходит.

```css
--sheen-color: rgba(255, 255, 255, 0.1);   /* цвет блика */
--sheen-width: max(30px, 30%);             /* ширина полосы */
--sheen-angle: -45deg;                     /* угол */
```

```html
<article class="card" sheen="hover">  <!-- блик при наведении -->
<button sheen="hover" td="fast">

<!-- Кастомный блик -->
<div sheen="hover" style="
    --sheen-color: rgba(255, 200, 0, 0.4);
    --sheen-angle: -30deg;
">
```

---

### `vibrate` - дрожание

Быстрое мелкое дрожание по X и Y с лёгким поворотом. Длительность цикла `--vibrate-duration`,
по умолчанию `--td-fast`; пока эффект работает, он повторяется бесконечно (`--vibrate-iteration-count: infinite`).

```css
--vibrate-x:      2px;     /* смещение по горизонтали */
--vibrate-y:      1px;     /* смещение по вертикали */
--vibrate-rotate: 0.5deg;  /* поворот */
```

```html
<div vibrate="hover">          <!-- дрожит, пока наведён курсор -->
<div vibrate="active">         <!-- пока нажат -->
<div vibrate="reverse">        <!-- дрожит постоянно -->
<div vibrate="reverse hover">  <!-- дрожит постоянно, замирает при наведении -->
```

> Анимация стоит на паузе и идёт только при триггере. `reverse` переворачивает логику: дрожит
> всегда и замирает при триггере. Без триггера и без `reverse` (`vibrate=""`) элемент неподвижен.

---

### `float` - парение

Плавное движение вверх-вниз по оси Y. Длительность `--float-duration`, по умолчанию `--td-slow`.

```css
--float-range: 6px;    /* амплитуда */
```

```html
<div float="" infinite="">     <!-- непрерывное парение вверх-вниз -->
<div float="hover" infinite=""> <!-- парит при наведении -->

<!-- Горизонтальное парение (влево-вправо) -->
<div float="horizontal" infinite="">
<div float="hover horizontal" infinite="">

<!-- Кастомная амплитуда -->
<div float="" infinite="" style="--float-range: 12px">
```

| Значение             | Движение           |
|---------------------|--------------------|
| `float=""`          | вверх-вниз         |
| `float="horizontal"` | влево-вправо      |

---

### `heartbeat` - сердцебиение

Двойная пульсация, имитирующая сердцебиение. Длительность `--heartbeat-duration`, по умолчанию `--td-slow`.

```css
--heartbeat-first-scale:  1.10;    /* первый «удар» */
--heartbeat-second-scale: 0.95;    /* второй «удар» */
```

```html
<div heartbeat="">              <!-- один раз при загрузке -->
<div heartbeat="" infinite="">  <!-- непрерывное сердцебиение -->
<button heartbeat="hover">      <!-- при наведении -->

<div heartbeat="" infinite="" style="--heartbeat-first-scale: 1.2">
```

---

### `jello` - желеобразное покачивание

"Резиновая" деформация: элемент растягивается и сжимается, как желе. Длительность `--jello-duration`, по умолчанию `--td-medium`.

```html
<div jello="">           <!-- один раз -->
<div jello="hover">     <!-- при наведении -->
<div jello="" infinite=""> <!-- непрерывно -->
```

Анимация использует `scale3d` с фиксированными ключевыми кадрами; настраивается только длительность.

---

### `ripple` - волна клика

Круговая волна, расходящаяся от центра элемента через `::before`. Длительность `--ripple-duration`, по умолчанию `--td-medium`.

```css
--ripple-color: rgba(255, 255, 255, 0.479);    /* цвет волны */
```

```html
<button ripple="hover">
<button ripple="active">          <!-- волна при нажатии (наиболее естественно) -->
<button ripple="hover active">
```

> **Важно**: `ripple` **не имеет** автозапуска (без триггера эффект не применяется). Чаще всего используется с `active`.

```html
<button class="button" ripple="active" style="--ripple-color: rgba(84,45,140,0.3)">
    Нажми меня
</button>
```

---

### `shimmer-text` - мерцание текста

Градиентный блик по тексту (через `background-clip: text`): текст становится прозрачным, по нему
бесконечно бежит градиент. Длительность цикла `--shimmer-duration`, по умолчанию `2s`.

```css
--shimmer-color: var(--color, black);   /* цвет блика */
--shimmer-size:  100%;                  /* полуширина градиента */
```

```html
<h1 shimmer-text="">                <!-- постоянное мерцание -->
<span shimmer-text="hover">        <!-- текст прозрачный, блик бежит только при hover -->
<a shimmer-text="focus">           <!-- обычный текст, мерцание при фокусе -->

<h1 shimmer-text="" style="
    --shimmer-color: rgba(255, 200, 0, 0.9);
    --shimmer-size: 50%;
">Заголовок с золотом</h1>
```

> **Внимание**: у `shimmer-text=""` и `shimmer-text="hover"` `color` элемента всегда `transparent` -
> текст виден только через градиент. У `active` и `focus` текст обычный, прозрачным он становится
> на время триггера. `infinite` не нужен: мерцание бесконечно всегда.

---

### `underline` - подчёркивание

Анимированное подчёркивание через `::after` (псевдоэлемент расширяется по ширине). Переход `--underline-duration`, по умолчанию `--td-slow`.

```css
--underline-color:  currentColor;    /* цвет линии */
--underline-width:  2px;             /* толщина линии */
--underline-offset: 2px;             /* отступ от текста вниз */
--underline-start:  0%;              /* начальная ширина (до анимации) */
```

```html
<a underline="hover">Ссылка</a>          <!-- от центра в обе стороны -->
<a underline="left hover">Ссылка</a>     <!-- слева направо -->
<a underline="right hover">Ссылка</a>    <!-- справа налево -->
```

| Значение                  | Направление раскрытия          |
|--------------------------|-------------------------------|
| `underline="hover"`      | из центра к краям (по умолчанию) |
| `underline="left hover"` | слева направо                  |
| `underline="right hover"` | справа налево                 |

```html
<!-- Кастомный стиль -->
<span underline="hover" style="
    --underline-color: #F15A24;
    --underline-width: 3px;
    --underline-offset: 5px;
">Текст с оранжевой линией</span>

<!-- Постоянное подчёркивание (без триггера) -->
<h2 underline="">Заголовок</h2>
```

> **Переопределение в `root.css`**: часто нужно скорректировать `--underline-offset` для всего сайта:
> ```css
> :root { --underline-offset: -3px; }
> ```

---

### `spin` - вращение

Вращение на 360°. Длительность `--spin-duration`, по умолчанию `--td-slow` (0.775s).

```html
<div spin="" infinite="">           <!-- бесконечное вращение (типично) -->
<div spin="hover" infinite="">      <!-- вращается при hover -->

<!-- Спиннер загрузки -->
<svg spin="" infinite="" style="--spin-duration: 0.8s">...</svg>
```

---

### `bounce` - прыжок

Элемент прыгает вверх-вниз (движение вдоль оси Y). Длительность `--bounce-duration`, по умолчанию `--td-medium`.

```css
--bounce-height: 30px;    /* высота прыжка */
```

```html
<div bounce="">                <!-- один прыжок при загрузке -->
<div bounce="" infinite="">    <!-- непрерывные прыжки -->
<div bounce="hover">           <!-- прыгает при наведении -->

<div bounce="" infinite="" style="--bounce-height: 50px">
```

---

### `skew` - наклон

Наклоняет элемент по оси X (`transform: skewX()`) при триггере. Переход `--skew-duration`, по умолчанию `--td-medium`.

```css
--skew-hover:  10deg;    /* наклон при hover */
--skew-active: -10deg;   /* наклон при active и focus */
```

```html
<div skew="hover">
<div skew="hover active">
<div skew="hover" style="--skew-hover: 20deg">
```

---

### `glow` - свечение

Цветное неоновое свечение через `box-shadow: 0 0 …` при триггере (в отличие от серой тени `shadow`). Переход `--glow-duration`, по умолчанию `--td-medium`.

```css
--glow-color: rgba(0, 150, 255, 0.7);   /* цвет свечения */
--glow-size:  16px;                       /* радиус размытия */
```

```html
<button glow="hover">
<a glow="hover focus">
<div glow="hover" style="--glow-color: #f0a; --glow-size: 24px">
```

---

### `grayscale` - обесцвечивание

Элемент ч/б (`filter: grayscale()`), при `:hover`, `:active` или `:focus` цвет возвращается
(зеркало `blur`). Переход `--grayscale-duration`, по умолчанию `--td-medium`.

```css
--grayscale-amount: 100%;   /* степень обесцвечивания */
```

```html
<img grayscale="">                                  <!-- ч/б, цвет при hover/active/focus -->
<img grayscale="" style="--grayscale-amount: 60%">
```

---

### `tada` - "та-да"

Привлекающая внимание анимация (масштаб + покачивание), канонический `tada` из animate.css.
Длительность `--tada-duration`, по умолчанию `--td-slow`.

```html
<div tada="">              <!-- один раз при загрузке -->
<div tada="hover">        <!-- при наведении -->
<div tada="" infinite="">  <!-- непрерывно -->
```

Фиксированные ключевые кадры; настраивается только длительность.

---

### `swing` - качание

Качание на оси сверху (`transform-origin: top center`), канонический `swing` из animate.css.
Длительность `--swing-duration`, по умолчанию `--td-slow`.

```html
<div swing="">             <!-- один раз -->
<div swing="hover">       <!-- при наведении -->
<div swing="" infinite=""> <!-- непрерывно -->
```

Фиксированные ключевые кадры; настраивается только длительность.

---

## Полный справочник эффектов

У каждого эффекта есть `--<эффект>-duration` (у `typing-text` - `--typing-duration`, у
`shimmer-text` - `--shimmer-duration`); в таблице - остальные переменные.

| Атрибут        | Тип        | Псевдоэлемент | Триггеры | По умолчанию, длительность | Переменные |
|---------------|------------|---------------|----------|----------------------------|------------|
| `raise`       | transition | -             | hover, active, focus | `--td-medium` | `--raise-hover`, `--raise-active` |
| `scale`       | transition | -             | hover, active, focus | `--td-medium` | `--scale-hover`, `--scale-active` |
| `rotate`      | transition | -             | hover, active, focus | `--td-medium` | `--rotate-hover`, `--rotate-active` |
| `blur`        | transition | -             | всегда hover/active/focus | `--td-slow` | `--blur-amount` |
| `shadow`      | transition | -             | hover, active, focus | `--td-medium` | `--shadow-{hover,active}-{offset,offsetX,offsetY,blur,color}` |
| `opacity`     | animation  | -             | авто, hover, active, focus | `--td-slow` | - |
| `blink`       | animation  | -             | авто, hover, active, focus | `1s` | - |
| `typing-text` | animation  | курсор `::after` | авто, пауза до hover/active/focus | `3s` | `--typing-steps`, `--typing-chars`, `--typing-color`, `--typing-width` |
| `pulse`       | animation  | -             | авто, hover, active, focus | `--td-medium` | `--pulse-scale` |
| `wobble`      | animation  | -             | авто, hover, active, focus | `--td-fast` | `--wobble-angle` |
| `sheen`       | animation  | `::before`    | авто, hover, active, focus | `--td-medium` | `--sheen-color`, `--sheen-width`, `--sheen-angle` |
| `vibrate`     | animation  | -             | hover, active, focus, reverse | `--td-fast` | `--vibrate-x`, `--vibrate-y`, `--vibrate-rotate`, `--vibrate-iteration-count` |
| `float`       | animation  | -             | авто, hover, active, focus; horizontal | `--td-slow` | `--float-range` |
| `heartbeat`   | animation  | -             | авто, hover, active, focus | `--td-slow` | `--heartbeat-first-scale`, `--heartbeat-second-scale` |
| `jello`       | animation  | -             | авто, hover, active, focus | `--td-medium` | - |
| `ripple`      | animation  | `::before`    | hover, active, focus (обязателен) | `--td-medium` | `--ripple-color` |
| `shimmer-text`| animation  | -             | авто, hover, active, focus | `2s` | `--shimmer-color`, `--shimmer-size` |
| `underline`   | transition | `::after`     | авто, hover, active, focus; left, right | `--td-slow` | `--underline-color`, `--underline-width`, `--underline-offset`, `--underline-start` |
| `spin`        | animation  | -             | авто, hover, active, focus | `--td-slow` | - |
| `bounce`      | animation  | -             | авто, hover, active, focus | `--td-medium` | `--bounce-height` |
| `skew`        | transition | -             | hover, active, focus | `--td-medium` | `--skew-hover`, `--skew-active` |
| `glow`        | transition | -             | hover, active, focus | `--td-medium` | `--glow-color`, `--glow-size` |
| `grayscale`   | transition | -             | всегда hover/active/focus | `--td-medium` | `--grayscale-amount` |
| `tada`        | animation  | -             | авто, hover, active, focus | `--td-slow` | - |
| `swing`       | animation  | -             | авто, hover, active, focus | `--td-slow` | - |

---

## Примеры из реального проекта

```html
<!-- Карточка услуги: блик + тень -->
<article col="12 lg-3" sheen="hover" shadow="hover focus" tabindex="0">
    <div class="service_card__icon">
        <!-- иконка через маску -->
        <div icon="square" mask="" class="color_violet" 
             style="--mask: url('/images/icon.png')">
        </div>
    </div>
    <h3>Название услуги</h3>
</article>

<!-- Фотогалерея: масштаб при наведении -->
<picture scale="hover">
    <source srcset="photo.webp" type="image/webp">
    <img src="photo.jpg" alt="Фото">
</picture>

<!-- Кнопка с ripple-эффектом и тенью -->
<button class="button button--orange" p="5" shadow="hover active" ripple="active">
    Забронировать
</button>

<!-- Иконка с wobble при hover -->
<div icon="square" mask=""  wobble="hover" 
     style="--mask: url('/icons/bell.svg'); --color: currentColor">
</div>

<!-- Анимированный заголовок секции -->
<h2 typing-text="" style="--typing-steps: 22; --typing-chars: 22">
    Добро пожаловать
</h2>

<!-- Постоянно парящий элемент (декоративный) -->
<div class="hero__decor" float="" infinite="" style="--float-range: 15px"></div>

<!-- Подчёркивание-эффект на ссылках навигации -->
<a href="/about" underline="hover">О нас</a>
```

---

## Доступность

При `prefers-reduced-motion: reduce` бандл отключает анимации эффектов:

```css
@media (prefers-reduced-motion: reduce) {
    *:is([pulse], [wobble], [float], [heartbeat], [jello], [shimmer-text],
         [vibrate], [bounce], [spin], [opacity], [blink], [tada], [swing]),
    *:is([sheen], [ripple])::before {
        animation: none !important;
        transition: none !important;
    }

    /* typing-text: текст сразу целиком, курсор не мигает */
    *[typing-text] { animation: none !important; width: auto !important; }
    *[typing-text]::after { animation: none !important; }
}
```

Переходы `raise`, `scale`, `rotate`, `skew`, `shadow`, `glow`, `blur`, `grayscale`, `underline`
этим правилом не отключаются. Сократить вообще всё движение сайта - опция
`$reduced-motion: true` бандла `main` (см. корневой `README.md`).

---

## Комбинирование эффектов

Несколько атрибутов можно применить к одному элементу:

```html
<!-- Тень + блик + подъём при hover -->
<article shadow="hover" sheen="hover" raise="hover" td="medium">
    Карточка
</article>

<!-- Масштаб при наведении + волна при нажатии -->
<button scale="hover" ripple="active" shadow="hover active">
    Кнопка
</button>

<!-- Float + pulse для декоративного элемента: pulse на обёртке -->
<div pulse="" infinite="" td="slow">
    <div float="" infinite="" td="slow">Декор</div>
</div>
```

> [!warning] Эффекты на `transform` не складываются
> `raise`, `scale`, `rotate`, `skew` и анимации `pulse`, `wobble`, `float`, `heartbeat`, `jello`,
> `vibrate`, `bounce`, `spin`, `tada`, `swing` задают одно свойство - `transform`. На одном
> элементе срабатывает только последний в бандле: `raise="hover" scale="hover"` даёт только
> масштаб. Второй эффект - на обёртке. То же для пар `blur` + `grayscale` (`filter`) и `shadow` +
> `glow` (`box-shadow`).

> [!warning] `opacity` и `backdrop-filter`
> `opacity` меньше 1 (своя или эффектов `opacity`, `blink`) гасит элемент целиком, включая
> размытую подложку `backdrop-filter`: стекло становится прозрачным. В Figma прозрачность слоя
> размытие фона не трогает. Приглушить стеклянную плашку - атрибут `dim` из бандла `main`: он
> меняет `opacity` у содержимого, а фон и размытие остаются.

---

## Настройка

Параметры эффектов - обычные наследуемые переменные. Бандл их не объявляет, поэтому значение
работает с любого уровня дерева:

```css
:root {
    /* Замедлить все переходы */
    --td-fast:   0.4s;
    --td-medium: 0.7s;

    /* Тень и подчёркивание по умолчанию для всего сайта */
    --shadow-hover-color: rgba(84, 45, 140, 0.25);
    --underline-offset: -2px;
    --underline-width: 3px;
}

/* Компонент */
.my-button {
    --raise-hover: 0.3rem;
    --sheen-color: rgba(255, 255, 255, 0.5);
}

/* Родитель меняет эффект потомка */
.card:hover { --glow-color: var(--accent); --underline-color: var(--accent); }
```

Приоритет - обычный для наследования: ближайшее объявление побеждает. `style` на самом элементе
сильнее правила на родителе, родитель сильнее `:root`.

### Встраивание в чужую страницу

С `$scope` (`src/effects/_config.scss`, тот же селектор, что в конфиге `main`) атрибуты эффектов действуют только
внутри корня, а токены `--td-*` и `--iteration-count` объявляются на нём, а не на `:root`:

```scss
@use '@cat-of-summer/st-style/scss/effects/config' with ($scope: '.st-ui');
@use '@cat-of-summer/st-style/scss/effects';
```

Длительности тогда переопределяются на корне: `.st-ui { --td-fast: .2s }`. Имена `@keyframes` (`pulse`, `spin`, …)
остаются глобальными. Подробнее - "Встраивание в чужую страницу (`$scope`)" в документации `main`.
