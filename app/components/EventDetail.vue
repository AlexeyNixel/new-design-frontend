<script setup lang="ts">
import type { Event } from '~~/services/types/event.type';
import type { EventCategory } from '~/utils/eventCategory';
import { eventDayBadge } from '~/composables/useEventTime';

const props = defineProps<{
  events: Event[];
  selectedEvent: Event | null;
  /** Место события в листаемом списке — точки под плакатом */
  position?: { index: number; total: number };
}>();

const emits = defineEmits<{
  select: [event: Event];
}>();

const parseEventTime = useParseEventTime();

const formatTime = (date: Date | string) => {
  return parseEventTime(date).format('HH:mm');
};

/** Цвет полоски в списке — как у плаката типа; у встреч плакат белый, поэтому полоска бирюзовая */
const LIST_ACCENT: Record<EventCategory, string> = {
  master: 'bg-[#F2B632]',
  music: 'bg-[#7B3F8C]',
  game: 'bg-[#157486]',
  talk: 'bg-primary-800/30',
};

const category = computed(() =>
  props.selectedEvent ? eventCategory(props.selectedEvent) : 'talk'
);

// Белый плакат встреч в календаре сливается с белой карточкой —
// здесь он светло-бирюзовый (в афише остаётся белым)
const posterClass = computed(() =>
  category.value === 'talk'
    ? 'bg-[#eef5f6] text-[#0d2a30]'
    : EVENT_CATEGORIES[category.value].poster
);
const circleClass = computed(() =>
  category.value === 'talk'
    ? 'bg-primary-50 opacity-10'
    : 'bg-current opacity-[0.07]'
);

const ticket = computed(() =>
  eventTicket({ content: props.selectedEvent?.content ?? '' })
);

/** «Сегодня, 15:00» или «Пт, 24 октября, 16:00» */
const when = computed(() => {
  if (!props.selectedEvent) return '';
  const time = parseEventTime(props.selectedEvent.eventTime);
  const day =
    eventDayBadge(props.selectedEvent.eventTime) ?? time.format('dd, D MMMM');
  return `${day.charAt(0).toUpperCase()}${day.slice(1)}, ${time.format('HH:mm')}`;
});
</script>

