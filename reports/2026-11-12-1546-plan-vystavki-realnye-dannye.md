# План: реальные данные выставок в календаре главной (отдельная сущность)

Дата: 2026-11-12 (переработка после уточнения)

## Важное уточнение

**Выставка в календаре — это не виртуальная выставка-файл.** Виртуальные
выставки (`File.type = EXHIBITION`, `/page/exhibition/<slug>`) — отдельная
сущность и к календарю отношения не имеет. Не трогаем её.

Выставка в календаре — **простое уведомление**: «у нас в библиотеке сейчас можно
прийти посмотреть картины». Это анонс периода, без страницы-iframe, без загрузки
ZIP. Сейчас она на моках.

## Что должно быть у такой выставки

Поля минимальны:

| Поле | Обязательно | Назначение |
|---|---|---|
| `id` | да (uuid) | идентификатор |
| `title` | да | «Выставка картин сибирских художников» |
| `description` | нет | пара строк пояснения, показывается в списке дня |
| `startsAt` | да | первый день показа |
| `endsAt` | да | последний день показа (включительно) |
| `isHidden` | нет | скрыть с сайта, не удаляя |
| `createdAt` | авто | сортировка |

Ссылки и картинки — не нужны: это не карточка, а пометка в календаре.

## Варианты реализации

### Вариант A (рекомендую): отдельная модель `LibraryExhibition`

Новая таблица, свой модуль, свой раздел в админке. Не путается с виртуальными
выставками, поля ровно те, что нужны календарю.

**Бэкенд (`backend`)**

1. `prisma/schema.prisma` — новая модель:
   ```prisma
   model LibraryExhibition {
     id          String   @id @default(uuid())
     title       String   @db.VarChar(300)
     description String?  @db.VarChar(1000)
     /// Первый день показа
     startsAt    DateTime
     /// Последний день показа включительно
     endsAt      DateTime
     isHidden    Boolean  @default(false)
     createdAt   DateTime @default(now())

     @@index([startsAt, endsAt])
     @@map("library_exhibitions")
   }
   ```
   Миграция: `prisma migrate dev --name library_exhibitions`.
2. Новый модуль `src/library-exhibition/` по образцу `src/event/`:
   - `library-exhibition.module.ts`
   - `library-exhibition.service.ts` — CRUD, список с пагинацией и поиском,
     фильтры `status` (`visible` / `hidden`), валидация `endsAt >= startsAt`.
   - `library-exhibition.controller.ts` (аудита — как у `event`):
     ```
     GET    /api/library-exhibition                      — публичный, только не скрытые
     GET    /api/library-exhibition/calendar?from&to     — публичный, периодов пересекается с [from, to]
     GET    /api/library-exhibition/admin                — админка, все со статусом
     GET    /api/library-exhibition/:id                  — одна запись
     POST   /api/library-exhibition                      — создать
     PATCH  /api/library-exhibition/:id                  — изменить
     DELETE /api/library-exhibition/:id                  — мягко (isHidden) или DELETE — решить
     ```
   - DTO `create`/`update` с валидацией дат.
   - Регистрация в `app.module.ts`; секция в админке — новая `library-exhibitions`
     либо существующая `exhibitions` (по решению).
3. Тесты сервиса (в проекте есть `*.spec.ts`): валидация дат, фильтр периода,
   исключение скрытых в публичных ручках.

**Админка (`frontend-admin`)**

1. Новая страница `app/pages/library-exhibition/index.vue` по образцу
   `app/pages/event/index.vue` (таблица/список, поиск, статус, пагинация).
2. Модалка создания/редактирования: название, описание, даты (два
   `UInput type="date"`), переключатель «Показывать на сайте».
3. `services/types/library-exhibition.type.ts`, `services/api/library-exhibition.api.ts`,
   константы в `services/endpoints.ts`.
4. Пункт в `app/constants/sections.ts` (раздел «Афиша» рядом с мероприятиями).
5. В превью-карточке — пометка «в календаре: 1–30 ноября», чтобы было видно,
   что запись попадёт на главную.

**Публичный сайт (`frontend`)**

1. `services/types/libraryExhibition.type.ts` — `id`, `title`, `description`,
   `startsAt`, `endsAt`.
2. `services/api/libraryExhibitionService.ts` — `getCalendarExhibitions({ from, to })`.
3. `app/utils/exhibitionCalendar.ts` — `useExhibitionsCalendar()` дёргает сервис
   вместо мока; ошибка → `[]`. Загрузка один раз при монтировании (как сейчас).
4. Удалить `services/mocks/exhibitions.mock.ts`, поправить `Exhibition` →
   `LibraryExhibition` в `EventCalendar.vue` (или оставить имя `Exhibition`,
   но переориентировать тип).
5. Разметка в календаре почти не меняется, но под «уведомлением» **не нужно
   вести на страницу** — ссылку заменить на обычный элемент (карточка с цветной
   точкой и текстом). Если оставить ссылку, то на отдельную страницу
   `/afisha/vystavki` — решить.

### Вариант B: переиспользовать `Event` с новым флагом

Добавить `Event.isExhibition: Boolean` + `endsAt` и в календаре рендерить их
иначе. Меньше кода, но события и выставки получат разную семантику в одной
таблице: фильтры афиши, счётчики, страница `/afisha` будут вынуждены постоянно
это учитывать. **Не рекомендую**, но если сроки важнее чистоты — рабочий вариант.

### Вариант C: полностью на моках «как есть»

Оставить моки. Не вариант, данные должны быть реальные.

## Объём работ (Вариант A)

| Что | Где | Кто |
|---|---|---|
| Модель Prisma + миграция | `backend/prisma` | бэкенд |
| Модуль/сервис/контроллер/DTO | `backend/src/library-exhibition` | бэкенд |
| Публичный эндпоинт периода | там же | бэкенд |
| Тесты сервиса | там же | бэкенд |
| Страница списка + модалка | `frontend-admin/app/pages`, `components/modals` | фронт-админ |
| Тип, API-клиент, пункт меню | `frontend-admin/services`, `constants` | фронт-админ |
| Сервис календаря, удаление мока | `frontend/services`, `frontend/app/utils` | фронт |
| Замена ссылки на карточку | `frontend/app/components/EventCalendar.vue` | фронт |

## Вопросы к тебе

1. **Вариант A** (отдельная модель) — согласен? Рекомендую его.
2. Нужна ли выставке **отдельная страница на сайте** (например, `/afisha/vystavki`
   со списком), или это только пометка в календаре без перехода?
3. Что показывать в календаре: только название или ещё **краткое описание**?
4. Где в админке разместить: **новый раздел «Выставки в календаре»** в группе
   «Афиша» или отдельный пункт?
5. Удаление — **скрытие** (как у других сущностей) или настоящее удаление?
6. Нужно ли выставлять **время работы** выставки (часы в день) — например,
   «пн–сб 10:00–20:00», или достаточно периода дат?
