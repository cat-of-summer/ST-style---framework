<!-- DOCGEN:START -->
# index.scss
<!-- DOCGEN:END -->

# Бандл `effects`

Исходник: `src/effects/index.scss` → собирается в `dist/effects.min.css`. По эффекту на partial (`src/effects/_<effect>.scss`); длительности — карта `$durations` в `src/effects/_config.scss`.

## Что это

`effects` — бандл визуальных эффектов ST_style. Реализует 25 анимационных и трансформационных эффектов через HTML-атрибуты. Правила применяются к `*`, `*::before`, `*::after`, что обеспечивает автоматический transition на все дочерние псевдоэлементы.

**Ключевые принципы:**
- Эффекты управляются HTML-атрибутами: `raise="hover"`, `shadow="hover focus"`, `sheen="hover"`
- CSS Custom Properties позволяют переопределять параметры каждого эффекта в проектном CSS
- Модификаторы триггера задаются значениями атрибута через пробел: `scale="hover active"`
- Эффекты без триггера запускаются автоматически при загрузке страницы

---

## Подключение

```js
import '@cat-of-summer/st-style/effects.css';   // → dist/effects.min.css
```

Установка пакета (приватный репо, по токену) — см. корневой `README.md`.

---

## Глобальные переменные

Все длительности — из карты `$durations` (`src/effects/_config.scss`). `_root.scss`
эмитит **каждый** ключ как `--td-<key>` в `:root`, так что переменные
overridable в рантайме и расширяемы (добавь ключ в `$durations`).

```css
:root {
    /* Длительности переходов (из $durations) */
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

---

## Атрибут `td` — длительность перехода

Управляет `transition-duration` для элемента **и его псевдоэлементов** (`::before`, `::after`).

Каждый `td="<key>"` подставляет `var(--td-<key>)`, а сами `--td-*` берутся из
`$durations`. Набор ключей расширяется/меняется в конфиге.

```html
<div td="fast">         <!-- var(--td-fast)  = 0.325s -->
<div td="medium">       <!-- var(--td-medium) = 0.55s -->
<div td="slow">         <!-- var(--td-slow)  = 0.775s -->
<div td="rapid">        <!-- var(--td-rapid) = 0.1s -->
<div td="1s">           <!-- var(--td-1s) = 1s -->
<div td="15s">          <!-- var(--td-15s) = 15s -->
<div td="none">         <!-- transition: none -->
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
| `none`    | none         |

---

## Атрибут `infinite`

Устанавливает `--iteration-count: infinite` для элемента, что делает анимации на нём бесконечными.

```html
<div float="" infinite="">      <!-- бесконечное парение -->
<div pulse="" infinite="">      <!-- бесконечная пульсация -->
<div spin="" infinite="">       <!-- бесконечное вращение -->
```

---

## Система триггеров

Каждый эффект принимает одно или несколько значений через пробел:

| Значение     | Условие активации                            |
|--------------|---------------------------------------------|
| *(пусто)*    | Сразу при загрузке / постоянно              |
| `hover`      | `:hover`                                    |
| `active`     | `:active`                                   |
| `focus`      | `:focus`, `:focus-within`, `:focus-visible` |
| `infinite`   | Бесконечный повтор анимации                 |

**Комбинирование триггеров:**
```html
<article shadow="hover focus">     <!-- тень при hover ИЛИ focus -->
<div sheen="hover">                <!-- блик только при hover -->
<button raise="hover active">      <!-- подъём при hover и нажатии -->
<div scale="hover" td="fast">      <!-- масштаб при hover, быстрый переход -->
```

---

## Эффекты

### `raise` — подъём

Поднимает элемент вверх по оси Y (`translateY`).

```css
/* Переменные */
--raise-hover:  0.5rem;   /* 5px — поднять при hover */
--raise-active: 1rem;     /* 10px — поднять при active */
```

