<template>
  <div class="bg-neutral-100">
    <!-- Шапка в цвете Пушкинской карты — как у /afisha -->
    <section class="bg-[#0d4954] text-white">
      <div
        class="mx-auto max-w-[1236px] px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-14 3xl:max-w-[1710px]"
      >
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
            <h1
              class="text-5xl font-bold leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl"
            >
              Пушкинская карта
            </h1>
            <p
              class="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
            >
              Мероприятия библиотеки, которые можно посетить по Пушкинской
              карте. Выбирайте событие, покупайте билет на кассе по ссылке — и
              приходите к нам на {{ LIBRARY_INFO.address.streetAddress }}.
            </p>
          </div>

          <div
            class="rounded-2xl bg-white/10 p-5 text-sm leading-relaxed text-white/80 ring-1 ring-white/15 sm:p-6"
          >
            <p class="font-medium text-white">Нет Пушкинской карты?</p>
            <p class="mt-2">
              Её можно оформить школьникам и студентам от 14 до 22 лет через
              «Госуслуги» и приложение «Госуслуги Культура».
            </p>
          </div>
        </div>
      </div>
    </section>

    <div
      class="mx-auto max-w-[1236px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10 3xl:max-w-[1710px]"
    >
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
        <ul
          class="plakat grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <li v-for="event in upcoming" :key="event.id">
            <EventPoster :event="event" />
          </li>
        </ul>
      </section>

      <section
        aria-labelledby="pushkin-rules"
        class="mb-12 last:mb-0 rounded-2xl bg-white p-5 ring-1 ring-gray-200 sm:p-8"
      >
        <NuxtLink
          v-if="pageIntro"
          :to="pushkinPostUrl"
          class="mb-6 block text-base leading-relaxed text-gray-700 hover:text-[#157486]"
        >
          {{ pageIntro }}
        </NuxtLink>

        <!-- Картинка слева, текст справа; на узких экранах — друг под другом.
             v-image-gallery — клик открывает картинку на весь экран -->
        <div
          v-image-gallery="{ modal }"
          class="grid gap-6 md:grid-cols-[minmax(0,340px)_minmax(0,1fr)] md:items-start lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]"
        >
          <figure>
            <img
              :src="pageImage"
              alt="Пушкинская карта"
              width="1024"
              height="727"
              loading="lazy"
              class="h-auto w-full rounded-xl"
            />
          </figure>

          <div>
            <h2
              id="pushkin-rules"
              class="mb-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
            >
              Особенности оказания платных услуг при оплате «Пушкинской картой»
            </h2>

            <div class="tiptap max-w-none">
              <ul class="mb-4 list-disc space-y-2 pl-5 text-gray-700">
                <li v-for="(item, index) in pageRules" :key="index">
                  {{ item }}
                </li>
              </ul>

              <p class="mb-4 italic leading-relaxed text-gray-600">
                {{ pageNote }}
              </p>

              <p class="leading-relaxed">
                <a
                  :href="pageLink.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-semibold text-[#157486] underline underline-offset-4 hover:text-[#0d4954]"
                  >{{ pageLink.label }}</a
                >
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Архив: прошедшие события — раскрывающийся список, как на старой странице -->
      <section
        v-if="archive.length"
        aria-labelledby="pushkin-archive"
        class="mb-12 last:mb-0"
      >
        <details class="group rounded-2xl bg-white ring-1 ring-gray-200">
          <summary
            class="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-5 py-4 text-xl font-bold text-gray-900 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-[#0d4954] sm:text-2xl [&::-webkit-details-marker]:hidden"
          >
            <span id="pushkin-archive">
              Архив мероприятий
              <span class="ml-1 text-base font-normal text-gray-500">{{
                allPast.length
              }}</span>
            </span>
            <UIcon
              name="i-heroicons-chevron-down"
              class="size-5 shrink-0 text-gray-400 transition-transform group-open:rotate-180 motion-reduce:transition-none"
            />
          </summary>
          <div class="border-t border-gray-100 px-5 py-5">
            <EventArchiveList :events="archive" />
            <UButton
              v-if="hiddenArchiveCount > 0"
              color="neutral"
              variant="outline"
              class="mt-4"
              :label="`Показать всё (${allPast.length})`"
              @click="showAllArchive = true"
            />
          </div>
        </details>
      </section>

      <!-- Текст со старой страницы «Пушкинская карта» -->

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
        <UButton to="/afisha" label="Вся афиша" class="mt-4" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ModalsCommon } from '#components';
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

