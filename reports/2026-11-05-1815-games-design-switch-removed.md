# Отчёт: удалён переключатель дизайна и мёртвый «классический» вариант страницы игры

**Дата:** 2026-11-05
**Часть проекта:** `frontend/`
**Файлы:** `app/pages/games/[slug].vue`, `app/components/game/DetailClassic.vue` (удалён),
`app/components/game/Gallery.vue`, `app/components/game/Specs.vue`

## Проблема

На странице игры остался временный переключатель «Современный / Классический» —
он был нужен для приёмки дизайна. По итогу принят современный дизайн, а переключатель
и классическая вёрстка остались в коде (плюс мёртвые ветки в связанных компонентах).

## Удалено

**`app/pages/games/[slug].vue`**
- кнопки переключения дизайна и `designOptions`;
- тип `DesignVariant`, `useState('game-detail-design')`, `setDesign`, `onMounted`
  с чтением `localStorage`, `useAuth()`;
- ветка `<GameDetailClassic>` — остался только `<GameDetailModern>`;
- недостижимый блок «Игра не найдена» внутри `v-if="game"` и лишняя обёртка
  `<template v-if="game">`.

**`app/components/game/DetailClassic.vue`** — удалён целиком (85 строк), больше нигде
не использовался.

**`app/components/game/Gallery.vue`**
- пропсы `coverFallback` и `heroCovered` (значение по умолчанию совпадало с
  единственным вариантом использования);
- ветка «только обложка» стала `v-else`, класс `hidden lg:flex` зашит в шаблон —
  в современном дизайне обложка уже в hero, на мобильном дубль не нужен.

**`app/components/game/Specs.vue`**
- проп `variant?: 'card' | 'chips'` — остался только режим «чипы» (так используют и
  hero игры, и панель параметров);
- удалён блок разметки для `variant === 'card'`.

## Проверка

- `npx eslint` по изменённым файлам — без ошибок (exit 0);
- поиск по `app/` — упоминаний `DetailClassic`, `designOptions`, `DesignVariant`,
  `game-detail-design`, `coverFallback`, `heroCovered`, `hero-covered` не осталось
  (`variant=` остались только у `UButton`/`UBadge`).

## Дополнение: то же самое в комиксах

- `app/components/comic/Gallery.vue` — убраны пропсы `coverFallback` и `heroCovered`,
  ветка «только обложка» стала `v-else` с классом `hidden lg:flex`;
- `app/components/comic/Detail.vue` — убран атрибут `hero-covered` у `<ComicGallery>`
  (попадал в компонент как непроп с тем же именем);
- `app/components/game/DetailModern.vue` — по той же причине убран оставшийся
  `hero-covered` у `<GameGallery>`.

`npx eslint` по изменённым файлам (игры + комиксы) — exit 0.
