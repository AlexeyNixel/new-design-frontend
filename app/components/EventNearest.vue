<script setup lang="ts">
import { useEventApi } from '~~/services/api/eventService';
import {
  eventDayBadge,
  libraryNow,
  toEventApiDate,
} from '~/composables/useEventTime';

// Ближайшее событие афиши — внизу статьи, чтобы дочитавший мог сразу
// перейти к тому, куда можно прийти. Нет событий в ближайшие дни — блока нет.

/** Насколько вперёд искать: дальше двух недель «ближайшим» уже не назвать */
const DAYS_AHEAD = 14;

const eventApi = useEventApi();
const parseEventTime = useParseEventTime();

const today = libraryNow().startOf('day');
const { data } = await eventApi.getAllEvents({
  startDate: toEventApiDate(today),
  endDate: toEventApiDate(today.add(DAYS_AHEAD, 'day').endOf('day')),
  limit: 100,
});

const nearest = computed(() =>
  [...(data ?? [])]
    // isDeleted приходит то булевым, то строкой 'False'
    .filter(event => String(event.isDeleted).toLowerCase() !== 'true')
    .filter(event => parseEventTime(event.eventTime).isAfter(libraryNow()))
    .sort(
      (a, b) =>
        parseEventTime(a.eventTime).valueOf()
        - parseEventTime(b.eventTime).valueOf(),
    )[0],
);

const when = computed(() => {
  if (!nearest.value) return '';
  const time = parseEventTime(nearest.value.eventTime);
  const day = eventDayBadge(nearest.value.eventTime) ?? time.format('D MMMM, dddd');
  return `${day} в ${time.format('HH:mm')}`;
});
</script>

<template>
  <section
    v-if="nearest"
    class="my-10 flex flex-col gap-5 rounded-2xl bg-[#0d4954] p-6 text-white sm:flex-row sm:items-center sm:p-8"
    aria-labelledby="nearest-event-title"
  >
    <NuxtLink
      :to="`/afisha/${nearest.id}`"
      class="group flex-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
    >
      <p class="text-sm font-medium text-[#F2B632]">
        Ближайшее событие в библиотеке · {{ when }}
      </p>
      <h2
        id="nearest-event-title"
        class="mt-2 text-xl font-bold leading-snug group-hover:underline group-hover:underline-offset-4 sm:text-2xl"
      >
        {{ nearest.title }}
      </h2>
      <p
        v-if="eventPlaceName(nearest)"
        class="mt-2 text-sm text-white/70"
      >
        {{ eventPlaceName(nearest) }}
      </p>
    </NuxtLink>

    <UButton
      to="/afisha"
      label="Вся афиша"
      trailing-icon="i-heroicons-arrow-right"
      color="neutral"
      variant="solid"
      class="self-start bg-white text-[#0d4954] hover:bg-white/90 sm:self-center"
    />
  </section>
</template>