<template>
  <!-- Список событий на день -->
  <div v-if="!selectedEvent" class="space-y-2">
    <!-- Название — целиком, в несколько строк; слева полоска цвета типа события -->
    <button
      v-for="item in events"
      :key="item.id"
      type="button"
      class="group flex items-stretch gap-3 w-full rounded-xl bg-white p-2.5 pr-2 text-left ring-1 ring-gray-200/80 transition hover:bg-[#f4f9fa] hover:ring-primary-800/25 cursor-pointer"
      @click="emits('select', item)"
    >
      <span
        class="w-1 shrink-0 rounded-full"
        :class="LIST_ACCENT[eventCategory(item)]"
        aria-hidden="true"
      />
      <span class="min-w-0 flex-1">
        <span class="flex items-center gap-1.5 text-xs">
          <span class="font-bold tabular-nums text-primary-800">{{
            formatTime(item.eventTime)
          }}</span>
          <span class="text-gray-300" aria-hidden="true">·</span>
          <span class="text-gray-500 truncate">{{
            EVENT_CATEGORIES[eventCategory(item)].name
          }}</span>
          <span
            v-if="Number(item.age)"
            class="ml-auto shrink-0 rounded-md bg-gray-100 px-1.5 text-[10px] font-semibold leading-4 text-gray-500"
            >{{ item.age }}+</span
          >
        </span>
        <span
          class="mt-1 block text-sm font-semibold leading-snug text-gray-900 break-words"
        >
          {{ item.title }}
        </span>
        <span
          v-if="eventPlaceName(item)"
          class="mt-1 flex items-start gap-1 text-xs leading-snug text-gray-500"
        >
          <UIcon name="i-heroicons-map-pin" class="mt-px size-3.5 shrink-0" />
          {{ eventPlaceName(item) }}
        </span>
      </span>
      <UIcon
        name="i-heroicons-chevron-right-20-solid"
        class="self-center size-4 shrink-0 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-primary-800"
      />
    </button>
  </div>

  <!-- Детали выбранного события: плакат (цвет — по типу, как в /afisha) и описание -->
  <article v-else>
    <!-- Плакат — отдельная карточка с полями, а не заливка во всю ширину:
         иначе бирюзовый плакат сливается с фоном главной -->
    <div
      class="relative isolate overflow-hidden m-2.5 rounded-xl shadow-sm flex flex-col gap-2 p-4"
      :class="posterClass"
    >
      <!-- Объём: лёгкий градиент и круги, как у баннера уведомлений -->
      <span
        v-if="category !== 'talk'"
        class="absolute inset-0 -z-10 bg-gradient-to-br from-white/15 via-transparent to-black/20"
        aria-hidden="true"
      />
      <span
        class="absolute -top-10 -right-10 -z-10 size-32 rounded-full"
        :class="circleClass"
        aria-hidden="true"
      />
      <span
        class="absolute -bottom-8 right-12 -z-10 size-20 rounded-full"
        :class="circleClass"
        aria-hidden="true"
      />

      <div class="flex flex-wrap gap-1.5">
        <span class="tag" :class="EVENT_CATEGORIES[category].badge">{{
          when
        }}</span>
        <span class="tag bg-current/15">{{
          EVENT_CATEGORIES[category].name
        }}</span>
        <span v-if="Number(selectedEvent.age)" class="tag bg-current/15"
          >{{ selectedEvent.age }}+</span
        >
      </div>

      <h3 class="text-lg sm:text-xl font-extrabold leading-tight">
        {{ selectedEvent.title }}
      </h3>

      <!-- Место, телефон и стоимость — одинаковыми строками с иконками -->
      <ul class="space-y-1 text-xs">
        <li v-if="eventPlaceName(selectedEvent)" class="info-row">
          <UIcon name="i-heroicons-map-pin" class="info-icon" />
          {{ eventPlaceName(selectedEvent) }}
        </li>
        <li v-if="selectedEvent.phone" class="info-row">
          <UIcon name="i-heroicons-phone" class="info-icon" />
          <a
            :href="`tel:${selectedEvent.phone}`"
            class="hover:underline underline-offset-2"
            >{{ selectedEvent.phone }}</a
          >
        </li>
        <li v-if="eventPriceLabel(ticket)" class="info-row">
          <UIcon name="i-heroicons-ticket" class="info-icon" />
          {{ eventPriceLabel(ticket) }}
        </li>
        <li v-if="ticket.pushkin" class="info-row">
          <UIcon name="i-heroicons-credit-card" class="info-icon" />
          {{
            ticket.price || ticket.url
              ? 'Можно по Пушкинской карте'
              : 'Билет по Пушкинской карте'
          }}
        </li>
      </ul>

      <div
        v-if="position && position.total > 1"
        class="mt-1 flex justify-center gap-1.5"
        aria-hidden="true"
      >
        <span
          v-for="dot in position.total"
          :key="dot"
          class="size-1.5 rounded-full bg-current transition-opacity"
          :class="dot - 1 === position.index ? 'opacity-100' : 'opacity-30'"
        />
      </div>
    </div>

    <div v-if="selectedEvent.content" class="px-3.5 pt-1 pb-3">
      <div
        class="tiptap max-w-none text-sm text-start"
        v-html="fitTables(selectedEvent.content)"
      />
    </div>
  </article>
</template>

<style scoped>
.tag {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  padding: 0.125rem 0.5rem;
  font-size: 0.6875rem;
  font-weight: 700;
  line-height: 1.25rem;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 0.375rem;
  opacity: 0.9;
}

.info-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}
</style>
