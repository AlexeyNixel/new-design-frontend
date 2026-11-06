<template>
  <div class="bg-neutral-100">
    <!-- Шапка в цвете Пушкинской карты — как у /afisha -->
    <section class="bg-[#0d4954] text-white">
      <div class="mx-auto max-w-[1236px] px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-14 3xl:max-w-[1710px]">
        <UBreadcrumb
          :items="breadcrumbItems"
          :ui="{
            link: 'text-white/70 hover:text-white',
            linkLeadingIcon: 'text-white/70',
            separatorIcon: 'text-white/40',
          }"
          class="mb-8"
        />

        <div class="grid items-end gap-8 lg:grid-cols-[1fr_minmax(0,420px)]">
          <div>
            <h1 class="text-5xl font-bold leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
              Пушкинская карта
            </h1>
            <p class="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              Мероприятия библиотеки, которые можно посетить по Пушкинской карте.
              Выбирайте событие, покупайте билет на кассе по ссылке — и приходите к нам
              на {{ LIBRARY_INFO.address.streetAddress }}.
            </p>
          </div>

          <div class="rounded-2xl bg-white/10 p-5 text-sm leading-relaxed text-white/80 ring-1 ring-white/15 sm:p-6">
            <p class="font-medium text-white">
              Нет Пушкинской карты?
            </p>
            <p class="mt-2">
              Её можно оформить школьникам и студентам от 14 до 22 лет через
              «Госуслуги» и приложение «Госуслуги Культура».
            </p>
          </div>
        </div>
      </div>
    </section>

    <div class="mx-auto max-w-[1236px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10 3xl:max-w-[1710px]">
      <!-- Ближайшие -->
      <section
        v-if="upcoming.length"
        aria-labelledby="pushkin-upcoming"
        class="mb-12 last:mb-0"
      >
        <h2
          id="pushkin-upcoming"
          class="mb-5 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
        >
          Ближайшие
        </h2>
        <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <li
            v-for="event in upcoming"
            :key="event.id"
          >
            <EventPoster :event="event" />
          </li>
        </ul>
      </section>

      <!-- Архив: прошедшие события -->
      <section
        v-if="archive.length"
        aria-labelledby="pushkin-archive"
        class="mb-12 last:mb-0"
      >
        <h2
          id="pushkin-archive"
          class="mb-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
        >
          Архив
        </h2>
        <p class="mb-5 text-sm text-gray-600 sm:text-base">
          Прошедшие мероприятия по Пушкинской карте.
          <template v-if="hiddenArchiveCount">
            Показаны за последние полгода — всего
            {{ hiddenArchiveCount + archive.length }}.
          </template>
        </p>
        <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <li
            v-for="event in archive"
            :key="event.id"
          >
            <EventPoster :event="event" />
          </li>
        </ul>
        <UButton
          v-if="hiddenArchiveCount > 0"
          color="neutral"
          variant="outline"
          class="mt-5"
          :label="`Показать всё (${hiddenArchiveCount + archive.length})`"
          @click="showAllArchive = true"
        />
      </section>

      <!-- Пустых секций нет -->
      <div
        v-if="!upcoming.length && !archive.length"
        class="rounded-2xl bg-white p-10 text-center ring-1 ring-gray-200"
      >
        <p class="text-lg font-bold text-gray-900">
          Событий по Пушкинской карте пока нет
        </p>
        <p class="mt-1 text-gray-600">
          Скоро появятся новые — пока посмотрите всю афишу.
        </p>
        <UButton
          to="/afisha"
          label="Вся афиша"
          class="mt-4"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from '~~/services/types/event.type';
import { useEventApi } from '~~/services/api/eventService';
import { libraryNow } from '~/composables/useEventTime';
import { isPushkinEvent } from '~/utils/eventPushkin';

/** Сколько месяцев прошедших событий видно без кнопки «Показать всё» */
const ARCHIVE_MONTHS = 6;

const eventApi = useEventApi();
const parseEventTime = useParseEventTime();
const toEventSchema = useEventSchema();
const toAbsolute = useAbsoluteUrl();

// Без startDate/endDate: прошедшие тоже нужны — для архива
const { data } = await eventApi.getAllEvents({ limit: 200 });

const isDeleted = (event: Event) => String(event.isDeleted).toLowerCase() === 'true';

const pushkinEvents = computed<Event[]>(() =>
  (data ?? []).filter(event => isPushkinEvent(event) && !isDeleted(event)),
);

// Сравнение по полному времени события, а не по началу дня; libraryNow() — как на часах в библиотеке
const now = libraryNow();

const upcoming = computed<Event[]>(() =>
  pushkinEvents.value
    .filter(event => !parseEventTime(event.eventTime).isBefore(now))
    .sort((a, b) => parseEventTime(a.eventTime).valueOf() - parseEventTime(b.eventTime).valueOf()),
);

const showAllArchive = ref(false);

const archiveCutoff = now.subtract(ARCHIVE_MONTHS, 'month');

const allPast = computed<Event[]>(() =>
  pushkinEvents.value
    .filter(event => parseEventTime(event.eventTime).isBefore(now))
    // Свежие прошедшие — выше
    .sort((a, b) => parseEventTime(b.eventTime).valueOf() - parseEventTime(a.eventTime).valueOf()),
);

const archive = computed<Event[]>(() =>
  showAllArchive.value
    ? allPast.value
    : allPast.value.filter(event => !parseEventTime(event.eventTime).isBefore(archiveCutoff)),
);

const hiddenArchiveCount = computed(() =>
  showAllArchive.value ? 0 : allPast.value.length - archive.value.length,
);

// ——— SEO ———

const breadcrumbItems = [
  { label: 'Главная', icon: 'i-heroicons-home', to: '/' },
  { label: 'Пушкинская карта', to: '/pushkinskaya-karta' },
];
useBreadcrumbSchema(breadcrumbItems);

usePageSeo({
  title: 'Пушкинская карта — мероприятия в Новосибирске',
  description:
    'Афиша Новосибирской областной молодёжной библиотеки по Пушкинской карте: концерты, игры и мастер-классы, которые можно посетить по карте. Красный проспект, 26.',
});

useJsonLd('content', () => {
  const items = upcoming.value
    .map(event => toEventSchema(event))
    .filter(item => !!item);
  if (!items.length) return undefined;

  return {
    '@type': 'ItemList',
    'name': 'Мероприятия по Пушкинской карте — НОМБ',
    'url': toAbsolute('/pushkinskaya-karta'),
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': item,
    })),
  };
});
</script>