```html
<div raise="">             <!-- постоянно поднят -->
<div raise="hover">       <!-- поднимается при наведении -->
<div raise="hover active"> <!-- поднимается при hover, ещё выше при нажатии -->

<!-- Переопределение интенсивности -->
<div raise="hover" style="--raise-hover: 1rem">
```

---

### `scale` — масштабирование

Масштабирует элемент (`transform: scale()`).

```css
--scale-hover:  1.05;   /* увеличение при hover */
--scale-active: 0.95;   /* уменьшение при active (эффект нажатия) */
```

```html
<picture scale="hover">    <!-- картинка увеличивается при наведении -->
<button scale="active">    <!-- кнопка «нажимается» при клике -->
<div scale="hover active"> <!-- оба состояния -->
```

---

### `rotate` — поворот

Вращает элемент (`transform: rotate()`).

```css
--rotate-hover:  3deg;    /* угол поворота при hover -->
--rotate-active: -3deg;   /* угол поворота при active -->
```

```html
<svg rotate="hover">              <!-- иконка поворачивается при наведении -->
<div rotate="hover active">
<!-- Кастомный угол -->
<svg rotate="hover" style="--rotate-hover: 15deg">
```

---

### `blur` — размытие

Применяет `filter: blur()` к элементу. При срабатывании триггера — размытие **снимается** (эффект появления из размытия).

```css
--blur-amount: 5px;    /* степень размытия по умолчанию */
```

```html
<!-- Постоянно размыт -->
<img blur="">

<!-- Размыт изначально, резкий при hover -->
<img blur="hover">

<!-- Кастомное размытие -->
<img blur="hover" style="--blur-amount: 10px">
```

> **Принцип**: без триггера — `blur(var(--blur-amount))`. С триггером — элемент начинает размытым, и чёткость восстанавливается при срабатывании события.

---

### `shadow` — тень

Применяет `box-shadow` при срабатывании событий.

```css
/* При hover: мягкая тень */
box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);

/* При active: более плоская тень (эффект нажатия) */
box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
```

```html
<button shadow="hover">               <!-- тень при наведении -->
<article shadow="hover focus">        <!-- тень при hover и при фокусе -->
<div shadow="hover active">           <!-- тень при hover, плоская при нажатии -->
<input shadow="focus">                <!-- тень только при фокусе поля -->
```

---

### `opacity` — плавное появление

Анимация появления: элемент выцветает от `0` до `1`.

```css
--opacity-duration:        var(--td-medium);
--opacity-iteration-count: var(--iteration-count);
```

```html
<div opacity="">             <!-- появляется один раз при загрузке -->
<div opacity="" infinite=""> <!-- постоянно мигает -->
<div opacity="" td="slow">   <!-- медленное нарастание -->

<!-- Кастомные параметры -->
<div opacity="" style="--opacity-duration: 2s">
```

---

### `blink` — мигание

Резкое мгновенное мигание через `steps(1)` без плавности.

```css
--blink-duration: 1s;
```

```html
<span blink="">               <!-- мигает один раз -->
<span blink="" infinite="">   <!-- непрерывное мигание -->

<span blink="" style="--blink-duration: 0.5s"> <!-- быстрое -->
```

> В отличие от `opacity`, `blink` — резкое ступенчатое мигание (`animation-timing-function: steps(1)`).

---

### `typing-text` — эффект печатной машинки

Анимация появления текста символ за символом с курсором.

