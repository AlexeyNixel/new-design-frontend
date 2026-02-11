<script setup lang="ts">
import type { Event } from '~~/services/types/event.type';
import dayjs from 'dayjs';
import { IBillboardPlaces } from '~/constants/billboardPlaces';

const selectedEvent = ref<Event | null>();

const props = defineProps<{
  modelValue: Event[];
}>();

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
    class="absolute top-0 h-full w-full bg-white rounded-xl overflow-hidden flex flex-col"
  >
    <!-- Header - фиксированный -->
    <header
      class="flex-shrink-0 flex items-center justify-between bg-gradient-to-r from-success to-success/70 px-4 py-3 text-white rounded-t-xl"
    >
      <div class="flex items-center gap-3">
        <Icon class="text-xl" name="i-heroicons-calendar-days" />
        <h3 class="!m-0">Календарь событий</h3>
      </div>

      <UButton
        color="white"
        variant="link"
        icon="heroicons:x-mark-20-solid"
        @click="closeWindow"
      />
    </header>

    <!-- Контент - скроллящийся -->
    <div class="flex-1 overflow-y-auto p-4">
      <div v-if="!selectedEvent" class="space-y-2">
        <UButton
          variant="link"
          class="flex items-center odd:bg-neutral-100 w-full rounded p-3 hover:bg-neutral-50 transition-colors"
          v-for="item in modelValue"
          @click="selectedEvent = item"
        >
          <div class="text-primary font-bold min-w-[50px]">
            {{ formatTime(item.eventTime) }}
          </div>
          <p class="ml-2 text-left flex-1">
            {{ item.title }}
          </p>
        </UButton>
      </div>

      <div v-else>
        <!--        <div class="">-->
        <!--          <UButton-->
        <!--            variant="ghost"-->
        <!--            icon="i-heroicons-arrow-left-20-solid"-->
        <!--            @click="selectedEvent = null"-->
        <!--            class=""-->
        <!--          >-->
        <!--            Назад-->
        <!--          </UButton>-->
        <!--        </div>-->

        <!-- Детали события -->
        <div class="space-y-4">
          <header>
            <div class="flex items-center justify-between mb-3">
              <div class="font-bold text-xl text-gray-900">
                {{ selectedEvent.title }}
              </div>
              <span
                v-if="selectedEvent.age"
                class="px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded-full text-sm"
              >
                {{ selectedEvent.age }}+
              </span>
            </div>

            <div class="text-gray-700 flex justify-between items-center">
              <div class="flex gap-2 items-center">
                <UIcon
                  name="i-heroicons-clock-20-solid"
                  class="w-4 h-4 text-gray-400"
                />
                <span>{{ formatTime(selectedEvent.eventTime) }}</span>
              </div>

              <div v-if="selectedEvent.place" class="flex items-center gap-2">
                <UIcon
                  name="i-heroicons-map-pin-20-solid"
                  class="w-4 h-4 text-gray-400"
                />
                <span>{{ IBillboardPlaces[selectedEvent.place] }}</span>
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

          <!-- Контент события -->
          <div class="pt-4 border-t border-gray-200">
            <div class="tiptap max-w-none" v-html="selectedEvent.content"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Убираем лишние скроллбары на мобильных устройствах */
.overflow-y-auto {
  -webkit-overflow-scrolling: touch;
}
</style>
