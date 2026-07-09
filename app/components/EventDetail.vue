<script setup lang="ts">
import type { Event } from '~~/services/types/event.type';
import { IBillboardPlaces } from '~/constants/billboardPlaces';

defineProps<{
  events: Event[];
  selectedEvent: Event | null;
}>();

const emits = defineEmits<{
  select: [event: Event];
}>();

const parseEventTime = useParseEventTime();

const formatTime = (date: Date | string) => {
  return parseEventTime(date).format('HH:mm');
};
</script>

<template>
  <!-- Список событий на день -->
  <div
    v-if="!selectedEvent"
    class="space-y-1.5"
  >
    <button
      v-for="item in events"
      :key="item.id"
      class="flex items-center gap-2.5 w-full rounded-lg px-3 py-2.5 text-left bg-gray-50 hover:bg-info/10 transition-colors cursor-pointer"
      @click="emits('select', item)"
    >
      <span class="shrink-0 text-xs font-bold text-info bg-info/10 rounded-md px-2 py-1 min-w-[52px] text-center">
        {{ formatTime(item.eventTime) }}
      </span>
      <span class="text-sm text-gray-800 flex-1 truncate">
        {{ item.title }}
      </span>
      <UIcon
        name="i-heroicons-chevron-right-20-solid"
        class="w-4 h-4 text-gray-300 shrink-0"
      />
    </button>
  </div>

  <!-- Детали выбранного события -->
  <div
    v-else
    class="space-y-4"
  >
    <div class="flex items-start justify-between gap-2">
      <div class="font-bold text-lg text-gray-900 leading-tight">
        {{ selectedEvent.title }}
      </div>
      <span
        v-if="selectedEvent.age"
        class="flex-shrink-0 px-2.5 py-0.5 bg-info/10 text-info font-semibold rounded-full text-sm"
      >
        {{ selectedEvent.age }}+
      </span>
    </div>

    <div class="flex flex-wrap gap-2 text-sm text-gray-600">
      <div class="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2.5 py-1.5">
        <UIcon
          name="i-heroicons-clock-20-solid"
          class="w-4 h-4 text-info shrink-0"
        />
        <span>{{ formatTime(selectedEvent.eventTime) }}</span>
      </div>

      <div
        v-if="selectedEvent.place"
        class="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2.5 py-1.5"
      >
        <UIcon
          name="i-heroicons-map-pin-20-solid"
          class="w-4 h-4 text-info shrink-0"
        />
        <span>{{ IBillboardPlaces[selectedEvent.place] }}</span>
      </div>

      <div
        v-if="selectedEvent.phone"
        class="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2.5 py-1.5"
      >
        <UIcon
          name="i-heroicons-phone-20-solid"
          class="w-4 h-4 text-info shrink-0"
        />
        <a
          :href="`tel:${selectedEvent.phone}`"
          class="text-primary hover:underline"
        >
          {{ selectedEvent.phone }}
        </a>
      </div>
    </div>

    <div
      v-if="selectedEvent.content"
      class="pt-3 border-t border-gray-100"
    >
      <div
        class="tiptap max-w-none text-sm"
        v-html="selectedEvent.content"
      />
    </div>
  </div>
</template>
