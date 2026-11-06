<template>
  <!-- Без данных не рисуем: иначе при 404 шаблон падает и мешает показать страницу ошибки -->
  <div
    v-if="event"
    class="bg-neutral-100"
  >
    <div class="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-10">
      <UBreadcrumb
        :items="breadcrumbItems"
        class="mb-6"
      />

      <article>
        <!-- Шапка-плакат в цвете типа события, как на странице афиши -->
        <header
          class="rounded-3xl p-6 sm:p-10"
          :class="[EVENT_CATEGORIES[category].poster, { 'grayscale-[0.6]': isPast }]"
        >
          <div class="flex flex-wrap items-start gap-x-4 gap-y-3">
            <span
              class="text-8xl font-bold leading-[0.8] tracking-tighter tabular-nums sm:text-9xl"
              :class="{ 'text-[#157486]': category === 'talk' }"
            >
              {{ start.format('D') }}
            </span>
            <span class="pt-1 text-lg font-medium leading-tight sm:text-xl">
              {{ month }} {{ start.format('YYYY') }}<br>
              <span class="opacity-75">{{ start.format('dddd') }}, {{ start.format('HH:mm') }}</span>
            </span>
            <span
              v-if="Number(event.age)"
              class="ml-auto flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-current text-sm font-bold"
              :aria-label="`Возраст ${Number(event.age)}+`"
            >
              {{ Number(event.age) }}+
            </span>
          </div>

          <p
            v-if="isPast"
            class="mt-6 inline-block rounded-full bg-black/15 px-3 py-1 text-sm font-medium"
          >
            Мероприятие прошло
          </p>

          <h1 class="mt-8 text-3xl font-bold leading-tight sm:text-4xl">
            {{ event.title }}
          </h1>

          <div class="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm sm:text-base">
            <span
              v-if="placeName"
              class="inline-flex items-center gap-1.5"
            >
              <UIcon
                name="i-heroicons-map-pin-20-solid"
                class="size-5 shrink-0 opacity-80"
              />
              {{ placeName }}, {{ LIBRARY_INFO.address.streetAddress }}
            </span>
            <a
              v-if="event.phone"
              :href="`tel:${event.phone}`"
              class="inline-flex items-center gap-1.5 underline-offset-4 hover:underline"
            >
              <UIcon
                name="i-heroicons-phone-20-solid"
                class="size-5 shrink-0 opacity-80"
              />
              {{ event.phone }}
            </a>
          </div>

          <!-- Билет: ссылка из админки (или найденная в тексте), плашка Пушкинской карты -->          <div
            v-if="ticket.url || ticket.pushkin || showFree"
            class="mt-6 flex flex-wrap items-center gap-3"
          >
            <a
              v-if="ticket.url"
              :href="ticket.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 rounded-full bg-current px-5 py-2.5 text-sm font-bold no-underline ring-1 ring-current/20 transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            >
              <UIcon
                name="i-heroicons-ticket-20-solid"
                class="size-5 shrink-0"
              />
              Купить билет
            </a>
            <span
              v-if="ticket.pushkin"
              class="inline-flex items-center gap-2 rounded-full bg-black/10 px-4 py-2 text-sm font-medium"
            >
              <UIcon
                name="i-heroicons-credit-card-20-solid"
                class="size-5 shrink-0 opacity-80"
              />
              Можно по Пушкинской карте
            </span>
            <span
              v-if="showFree"
              class="inline-flex items-center gap-2 rounded-full bg-black/10 px-4 py-2 text-sm font-medium"
            >
              <UIcon
                name="i-heroicons-gift-20-solid"
                class="size-5 shrink-0 opacity-80"
              />
              Вход свободный
            </span>
          </div>
        </header>

        <div
          v-if="event.content"
          class="tiptap mt-6 max-w-none rounded-3xl bg-white p-6 ring-1 ring-gray-200 sm:p-10"
          v-html="fitTables(event.content)"
        />

        <footer class="mt-6 flex flex-wrap items-center justify-between gap-4">
          <!-- Прошедшим событием делиться незачем -->
          <CommonShareButtons
            v-if="!isPast"
            :title="`${event.title} — ${start.format('D MMMM, HH:mm')}`"
          />
          <UButton
            to="/afisha"
            icon="i-heroicons-arrow-left"
            label="Вся афиша"
            variant="ghost"
            color="primary"
          />
        </footer>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEventApi } from '~~/services/api/eventService';
import { libraryNow } from '~/composables/useEventTime';

const route = useRoute();
const eventApi = useEventApi();
const parseEventTime = useParseEventTime();
const toEventSchema = useEventSchema();

const { data: event } = await eventApi.getOneEvent(route.params.id as string);

const start = parseEventTime(event.eventTime);
// «октября», а не «октябрь»: родительный падеж dayjs даёт только рядом с числом
const month = start.format('D MMMM').split(' ')[1];
const category = eventCategory(event);
const placeName = eventPlaceName(event);
const isPast = start.isBefore(libraryNow().startOf('day'));

/** Билет: поля из админки важнее парсинга текста; бесплатный вход — только из текста */
const ticket = eventTicketInfo(event);
const showFree = ticket.free && !ticket.url;

const breadcrumbItems = [
  { label: 'Главная', icon: 'i-heroicons-home', to: '/' },
  { label: 'Афиша', icon: 'i-heroicons-calendar-days', to: '/afisha' },
  { label: event.title, to: `/afisha/${event.id}` },
];
useBreadcrumbSchema(breadcrumbItems);

const text = stripHtml(event.content);
usePageSeo({
  title: `${event.title} — ${start.format('D MMMM')}`,
  description: truncateText(
    `${start.format('D MMMM, HH:mm')}${placeName ? `, ${placeName}` : ''}. ${text}`,
  ),
  type: 'article',
});

// Прошедшие события оставляем доступными по ссылке, но разметку Event не выводим
useJsonLd('content', () => (isPast ? undefined : toEventSchema(event)));
</script>