// Модальное окно просмотра картинок (директива v-image-gallery)
const overlay = useOverlay();
const modal = overlay.create(ModalsCommon);

// Без startDate/endDate: прошедшие тоже нужны — для архива
const { data } = await eventApi.getAllEvents({ limit: 200 });

const isDeleted = (event: Event) =>
  String(event.isDeleted).toLowerCase() === 'true';

const pushkinEvents = computed<Event[]>(() =>
  (data ?? []).filter((event) => isPushkinEvent(event) && !isDeleted(event))
);

// Сравнение по полному времени события, а не по началу дня; libraryNow() — как на часах в библиотеке
const now = libraryNow();

const upcoming = computed<Event[]>(() =>
  pushkinEvents.value
    .filter((event) => !parseEventTime(event.eventTime).isBefore(now))
    .sort(
      (a, b) =>
        parseEventTime(a.eventTime).valueOf() -
        parseEventTime(b.eventTime).valueOf()
    )
);

const showAllArchive = ref(false);

const archiveCutoff = now.subtract(ARCHIVE_MONTHS, 'month');

const allPast = computed<Event[]>(() =>
  pushkinEvents.value
    .filter((event) => parseEventTime(event.eventTime).isBefore(now))
    // Свежие прошедшие — выше
    .sort(
      (a, b) =>
        parseEventTime(b.eventTime).valueOf() -
        parseEventTime(a.eventTime).valueOf()
    )
);

const archive = computed<Event[]>(() =>
  showAllArchive.value
    ? allPast.value
    : allPast.value.filter(
        (event) => !parseEventTime(event.eventTime).isBefore(archiveCutoff)
      )
);

const hiddenArchiveCount = computed(() =>
  showAllArchive.value ? 0 : allPast.value.length - archive.value.length
);

// ——— Материалы со старой страницы ———
// Текст и картинка перенесены из поста /post/…pushkinskaya-karta… без изменений.
const PUSHKIN_POST_SLUG =
  'molodezhnaya-na-krasnom-prisoedinyaetsya-k-proektu-pushkinskaya-karta-12-06-19-01-23';
const pushkinPostUrl = `/post/${PUSHKIN_POST_SLUG}`;

const pageIntro =
  'Новосибирская областная молодежная библиотека предлагает новосибирцам мероприятия в рамках федеральной программы «Пушкинская карта» (количество мест ограничено):';
const pageImage =
  '/site/image/2025/11/06/ab98394c-6245-4864-b2ef-922ddf43c74e.jpeg';
const pageRules = [
  'оплатить услуги по Пушкинской карте можно на сайте билетного оператора «Кассир.Ру»;',
  'услуга оказывается гражданам Российской Федерации в возрасте от 14 до 22 лет, оформившим Пушкинскую карту;',
  'к оплате принимается виртуальная Пушкинская карта;',
  'для получения услуги необходимо предъявить билет на мероприятие и документ удостоверяющий личность владельца Пушкинской карты;',
  'услуга оказывается только владельцу Пушкинской карты лично; передача билета третьим лицам в целях его использования не допускается;',
  'возврат средств за непосещенное мероприятие производится по заявлению владельца Пушкинской карты.',
];
const pageNote =
  'Библиотека принимает к оплате средства целевой субсидии на услуги учреждений культуры по посещению мероприятий на основании постановления Правительства РФ от 08.09.2021 №1521 «О социальной поддержке молодежи в возрасте от 14 до 22 лет для повышения доступности организаций культуры».';
const pageLink = {
  href: 'https://mk.nso.ru/page/8180',
  label: 'Федеральная программа «Пушкинская карта» в Новосибирской области',
};

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
    .map((event) => toEventSchema(event))
    .filter((item) => !!item);
  if (!items.length) return undefined;

  return {
    '@type': 'ItemList',
    name: 'Мероприятия по Пушкинской карте — НОМБ',
    url: toAbsolute('/pushkinskaya-karta'),
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: item,
    })),
  };
});
</script>

<style scoped>
/* Плакаты на этой странице — всегда плотная заливка цвета типа события */
.plakat :deep(.poster) {
  opacity: 1;
  filter: none;
  mix-blend-mode: normal;
}
</style>
