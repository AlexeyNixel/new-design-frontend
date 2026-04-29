<script setup lang="ts">
import type { Event } from '~~/services/types/event.type';
import { CalendarDate } from '@internationalized/date';
import dayjs from 'dayjs';

const currentEvent = ref();
const config = useRuntimeConfig();
const events = ref<Event[]>();
const now = new Date();
const calendarDate = shallowRef(
  new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate())
);

const eventsByDate = ref<{ [key: string]: Event[] }>({});

const fetchEvents = async (date: Date | any) => {
  const startDay = dayjs(date).startOf('month').format();
  const endDay = dayjs(date).endOf('month').format();

  eventsByDate.value = {};

  const { data } = await $fetch(config.public.apiBaseUrl + '/api/event', {
    params: {
      startDate: startDay,
      endDate: endDay,
      limit: 100,
    },
  });

  events.value = data;

  if (Array.isArray(events.value)) {
    events.value.forEach((event: Event) => {
      const date = dayjs(event.eventTime).format('YYYY-MM-DD');

      if (eventsByDate.value[date]) {
        eventsByDate.value[date].push(event);
      } else {
        eventsByDate.value[date] = [event];
      }
    });
  }
};

const isEvent = (date: Date) => {
  const dateString = dayjs(date).format('YYYY-MM-DD');
  return eventsByDate.value[dateString];
};

const isWeekend = (date: Date) => {
  const day = dayjs(date).get('day');
  return day === 1;
};

const getColorByDate = (date: Date) => {
  const event = isEvent(date);

  if (isWeekend(date)) {
    return 'warning';
  }

  if (event) {
    return 'info';
  }

  return 'undefined';
};

const changeMonth = async (direction: 'prev' | 'next') => {
  if (direction === 'prev') {
    calendarDate.value = calendarDate.value.subtract({ months: 1 });
  } else {
    calendarDate.value = calendarDate.value.add({ months: 1 });
  }

  await fetchEvents(calendarDate.value);
};

const upcomingEvents = computed(() => {
  if (!events.value) return [];
  const now = dayjs();
  return events.value
    .filter((event) => dayjs(event.eventTime).isAfter(now))
    .slice(0, 5);
});

const formatEventDate = (date: string) => {
  return dayjs(date).format('DD MMM, HH:mm');
};

onMounted(async () => {
  await fetchEvents(new Date());
});
</script>

<template>
  <div class="bg-white shadow rounded-xl relative">
    <!-- Заголовок -->
    <header
      class="flex items-center gap-3 bg-gradient-to-r from-success to-success/70 px-3 sm:px-4 py-2 sm:py-3 text-white rounded-t-xl"
    >
      <Icon class="text-lg sm:text-xl" name="i-heroicons-calendar-days" />
      <div class="font-bold text-base sm:text-lg">Календарь событий</div>
    </header>

    <!-- Календарь с адаптивными размерами -->
    <div class="p-2 sm:p-3 md:p-4">
      <!-- Мобильная версия - список событий -->
      <div class="block sm:hidden">
        <div class="space-y-2 max-h-[400px] overflow-y-auto">
          <div
            v-for="event in upcomingEvents"
            :key="event.id"
            class="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100"
            @click="currentEvent = event"
          >
            <div class="font-semibold text-sm">
              {{ formatEventDate(event.eventTime) }}
            </div>
            <div class="text-sm">{{ event.title }}</div>
          </div>
          <div
            v-if="!upcomingEvents.length"
            class="text-center text-gray-500 py-8"
          >
            Нет событий
          </div>
        </div>
      </div>

      <!-- Desktop версия - календарь -->
      <div class="hidden sm:block">
        <UCalendar
          v-model="calendarDate"
          :yearControls="false"
          :monthControls="false"
          :ui="{
            heading: 'font-bold text-sm sm:text-base',
            grid: 'gap-1',
            cell: 'p-0.5 sm:p-1',
          }"
        >
          <template #day="{ day }">
            <div v-if="isEvent(day)">
              <UChip
                :text="String(isEvent(day)?.length)"
                size="sm"
                :ui="{ rounded: 'rounded-full' }"
              >
                <UButton
                  :color="getColorByDate(day)"
                  variant="soft"
                  class="flex items-center justify-center rounded-full w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base focus:text-white cursor-pointer"
                  @click="currentEvent = isEvent(day)"
                >
                  {{ day.day }}
                </UButton>
              </UChip>
            </div>

            <UButton
              v-else
              :color="getColorByDate(day)"
              class="flex items-center justify-center rounded-full w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base focus:text-white"
              variant="soft"
            >
              {{ day.day }}
            </UButton>
          </template>
        </UCalendar>
      </div>
    </div>

    <!-- Кнопки навигации - теперь не перекрывают -->
    <div
      class="absolute top-3 left-0 right-0 flex justify-between px-2 sm:px-3"
    >
      <UButton
        variant="link"
        icon="i-iconoir-nav-arrow-left"
        class="text-white hover:text-gray-200 !p-1 sm:!p-2"
        @click="changeMonth('prev')"
      />
      <UButton
        variant="link"
        icon="i-iconoir-nav-arrow-right"
        class="text-white hover:text-gray-200 !p-1 sm:!p-2"
        @click="changeMonth('next')"
      />
    </div>

    <EventDetail v-model="currentEvent" v-if="currentEvent" class="z-100" />
  </div>
</template>

<style scoped>
div [data-outside-visible-view] {
  button {
    color: #e7e1e1;
    background: none;
  }
}
</style>
