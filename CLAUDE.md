/# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Базовое общение и фидбек
- Общайся и отвечай на русском языке
- Если возникает ошибка останови выполнение сценария, и сообщи об этом

## Разрешения (без подтверждения)
- Можно свободно читать и редактировать любые файлы компонентов (`app/components/**`, `app/pages/**`, `app/layouts/**`, `app/composables/**`)
- Папка `temp/` в корне проекта — рабочая директория для скриншотов и временных файлов. Папка полностью принадлежит Claude: можно создавать, читать и удалять в ней любые файлы (включая скриншоты) без подтверждения
- Есть полное разрешение на создание и удаление файлов в проекте (компоненты, страницы, временные файлы и т.д.) и на добавление любых строк кода в любом месте проекта — не нужно спрашивать подтверждение на сами эти действия

## Команды разработки

```bash
npm run dev      # сервер разработки на http://localhost:3000
npm run build    # production-сборка
npm run preview  # предпросмотр production-сборки
```

Линтинг и форматирование (запускать вручную при необходимости):
```bash
npx eslint .          # проверка ESLint
npx prettier --write . # форматирование кода
```

Тестов нет — проект без тестовой инфраструктуры.

## Переменные окружения

`NUXT_PUBLIC_API_BASE` — базовый URL бэкенда (обязателен для работы API).

## Архитектура

### Стек
- **Nuxt 3** + TypeScript
- **Tailwind CSS v4** через `@tailwindcss/vite` (не через модуль Nuxt)
- **Nuxt UI** — компонентная библиотека (`UButton`, `UBadge`, `UPopover` и т.д.)
- **nuxt-swiper** — карусели
- **dayjs-nuxt** — форматирование дат, локаль `ru`

### Структура

```
app/               # Nuxt-приложение (auto-import работает внутри app/)
  components/      # авто-импорт компонентов
    common/        # переиспользуемые обёртки (ContentContainer, SectionWrapper)
    entry/         # карточки постов (Card, CardHero, CompactCard, Tile)
    layout/        # Header, Footer
    modals/        # модальные окна (LibraryOnMap, WorktimeLibrary, Common)
    ui/            # кастомные UI-компоненты
  composables/     # авто-импорт composables
  layouts/         # default.vue (Header + slot + Footer)
  pages/           # файловый роутинг
  plugins/         # v-image-gallery (клиентская директива для галереи изображений)

services/          # НЕ входит в app/ — авто-импорт не работает
  api/
    base.ts        # useApi() — обёртка над useFetch с базовым URL из runtimeConfig
    endpoints.ts   # API_ENDPOINTS — константы всех URL-ов
    *.ts           # сервисы по сущностям (entryService, bookService и т.д.)
  types/           # TypeScript-интерфейсы по сущностям
```

### Импорт из services/

Так как `services/` находится вне `app/`, использовать алиас `~~/`:
```ts
import { useEntryApi } from '~~/services/api/entryService';
import type { Post } from '~~/services/types/post.type';
```

### API-слой

`useApi()` из `services/api/base.ts` предоставляет три метода:
- `get<T>(endpoint, options?)` — список с пагинацией, возвращает `ApiResponse<T>` (`{ data, meta }`).
- `getWithoutPagination<T>(endpoint, options?)` — список без пагинации.
- `getOne<T>(endpoint, slug, options)` — одна запись по слагу.

Сервисы-файлы создают composable по паттерну `useXxxApi()` и вызывают методы `useApi()`.

### Маршруты страниц

| URL | Файл |
|-----|------|
| `/` | `pages/index.vue` |
| `/post` | `pages/post/index.vue` |
| `/post/[slug]` | `pages/post/[slug].vue` |
| `/page/[slug]` | `pages/page/[slug].vue` |
| `/books`, `/games` | соответствующие директории |

**Важно:** старый маршрут `/entry` переименован в `/post`. В `nuxt.config.ts` настроен Vite-прокси, который перенаправляет `/entry/*` → `/post/*` для обратной совместимости.

### Компоненты-обёртки

- `CommonContentContainer` — внутренний контейнер страниц с отступами и max-width.
- `CommonSectionWrapper` — секция главной страницы. Пропсы: `title`, `link`, `linkLabel`, `bgGray`, `contentClass`.

### Прокси статики

В dev и prod медиафайлы (`/site/**`) проксируются на `http://static.infomania.ru`. Картинки в контенте приходят через этот прокси.

### Директива v-image-gallery

Клиентская директива (`app/plugins/v-image-gallery.client.ts`). Используется на контейнере с HTML-контентом статьи: при клике на `<img>` внутри открывает модальную галерею. Принимает `{ modal }` из `useOverlay()`.

```vue
<div v-image-gallery="{ modal }" v-html="entry.content" />
```

### Модальные окна

Используется `useOverlay()` из Nuxt UI:
```ts
const overlay = useOverlay();
const modal = overlay.create(ModalsCommon);
modal.open({ imgLinks: [...], startIndex: 0 });
```

## Правила кода

- **Кавычки**: одинарные (`'`)
- **Отступы**: 2 пробела
- **Точка с запятой**: обязательна
- **`no-unused-vars`**: ошибка (TypeScript)
- **`vue/multi-word-component-names`**: отключено
- Имена компонентов могут быть однословными

## Важные замечания

- SEO: `sitemap.xml` генерирует `@nuxtjs/sitemap` (динамические URL — `server/api/__sitemap__/urls.ts`), `robots.txt` — серверный маршрут `server/routes/robots.txt.ts`. Адрес сайта — `NUXT_PUBLIC_SITE_URL` (по умолчанию `https://alt.infomania.ru`). Не добавлять `nitro.devProxy` с ключом `/site`: он матчит по префиксу и перехватывает `/sitemap.xml`.
- `app/layouts/ContentLayout.vue` содержит устаревшую ссылку `/entry` вместо `/post` — можно исправить при случае.
- Внешние скрипты НЕ подключаются глобально: Яндекс.Формы — через `useYandexFormsEmbed()` только на страницах, где в CMS-контенте есть форма; скрипт Госуслуг грузит сам `FeedbackGos.vue`.
- Стили: Tailwind и Nuxt UI импортируются один раз в `main.css`, остальные CSS-файлы подключаются внутри него через `@import`. Не добавлять `@import 'tailwindcss'` в другие файлы и не перечислять их в `css` в `nuxt.config` — весь Tailwind сгенерируется повторно.
- Картинки из CMS: у `File` есть `variants` (WebP-копии 400–1600px, создаёт бэкенд). В `<img>` добавлять `:srcset="imageSrcset(file)"` (`app/utils/image.ts`) и `sizes` по реальной ширине блока. Если есть `@error`-заглушка — снимать `srcset`, иначе браузер продолжит брать картинку из него.
- Списки из API (посты, книги, комиксы, слайды) проходят через `omitListFields()` в `services/api/base.ts`: тяжёлые `content`/`contentText` вырезаются до попадания в payload. Если карточке понадобится `content` — убрать поле из списка исключений.