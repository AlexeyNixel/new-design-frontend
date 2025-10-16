<script setup lang="ts">
import { useEventApi } from '~~/services/api/eventService';
import type { Event } from '~~/services/types/event.type';
import { CalendarDate } from '@internationalized/date';
import dayjs from 'dayjs';

const eventApi = useEventApi();
const events = ref<Event[]>();
const eventMap = ref(new Map<string, Event[]>());
const calendarDate = shallowRef(new CalendarDate(2025, 10, 20));

const fetchEvents = async (date: Date | any) => {
  const startDay = dayjs(date).startOf('month').format();
  const endDay = dayjs(date).endOf('month').format();

  eventMap.value.clear();

  const { data } = await eventApi.getAllEvents({
    pageSize: 100,
    fromDate: startDay,
    toDate: endDay,
    orderBy: '-eventDate',
  });

  events.value = data;

  if (Array.isArray(events.value)) {
    events.value.forEach((event) => {
      const date = dayjs(event.eventDate).format('YYYY-MM-DD');

      if (eventMap.value.has(date)) {
        eventMap.value.get(date)!.push(event);
      } else {
        eventMap.value.set(date, [event]);
      }
    });
  }
};

await fetchEvents(new Date());

const isEvent = (date: Date) => {
  const dateString = dayjs(date).format('YYYY-MM-DD');
  return eventMap.value.get(dateString);
};

const isWeekend = (date: Date) => {
  const day = date.getDay();
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

  return undefined;
};

const changeMonth = async (direction: 'prev' | 'next') => {
  if (direction === 'prev') {
    calendarDate.value = calendarDate.value.subtract({ months: 1 });
  } else {
    calendarDate.value = calendarDate.value.add({ months: 1 });
  }

  await fetchEvents(calendarDate.value);
};
</script>

<template>
  <UCalendar
    class="w-full"
    v-model="calendarDate"
    :yearControls="false"
    :monthControls="false"
  >
    <template #day="{ day }">
      <UTooltip>
        <UButton
          :variant="!!getColorByDate(day.toDate('UTC')) ? 'soft' : 'link'"
          :color="getColorByDate(day.toDate('UTC')) || 'neutral'"
          class="flex items-center justify-center rounded-full w-8 h-8 focus:text-white"
        >
          {{ day.day }}
        </UButton>
      </UTooltip>
    </template>
  </UCalendar>
  <UButton
    icon="i-heroicons-arrow-left-16-solid"
    @click="changeMonth('prev')"
  />

  <UButton
    icon="i-heroicons-arrow-right-16-solid"
    @click="changeMonth('next')"
  />
</template>

<style scoped>
div [data-outside-visible-view] {
  button {
    color: #e7e1e1;
    background: none;
  }
}
</style>
