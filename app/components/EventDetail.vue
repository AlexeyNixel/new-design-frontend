<script setup lang="ts">
import type { Event } from '~~/services/types/event.type';
import dayjs from 'dayjs';

const selectedEvent = ref<Event | null>();

const props = defineProps<{
  modelValue: Event[];
}>();

const emits = defineEmits(['update:modelValue']);

const closeWindow = () => {
  emits('update:modelValue', null);
};
</script>

<template>
  <div class="absolute top-0 w-full h-full bg-white">
    <header class="flex items-center justify-between">
      <div class="font-bold text-center mb-2">
        {{ dayjs(modelValue[0]?.eventTime).format('DD.MM.YYYY') }}
      </div>
      <div>
        <UButton @click="closeWindow" variant="link" label="x" />
      </div>
    </header>

    <div v-if="!selectedEvent" class="h-full overflow-y-auto">
      <UButton
        variant="link"
        class="flex items-center mb-5 odd:bg-neutral-200 rounded p-2"
        v-for="item in modelValue"
        @click="selectedEvent = item"
      >
        <div class="text-primary font-bold">
          {{ dayjs(item.eventTime.slice(0, 19)).format('HH:ss') }}
        </div>
        <p class="ml-2">
          {{ item.title }}
        </p>
      </UButton>
    </div>
    <div v-else class="h-full overflow-y-auto">
      <header class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <div class="event-detail-title font-bold text-xl text-gray-900">
            {{ selectedEvent.title }}
          </div>
          <span
            v-if="selectedEvent.age"
            class="age-badge px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded-full"
          >
            {{ selectedEvent.age }}+
          </span>
        </div>

        <!-- Информация о времени и месте -->
        <div class="event-detail-meta space-y-2 text-gray-700">
          <div class="flex items-center gap-2">
            <UIcon
              name="i-heroicons-calendar-20-solid"
              class="w-4 h-4 text-gray-400"
            />
            <span>{{ selectedEvent.eventTime }}</span>
            <UIcon
              name="i-heroicons-clock-20-solid"
              class="w-4 h-4 text-gray-400 ml-3"
            />
            <span>{{ selectedEvent.eventTime }}</span>
          </div>

          <div v-if="selectedEvent.eventPlace" class="flex items-center gap-2">
            <UIcon
              name="i-heroicons-map-pin-20-solid"
              class="w-4 h-4 text-gray-400"
            />
            <span>{{ selectedEvent.eventPlace }}</span>
          </div>

          <div v-if="selectedEvent.phone" class="flex items-center gap-2">
            <UIcon
              name="i-heroicons-phone-20-solid"
              class="w-4 h-4 text-gray-400"
            />
            <a
              :href="`tel:${selectedEvent.phone}`"
              class="text-primary hover:underline"
            >
              {{ selectedEvent.phone }}
            </a>
          </div>
        </div>
      </header>
    </div>
  </div>
</template>

<style scoped></style>
