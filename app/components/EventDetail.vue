<script setup lang="ts">
import type { Event } from '~~/services/types/event.type';
import dayjs from 'dayjs';
import { IBillboardPlaces } from '~/constants/billboardPlaces';

const selectedEvent = ref<Event | null>(null);

const props = defineProps<{
  modelValue: Event[];
}>();

watch(() => props.modelValue, () => {
  selectedEvent.value = null;
});

const emits = defineEmits(['update:modelValue']);

const closeWindow = () => {
  emits('update:modelValue', null);
};

const formatTime = (date: Date | string) => {
  return dayjs(date.toString().slice(0, 19)).format('HH:mm');
};
</script>

<template>
  <div
    class="absolute inset-0 bg-white rounded-xl overflow-hidden flex flex-col z-10"
  >
    <!-- Header -->
    <header
      class="flex-shrink-0 flex items-center bg-gradient-to-r from-success to-success/70 px-2 py-2 sm:py-3 text-white rounded-t-xl"
    >
      <UButton
        v-if="selectedEvent"
        variant="ghost"
        icon="i-heroicons-arrow-left-20-solid"
        class="text-white hover:bg-white/20 shrink-0"
        @click="selectedEvent = null"
      />
      <div
        v-else
        class="w-9 shrink-0"
      />

      <div class="flex items-center gap-2 flex-1 justify-center min-w-0">
        <Icon
          class="text-xl shrink-0"
          name="i-heroicons-calendar-days"
        />
        <h3 class="m-0 font-bold text-sm sm:text-base truncate">
          Календарь событий
        </h3>
      </div>

      <UButton
        variant="ghost"
        icon="heroicons:x-mark-20-solid"
        class="text-white hover:bg-white/20 shrink-0"
        @click="closeWindow"
      />
    </header>

    <!-- Список событий на день -->
    <div
      v-if="!selectedEvent"
      class="flex-1 overflow-y-auto p-3"
    >
      <div class="space-y-1">
        <button
          v-for="item in modelValue"
          :key="item.id"
          class="flex items-center w-full rounded-lg px-3 py-2.5 text-left hover:bg-neutral-100 transition-colors odd:bg-neutral-50"
          @click="selectedEvent = item"
        >
          <span class="text-primary font-bold text-sm min-w-[48px]">
            {{ formatTime(item.eventTime) }}
          </span>
          <span class="ml-2 text-sm text-gray-800 flex-1">
            {{ item.title }}
          </span>
        </button>
      </div>
    </div>

    <!-- Детали выбранного события -->
    <div
      v-else
      class="flex-1 overflow-y-auto p-4"
    >
      <div class="space-y-4">
        <div class="flex items-start justify-between gap-2">
          <div class="font-bold text-lg text-gray-900 leading-tight">
            {{ selectedEvent.title }}
          </div>
          <span
            v-if="selectedEvent.age"
            class="flex-shrink-0 px-2.5 py-0.5 bg-blue-100 text-blue-800 font-semibold rounded-full text-sm"
          >
            {{ selectedEvent.age }}+
          </span>
        </div>

        <div class="flex flex-wrap gap-3 text-sm text-gray-600">
          <div class="flex items-center gap-1.5">
            <UIcon
              name="i-heroicons-clock-20-solid"
              class="w-4 h-4 text-gray-400 shrink-0"
            />
            <span>{{ formatTime(selectedEvent.eventTime) }}</span>
          </div>

          <div
            v-if="selectedEvent.place"
            class="flex items-center gap-1.5"
          >
            <UIcon
              name="i-heroicons-map-pin-20-solid"
              class="w-4 h-4 text-gray-400 shrink-0"
            />
            <span>{{ IBillboardPlaces[selectedEvent.place] }}</span>
          </div>

          <div
            v-if="selectedEvent.phone"
            class="flex items-center gap-1.5"
          >
            <UIcon
              name="i-heroicons-phone-20-solid"
              class="w-4 h-4 text-gray-400 shrink-0"
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
          class="pt-3 border-t border-gray-200"
        >
          <div
            class="tiptap max-w-none text-sm"
            v-html="selectedEvent.content"
          />
        </div>
      </div>
    </div>
  </div>
</template>
