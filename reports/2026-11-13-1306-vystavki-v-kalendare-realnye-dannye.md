# Выставки в календаре: реальные данные (вариант A)

Дата: 2026-11-13

Реализована сущность `LibraryExhibition` — анонс **физической** выставки в
библиотеке для календаря на главной. Виртуальные выставки-файлы
(`File.type = EXHIBITION`, `/page/exhibition/<slug>`) не тронуты.

## Что сделано

### Бэкенд (`../backend`)

- `prisma/schema.prisma` — модель `LibraryExhibition`:
  `id`, `title(VarChar 300)`, `description?(VarChar 1000)`, `startsAt`, `endsAt`,
  `isHidden`, `createdAt`; индекс `[startsAt, endsAt]`; таблица `library_exhibitions`.
- `prisma/migrations/20261113120000_library_exhibitions/migration.sql` — ручная
  миграция (создание таблицы). Запускать `prisma migrate deploy` при выкатке.
- `src/library-exhibition/` — module, controller, service, DTO (create/update через
  `PartialType`), `utils/exhibition-period.utils.ts` + spec.
- `src/app.module.ts` — модуль зарегистрирован; `src/auth/sections.ts` —
  раздел `'library-exhibitions': 'Выставки в календаре'`.

Эндпоинты (`@Controller('library-exhibition')`, глобальный префикс `api`):

| Метод | Путь | Доступ | Ответ |
|---|---|---|---|
| GET | `/api/library-exhibition/calendar?from&to` | публичный | `{ data: LibraryExhibition[] }`, лимит 200, только видимые, пересечение периода |
| GET | `/api/library-exhibition` | публичный | пагинированный список видимых |
| GET | `/api/library-exhibition/admin?status=visible\|hidden` | JWT + `@Section('library-exhibitions')` | пагинированный список, все статусы |
| GET | `/api/library-exhibition/:id` | публичный | `{ status: 200, data }`, на отсутствующий id — 404 (`NotFoundException`) |
| POST | `/api/library-exhibition` | JWT, аудит `LibraryExhibition` | созданная запись |
| PATCH | `/api/library-exhibition/:id` | JWT, аудит `LibraryExhibition` | изменённая запись |

Маршруты `calendar` и `admin` объявлены до `:id`. Удаления нет — только `isHidden`.
Параметры `from`/`to` у `calendar` рассчитаны на даты `YYYY-MM-DD` (для даты без
времени расширяются до целых суток UTC); сайт сейчас зовёт эндпоинт без параметров.

**Конвенция дат.** Даты периода хранятся «наивно» в UTC — как время событий:
сайт читает их через `useParseEventTime` (первые 19 символов ISO как настенные
часы). Поэтому `2026-11-13` трактуется как `00:00:00Z` (начало) и
`23:59:59.999Z` (окончание), а не как сутки по Новосибирску — иначе дата-only
съезжала бы на день назад при выводе.

### Админка (`../frontend-admin`)

- `services/types/library-exhibition.type.ts` — `LibraryExhibition`,
  `LibraryExhibitionQuery`, `LibraryExhibitionPayload`.
- `services/api/library-exhibition.api.ts` — `useLibraryExhibitionApi()`
  (`getAll` → `/admin`, `getOne`, `create`, `update`).
- `app/pages/library-exhibition/index.vue` — раздел «Выставки в календаре»:
  таблица (период, название + описание, статус, действия), поиск, пагинация,
  вкладки «Все / На сайте / Скрытые» со счётчиками, deep-link `?editId=`.
- `app/components/Modals/AdminLibraryExhibition.vue` — создание и редактирование
  в одной модалке: название (обяз., 300), описание (1000), две даты
  (`UPopover` + `UCalendar`), проверка «окончание не раньше начала».
- `services/endpoints.ts`, `app/constants/sections.ts` (пункт в «Мероприятия» и
  в шаблон доступа), `app/utils/auditLog.ts` (подпись и ссылка).

### Публичный сайт (`frontend`)

- `services/types/libraryExhibition.type.ts` — тип `LibraryExhibition`.
- `services/api/libraryExhibitionService.ts` — `getCalendarExhibitions()`.
- `services/api/endpoints.ts` — `libraryExhibitionsCalendar`.
- `app/utils/exhibitionCalendar.ts` — `useExhibitionsCalendar()` вместо мока
  (ошибка API → пустой список, календарь работает и без выставок);
  `exhibitionsOnDay()` без изменений.
- `app/components/EventCalendarExhibitions.vue` — свёрнутая строка «Выставки»
  со счётчиком; по нажатию раскрывается список: название + описание. Повторяет
  поведение в мобильной ленте и в списке дня на десктопе.
- `app/components/EventCalendar.vue` — выставки грузятся один раз при setup
  (`await useExhibitionsCalendar()`), оба блока заменены компонентом.
- Удалены `services/mocks/exhibitions.mock.ts` и старый
  `services/types/exhibition.type.ts`.

## Проверки

| Что | Результат |
|---|---|
| `npx prisma generate` (backend) | OK, клиент собран |
| `npx tsc --noEmit` (backend) | чисто |
| `npx jest src/library-exhibition` (backend) | 9/9 passed |
| `npx eslint` по новым/изменённым (backend) | чисто (после `--fix` — prettier-переносы) |
| `npx eslint` по 6 изменённым файлам (frontend) | чисто |
| `npx eslint` по 7 файлам (frontend-admin) | чисто |

Вживую в браузере не проверялось: dev-сервер в этой песочнице не поднимается
(`spawn EPERM` при vite pre-transform), а удалённый API без деплоя эндпоинт ещё
не отдаёт. Публичный календарь до выкатки бэкенда просто покажет «выставок нет».

## Что осталось сделать при выкатке

1. Применить миграцию: `npx prisma migrate deploy` в backend (Dokploy).
2. Задеплоить backend, затем frontend и admin (автодеплой Dokploy по push в master).
3. Завести хотя бы одну выставку в админке → проверить кружок в сетке месяца и
   раскрытие блока «Выставки» в списке дня (десктоп и мобильная лента).
4. Выдать сотрудникам доступ к разделу `library-exhibitions` (галочка в «Пользователях»).

## Известные ограничения

- `?editId=` после deep-link остаётся в URL — поведение всех модалок админки.
- Валидация DTO не бросает исключения на лишние поля (в проекте
  `ValidationPipe` не настроен глобально) — проверки выполняются в сервисе.
- Смешение конвенций `endsAt`: админка сохраняет полночь последнего дня, а
  API-запрос с датой `YYYY-MM-DD` — конец суток. Отображению и пересечению
  периодов это не мешает (день берётся из ISO-префикса), но серверный фильтр
  «прошедшие» по инстантам сравнивал бы их по-разному. Такого фильтра нет.
