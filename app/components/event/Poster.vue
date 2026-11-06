<template>
  <NuxtLink
    :to="`/afisha/${event.id}`"
    class="poster group"
    :class="EVENT_CATEGORIES[eventCategory(event)].poster"
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

    <p class="mt-6 line-clamp-5 sm:mt-8 flex-1 text-lg font-bold leading-snug group-hover:underline group-hover:underline-offset-4">
      {{ event.title }}
    </p>

    <div class="mt-5 flex items-end justify-between gap-3 text-sm">
      <span class="opacity-80">{{ eventPlaceName(event) }}</span>
      <span
        v-if="Number(event.age)"
        class="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-current text-xs font-bold"
        :aria-label="`Возраст ${Number(event.age)}+`"
      >
        {{ Number(event.age) }}+
      </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Event } from '~~/services/types/event.type';
import { eventDayBadge } from '~/composables/useEventTime';

/**
 * Плакат события в сетке афиши: дата, время, название, место и возраст.
 * Стили лежат в классе `poster` из афиши (app/pages/afisha/index.vue).
 */
defineProps<{ event: Event }>();

const parseEventTime = useParseEventTime();

const formatTime = (date: Date | string) => parseEventTime(date).format('HH:mm');

/** «октября», а не «октябрь»: родительный падеж dayjs даёт только рядом с числом */
const monthGenitive = (date: Date | string) =>
  parseEventTime(date).format('D MMMM').split(' ')[1];
</script>
