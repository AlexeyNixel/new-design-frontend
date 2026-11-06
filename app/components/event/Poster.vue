<template>
  <div
    class="poster group"
    :class="EVENT_CATEGORIES[eventCategory(event)].poster"
  >
    <NuxtLink
      :to="`/afisha/${event.id}`"
      class="poster-link flex flex-1 flex-col focus-visible:outline-none"
    >
      <div class="flex items-start gap-3">
        <span
          class="text-7xl font-bold leading-[0.8] tracking-tighter tabular-nums"
          :class="{ 'text-[#157486]': eventCategory(event) === 'talk' }"
        >
          {{ parseEventTime(event.eventTime).format('D') }}
        </span>
        <span class="pt-0.5 text-sm font-medium leading-tight">
          {{ monthGenitive(event.eventTime) }}<br>
          <span
            v-if="eventDayBadge(event.eventTime)"
            class="mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wide"
            :class="EVENT_CATEGORIES[eventCategory(event)].badge"
          >
            {{ eventDayBadge(event.eventTime) }}
          </span>
          <span
            v-else
            class="opacity-75"
          >{{ parseEventTime(event.eventTime).format('dddd') }}</span>
        </span>
        <span class="ml-auto text-lg font-bold tabular-nums">
          {{ formatTime(event.eventTime) }}
        </span>
      </div>

      <p class="mt-6 flex-1 text-lg font-bold leading-snug group-hover:underline group-hover:underline-offset-4">
        {{ event.title }}
      </p>

      <!-- Описание: четыре строки, остальное раскрывается ссылкой -->
      <p
        v-if="description"
        :id="descriptionId"
        class="mt-3 whitespace-pre-line text-sm leading-snug opacity-90"
        :class="{ 'line-clamp-4': !isOpen }"
      >
        {{ description }}
      </p>
    </NuxtLink>

    <button
      v-if="description && descriptionLong"
      type="button"
      class="poster-action mt-1 self-start text-sm font-semibold underline decoration-1 underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
      :aria-expanded="isOpen"
      :aria-controls="descriptionId"
      @click="isOpen = !isOpen"
    >
      {{ isOpen ? 'Свернуть' : 'Читать полностью' }}
    </button>

    <!-- Место и возраст, под ними — кнопка покупки билета -->
    <div class="mt-4 flex items-end justify-between gap-3 text-sm">
      <span class="opacity-80">{{ eventPlaceName(event) }}</span>
      <span
        v-if="Number(event.age)"
        class="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-current text-xs font-bold"
        :aria-label="`Возраст ${Number(event.age)}+`"
      >
        {{ Number(event.age) }}+
      </span>
    </div>

    <a
      v-if="ticketUrl"
      :href="ticketUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="poster-buy mt-3 flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold no-underline transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
      :aria-label="`Купить билет: ${event.title}`"
    >
      <UIcon
        name="i-heroicons-ticket"
        class="size-4 shrink-0"
      />
      Купить билет
    </a>
  </div>
</template>

<script setup lang="ts">
import type { Event } from '~~/services/types/event.type';
import { eventDayBadge } from '~/composables/useEventTime';

/**
 * Плакат события в сетке афиши: дата, время, название, описание, место, возраст и билет.
 * Стили лежат в классе `poster` из афиши (app/pages/afisha/index.vue).
 */
const props = defineProps<{
  event: Event;
}>();

const parseEventTime = useParseEventTime();

const formatTime = (date: Date | string) => parseEventTime(date).format('HH:mm');

/** «октября», а не «октябрь»: родительный падеж dayjs даёт только рядом с числом */
const monthGenitive = (date: Date | string) =>
  parseEventTime(date).format('D MMMM').split(' ')[1];

/** Текст описания без добавленного бэкендом блока «На это событие можно купить билет …» */
const description = computed(() =>
  stripHtml(props.event.content).replace(/На это событие можно купить билет[^.]*\./g, '').trim());

/**
 * Показывать кнопку, только если текст не влезает в четыре строки.
 * 70 символов на строку в этой колонке; описание короче — кнопка не нужна.
 */
const descriptionLong = computed(() => description.value.length > 70 * 4);

const descriptionId = computed(() => `event-desc-${props.event.id}`);

const isOpen = ref(false);

/** Ссылка на кассу: поле из админки, для старых событий — найденная в тексте */
const ticketUrl = computed(() => eventTicketInfo(props.event).url);
</script>
