# Отчёт: значок лупы на изображениях контента не отображался

**Дата:** 2026-11-05
**Часть проекта:** `frontend/`
**Файлы:** `app/plugins/v-image-gallery.client.ts`, `app/assets/css/editor.css`

## Проблема

Директива `v-image-gallery` помечает открываемые на весь экран картинки классом
`is-zoomable`, а значок лупы (подсказка «можно нажать») рисуется в CSS через
псевдоэлемент `::after`. Значок перестал появляться на изображениях.

Причин две:

1. **Регрессия селектора.** Стиль лупы был написан под селектор
   `.tiptap.image-gallery figure.image:has(> img.is-zoomable)` — то есть под
   контейнер, у которого классы `.tiptap` и `.image-gallery` стоят на **одном**
   элементе. После коммита `4b54824` («Изменения дизайна») в `post/[slug].vue`
   контент разбили на сегменты (`splitEventTables`), и теперь `.image-gallery`
   ставится директивой на внешний `<div>`, а `.tiptap` — на вложенном `<div>`.
   Селектор перестал совпадать, лупа пропала на страницах новостей.

2. **«Голые» картинки вообще не покрывались.** Часть старого контента хранит
   картинки без обёртки `<figure class="image">` (просто `<img>` внутри `<p>`/`<td>`).
   Для них селектор `figure.image:has(...)` не совпадал никогда — лупы на них не было
   изначально.

## Решение

1. Стиль лупы вынесен из вложенности `.tiptap` на уровень `:root`, селектор стал
   `.image-gallery figure.image:has(> img.is-zoomable)` — он больше не требует,
   чтобы `.image-gallery` и `.tiptap` были на одном элементе (в новостях контент
   лежит во вложенном `.tiptap`).

2. В директиве картинки контента без `<figure class="image">` (внутри `.tiptap`)
   теперь оборачиваются в `<span class="image-zoom-wrap">`. Лупа рисуется на этой
   обёртке тем же `::after`, что и на `figure`. Обложки книг и галереи игр/комиксов
   (вне `.tiptap`) не трогаются, чтобы не ломать их вёрстку.

   Перенос вертикального отступа с `<img>` на обёртку (`margin: 2rem auto` +
   `> img { display: block; margin: 0 auto }`) нужен, чтобы обёртка точно облегала
   фото и лупа вставала в его угол.

## Проверка (headless Chrome, CDP 9222)

Пост с картинками в `figure.image` (`/post/molodye-bibliotekari-…-2026-09-23`):

- `img.is-zoomable` = 14, `figure.image:has(> img.is-zoomable)` = 14;
- у `figure.image` псевдоэлемент `::after` присутствует, фон — SVG-лупа;
- обёртки `image-zoom-wrap` для них не создаются (0).

Пост с «голыми» картинками (`/post/cherez-veka-k-edinstvu`):

- 6 картинок обёрнуты в `image-zoom-wrap`, у обёртки `::after` с лупой есть;
- `getBoundingClientRect()` обёртки совпадает с картинкой (разница 0 px по всем
  сторонам) — лупа встаёт ровно в угол фото.

`npx eslint app/plugins/v-image-gallery.client.ts` — чисто.

Скрипты проверки: `temp/scenarios/verify-magnifier.mjs`, `temp/scenarios/diag-figure.mjs`,
`temp/scenarios/diag-bare-geo.mjs`.