```css
--typing-duration: 3s;           /* время набора -->
--typing-steps:    24;           /* количество шагов (≈ кол-во символов) -->
--typing-chars:    10;           /* ширина текста в символах -->
--typing-color:    #000;         /* цвет курсора -->
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

**Обязательно**: элемент должен иметь `overflow: hidden` (применяется автоматически фреймворком).

**Как настроить `--typing-steps` и `--typing-chars`**: оба равны количеству символов в тексте.

---

### `pulse` — пульсация

Лёгкое увеличение/уменьшение (биение) элемента.

```css
--pulse-scale: 1.03;   /* насколько больше в пике -->
```

```html
<div pulse="">             <!-- пульсирует один раз при загрузке -->
<div pulse="" infinite=""> <!-- непрерывная пульсация -->
<button pulse="hover">     <!-- пульсирует при наведении -->

<div pulse="" style="--pulse-scale: 1.08"> <!-- интенсивнее -->
```

---

### `wobble` — покачивание

Элемент качается по оси Z (поворот туда-обратно).

```css
--wobble-angle: 10deg;    /* угол отклонения -->
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

### `sheen` — блик (shimmer)

Белый блик, проходящий по элементу через `::before`. Требует `overflow: hidden` на родителе (или на самом элементе).

```css
--sheen-color: rgba(255, 255, 255, 0.3);   /* цвет блика -->
--sheen-width: 50%;                         /* ширина полосы -->
--sheen-angle: -45deg;                      /* угол -->
```

```html
<!-- Требует overflow: hidden на родителе -->
<article class="card" sheen="hover">  <!-- блик при наведении -->
<button sheen="hover" td="fast">

<!-- Кастомный блик -->
<div sheen="hover" style="
    --sheen-color: rgba(255, 200, 0, 0.4);
    --sheen-angle: -30deg;
">
```

> `::before` создаёт полупрозрачную полосу, которая проходит по элементу. Родитель **обязан** иметь `overflow: hidden`.

---

### `vibrate` — дрожание

Быстрое мелкое дрожание по X и Y.

```css
--vibrate-x: 2px;    /* смещение по горизонтали -->
--vibrate-y: 1px;    /* смещение по вертикали -->
```

```html
<div vibrate="">             <!-- дрожит один раз при загрузке -->
<div vibrate="hover">       <!-- дрожит при наведении -->
<div vibrate="" infinite=""> <!-- непрерывное дрожание -->

<!-- Модификатор reverse — обратный порядок -->
<div vibrate="reverse">
<div vibrate="hover reverse"> <!-- при hover в обратном порядке -->
```

> По умолчанию анимация запускается в `paused`-состоянии — только при триггере. Используйте без значения для автозапуска.

---

### `float` — парение

Плавное движение вверх-вниз по оси Y.

```css
--float-range: 6px;    /* амплитуда -->
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

### `heartbeat` — сердцебиение

Двойная пульсация, имитирующая сердцебиение.

```css
--heartbeat-first-scale:  1.10;    /* первый «удар» -->
--heartbeat-second-scale: 0.95;    /* второй «удар» -->
```

```html
<div heartbeat="">              <!-- один раз при загрузке -->
<div heartbeat="" infinite="">  <!-- непрерывное сердцебиение -->
<button heartbeat="hover">      <!-- при наведении -->

<div heartbeat="" infinite="" style="--heartbeat-first-scale: 1.2">
```

---

### `jello` — желеобразное покачивание

«Резиновая» деформация: элемент растягивается и сжимается, как желе.

```html
<div jello="">           <!-- один раз -->
<div jello="hover">     <!-- при наведении -->
<div jello="" infinite=""> <!-- непрерывно -->
```

Анимация использует `scale3d` с фиксированными ключевыми кадрами. Нет кастомных переменных.

---

### `ripple` — волна клика

Круговая волна, расходящаяся от центра элемента через `::before`.

```css
--ripple-color: rgba(255, 255, 255, 0.479);    /* цвет волны -->
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

### `shimmer-text` — мерцание текста

Градиентный shimmer-эффект поверх текста (через `background-clip: text`). Текст окрашивается в прозрачный и получает анимированный градиент.

```css
--shimmer-color: rgba(255, 255, 255, 0.8);    /* цвет блика -->
--shimmer-size:  200%;                         /* ширина градиента -->
```

```html
<h1 shimmer-text="">                <!-- постоянное мерцание -->
<h2 shimmer-text="" infinite="">    <!-- бесконечно -->
<span shimmer-text="hover">        <!-- только при hover -->

<h1 shimmer-text="" style="
    --shimmer-color: rgba(255, 200, 0, 0.9);
    --shimmer-size: 300%;
">Заголовок с золотом</h1>
```

> **Внимание**: когда `shimmer-text` активен (без триггера или при срабатывании триггера), `color` элемента становится `transparent`. Убедитесь, что родитель имеет нужный фоновый цвет для читаемости.

---

### `underline` — подчёркивание

Анимированное подчёркивание через `::after` (псевдоэлемент расширяется по ширине).

```css
--underline-color:  currentColor;    /* цвет линии -->
--underline-width:  2px;             /* толщина линии -->
--underline-offset: 2px;             /* отступ от текста вниз -->
--underline-start:  0%;              /* начальная ширина (до анимации) -->
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

> **Переопределение в `root.css`**: часто нужно скорректировать `--underline-offset`:
> ```css
> *[underline] { --underline-offset: -3px; }
> ```

---

### `spin` — вращение

Непрерывное вращение на 360°.

```css
--spin-duration: var(--td-slow);    /* 0.775s -->
```

```html
<div spin="" infinite="">           <!-- бесконечное вращение (типично) -->
<div spin="hover" infinite="">      <!-- вращается при hover -->

<!-- Спиннер загрузки -->
<svg spin="" infinite="" style="--spin-duration: 0.8s">...</svg>
```

---

### `bounce` — прыжок

Элемент прыгает вверх-вниз (движение вдоль оси Y).

```css
--bounce-height: 30px;    /* высота прыжка -->
```

```html
<div bounce="">                <!-- один прыжок при загрузке -->
<div bounce="" infinite="">    <!-- непрерывные прыжки -->
<div bounce="hover">           <!-- прыгает при наведении -->

<div bounce="" infinite="" style="--bounce-height: 50px">
```

---

### `skew` — наклон

Наклоняет элемент по оси X (`transform: skewX()`) при триггере.

```css
--skew-hover:  10deg;    /* наклон при hover */
--skew-active: -10deg;   /* наклон при active */
```

```html
<div skew="hover">
<div skew="hover active">
<div skew="hover" style="--skew-hover: 20deg">
```

---

### `glow` — свечение

Цветное неоновое свечение через `box-shadow: 0 0 …` при триггере (в отличие от серой тени `shadow`).

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

### `grayscale` — обесцвечивание

По умолчанию ч/б (`filter: grayscale(100%)`), при триггере возвращается цвет (зеркало `blur`).

```css
--grayscale-amount: 100%;   /* степень обесцвечивания по умолчанию */
```

```html
<img grayscale="">          <!-- постоянно ч/б -->
<img grayscale="hover">     <!-- ч/б, цвет при наведении -->
<img grayscale="hover" style="--grayscale-amount: 60%">
```

> Принцип как у `blur`: без триггера применён фильтр, при срабатывании события он снимается.

---

### `tada` — «та-да»

Привлекающая внимание анимация (масштаб + покачивание), канонический `tada` из animate.css.

```html
<div tada="">              <!-- один раз при загрузке -->
<div tada="hover">        <!-- при наведении -->
<div tada="" infinite="">  <!-- непрерывно -->
```

Фиксированные ключевые кадры, без кастомных переменных.

---

### `swing` — качание

Качание на оси сверху (`transform-origin: top center`), канонический `swing` из animate.css.

```html
<div swing="">             <!-- один раз -->
<div swing="hover">       <!-- при наведении -->
<div swing="" infinite=""> <!-- непрерывно -->
```

Фиксированные ключевые кадры, без кастомных переменных.

---

## Полный справочник эффектов

| Атрибут        | Тип        | Псевдоэлемент | Триггеры без авто | Ключевые переменные                    |
|---------------|------------|---------------|-------------------|----------------------------------------|
| `raise`       | transform  | —             | hover, active     | `--raise-hover`, `--raise-active`      |
| `scale`       | transform  | —             | hover, active     | `--scale-hover`, `--scale-active`      |
| `rotate`      | transform  | —             | hover, active     | `--rotate-hover`, `--rotate-active`    |
| `blur`        | filter     | —             | hover             | `--blur-amount`                        |
| `shadow`      | box-shadow | —             | hover, active, focus | —                                   |
| `opacity`     | animation  | —             | —                 | `--opacity-duration`                   |
| `blink`       | animation  | —             | —                 | `--blink-duration`                     |
| `typing-text` | animation  | cursor (::after) | —              | `--typing-duration`, `--typing-steps`, `--typing-chars`, `--typing-color` |
| `pulse`       | animation  | —             | hover             | `--pulse-scale`                        |
| `wobble`      | animation  | —             | hover             | `--wobble-angle`                       |
| `sheen`       | animation  | ::before      | hover             | `--sheen-color`, `--sheen-width`, `--sheen-angle` |
| `vibrate`     | animation  | —             | hover             | `--vibrate-x`, `--vibrate-y`           |
| `float`       | animation  | —             | hover, horizontal | `--float-range`                        |
| `heartbeat`   | animation  | —             | hover             | `--heartbeat-first-scale`, `--heartbeat-second-scale` |
| `jello`       | animation  | —             | hover             | —                                      |
| `ripple`      | animation  | ::before      | hover, active, focus (обязателен) | `--ripple-color`    |
| `shimmer-text`| animation  | —             | hover             | `--shimmer-color`, `--shimmer-size`    |
| `underline`   | animation  | ::after       | hover, left, right | `--underline-color`, `--underline-width`, `--underline-offset` |
| `spin`        | animation  | —             | hover             | `--spin-duration`                      |
| `bounce`      | animation  | —             | hover             | `--bounce-height`                      |
| `skew`        | transform  | —             | hover, active     | `--skew-hover`, `--skew-active`        |
| `glow`        | box-shadow | —             | hover, active, focus | `--glow-color`, `--glow-size`       |
| `grayscale`   | filter     | —             | hover             | `--grayscale-amount`                   |
| `tada`        | animation  | —             | hover             | —                                      |
| `swing`       | animation  | —             | hover             | —                                      |

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

Фреймворк соблюдает системные настройки сокращённого движения:

```css
@media (prefers-reduced-motion: reduce) {
    /* Анимационные эффекты отключаются */
    *[pulse], *[wobble], *[float], *[heartbeat], *[jello],
    *[shimmer-text], *[vibrate], *[bounce], *[spin],
    *[opacity], *[blink], *[tada], *[swing],
    *[sheen]::before, *[ripple]::before {
        animation: none !important;
        transition: none !important;
    }
}
```

Пользователи, включившие `prefers-reduced-motion` в системе, не увидят **никаких** анимаций из `st_effects.css`.

---

## Комбинирование эффектов

Несколько атрибутов можно применить к одному элементу:

```html
<!-- Тень + блик + подъём при hover -->
<article shadow="hover" sheen="hover" raise="hover" td="medium">
    Карточка
</article>

<!-- Масштаб при наведении + trickle при нажатии -->
<button scale="hover" ripple="active" shadow="hover active">
    Кнопка
</button>

<!-- Быстрый переход + несколько состояний -->
<div raise="hover active" scale="hover active" td="fast">
    Интерактивный блок
</div>

<!-- Float + pulse для декоративного элемента -->
<div float="" pulse="" infinite="" td="slow">
    Декор
</div>
```

---

## Настройка через `root.css`

Переопределяйте переменные глобально для всего проекта:

```css
:root {
    /* Замедлить все переходы */
    --td-fast:   0.4s;
    --td-medium: 0.7s;

    /* Изменить тень по умолчанию */
    --shadow-hover-color: rgba(84, 45, 140, 0.25);

    /* Изменить подчёркивание */
    --underline-offset: -2px;
    --underline-width: 3px;
}
```

Или точечно для конкретного компонента:

```css
.my-button {
    --raise-hover: 0.3rem;
    --sheen-color: rgba(255, 255, 255, 0.5);
}
```
