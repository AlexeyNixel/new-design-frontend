<script setup lang="ts">
import type { DateValue } from '@internationalized/date';
import type { Event } from '~~/services/types/event.type';
import { CalendarDate } from '@internationalized/date';
import dayjs from 'dayjs';

const currentEvent = ref();
const config = useRuntimeConfig();
const events = ref<Event[]>();
const now = new Date();
const calendarDate = shallowRef(
  new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate()),
);

const eventsByDate = ref<{ [key: string]: Event[] }>({});

const fetchEvents = async (date: CalendarDate) => {
  const startDay = dayjs(date.toString()).startOf('month').format();
  const endDay = dayjs(date.toString()).endOf('month').format();

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
      const dateKey = dayjs(event.eventTime).format('YYYY-MM-DD');

      if (eventsByDate.value[dateKey]) {
        eventsByDate.value[dateKey].push(event);
      }
      else {
        eventsByDate.value[dateKey] = [event];
      }
    });
  }
};

const isEvent = (date: DateValue) => {
  const dateString = dayjs(date.toString()).format('YYYY-MM-DD');
  return eventsByDate.value[dateString];
};

const isMonday = (date: DateValue) => {
  return dayjs(date.toString()).get('day') === 1;
};

const isOutsideMonth = (date: DateValue) => {
  return date.month !== calendarDate.value.month;
};

const changeMonth = async (direction: 'prev' | 'next') => {
  if (direction === 'prev') {
    calendarDate.value = calendarDate.value.subtract({ months: 1 });
  }
  else {
    calendarDate.value = calendarDate.value.add({ months: 1 });
  }

  await fetchEvents(calendarDate.value);
};

const upcomingEvents = computed(() => {
  if (!events.value) return [];
  const now = dayjs();
  return events.value
    .filter(event => dayjs(event.eventTime).isAfter(now))
    .slice(0, 5);
});

const formatEventDate = (date: string) => {
  return dayjs(date).format('DD MMM, HH:mm');
};

onMounted(async () => {
  await fetchEvents(calendarDate.value);
});
</script>

<template>
  <div class="bg-white shadow rounded-xl relative overflow-hidden">
    <!-- Заголовок с навигацией -->
    <header
      class="flex items-center bg-gradient-to-r from-success to-success/70 px-1 sm:px-2 py-2 sm:py-3 text-white rounded-t-xl"
    >
      <UButton
        variant="ghost"
        icon="i-iconoir-nav-arrow-left"
        class="text-white hover:bg-white/20 shrink-0"
        @click="changeMonth('prev')"
      />
      <div class="flex items-center gap-2 flex-1 justify-center min-w-0">
        <Icon
          class="text-lg sm:text-xl shrink-0"
          name="i-heroicons-calendar-days"
        />
        <div class="font-bold text-sm sm:text-base truncate">
          Календарь событий
        </div>
      </div>
      <UButton
        variant="ghost"
        icon="i-iconoir-nav-arrow-right"
        class="text-white hover:bg-white/20 shrink-0"
        @click="changeMonth('next')"
      />
    </header>

    <!-- Тело -->
    <div class="p-2 sm:p-3">
      <!-- Мобильная версия - список событий -->
      <div class="block sm:hidden">
        <div class="space-y-2 max-h-[300px] overflow-y-auto">
          <div
            v-for="event in upcomingEvents"
            :key="event.id"
            class="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors"
            @click="currentEvent = event"
          >
            <div class="font-semibold text-sm text-primary">
              {{ formatEventDate(event.eventTime) }}
            </div>
            <div class="text-sm text-gray-700">
              {{ event.title }}
            </div>
          </div>
          <div
            v-if="!upcomingEvents.length"
            class="text-center text-gray-500 py-6 text-sm"
          >
            Нет событий
          </div>
        </div>
      </div>

      <!-- Desktop версия - сетка календаря -->
      <div class="hidden sm:block">
        <UCalendar
          v-model="calendarDate"
          :year-controls="false"
          :month-controls="false"
          size="sm"
          :ui="{
            heading: 'font-semibold text-sm',
            cell: 'p-0',
          }"
        >
          <template #day="{ day }">
            <!-- День с событиями -->
            <UChip
              v-if="isEvent(day) && !isOutsideMonth(day)"
              :text="String(isEvent(day)?.length)"
              size="xs"
              color="info"
            >
              <div
                class="flex items-center justify-center rounded-full w-7 h-7 text-xs font-medium bg-info/20 text-info cursor-pointer"
                @click.stop="currentEvent = isEvent(day)"
              >
                {{ day.day }}
              </div>
            </UChip>

            <!-- Понедельник -->
            <div
              v-else-if="isMonday(day) && !isOutsideMonth(day)"
              class="flex items-center justify-center rounded-full w-7 h-7 text-xs font-medium bg-warning/20 text-warning"
            >
              {{ day.day }}
            </div>

            <!-- День вне текущего месяца -->
            <div
              v-else-if="isOutsideMonth(day)"
              class="flex items-center justify-center rounded-full w-7 h-7 text-xs font-medium text-gray-300"
            >
              {{ day.day }}
            </div>

            <!-- Обычный день -->
            <div
              v-else
              class="flex items-center justify-center rounded-full w-7 h-7 text-xs font-medium"
            >
              {{ day.day }}
            </div>
          </template>
        </UCalendar>
      </div>
    </div>

    <EventDetail
      v-if="currentEvent"
      v-model="currentEvent"
      class="z-100"
    />
  </div>
</template>
