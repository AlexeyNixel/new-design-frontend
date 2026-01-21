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

onMounted(async () => {
  await fetchEvents(new Date());
});
</script>

<template>
  <div class="relative">
    <UCalendar
      class="w-full"
      v-model="calendarDate"
      :yearControls="false"
      :monthControls="false"
    >
      <template #day="{ day }">
        <div v-if="isEvent(day)">
          <UChip :text="isEvent(day)?.length" size="xl">
            <UButton
              :color="getColorByDate(day)"
              variant="soft"
              class="flex items-center justify-center rounded-full w-8 h-8 focus:text-white cursor-pointer"
              @click="currentEvent = isEvent(day)"
            >
              {{ day.day }}
            </UButton>
          </UChip>
        </div>

        <!--        <UPopover-->
        <!--          mode="hover"-->
        <!--          :content="{ side: 'bottom' }"-->
        <!--          v-if="isEvent(day)"-->
        <!--        >-->
        <!--          <UChip :text="isEvent(day)?.length" size="xl">-->
        <!--            <UButton-->
        <!--              :color="getColorByDate(day)"-->
        <!--              variant="soft"-->
        <!--              class="flex items-center justify-center rounded-full w-8 h-8 focus:text-white"-->
        <!--              @click="currentEvent = isEvent(day)"-->
        <!--            >-->
        <!--              {{ day.day }}-->
        <!--            </UButton>-->
        <!--          </UChip>-->

        <!--          <template v-if="isEvent(day)" #content>-->
        <!--            <div class="p-1 flex flex-col gap-2">-->
        <!--              <div-->
        <!--                class="text-sm text-neutral-400 flex items-center justify-center"-->
        <!--              >-->
        <!--                {{ dayjs(day).format('dd, MMM DD, YYYY') }}-->
        <!--              </div>-->
        <!--              <div-->
        <!--                v-for="event in isEvent(day)"-->
        <!--                :key="event.id"-->
        <!--                class="flex gap-2 text-sm"-->
        <!--              >-->
        <!--                <div class="text-primary font-bold">-->
        <!--                  {{ dayjs(event.eventTime.slice(0, 19)).format('HH:ss') }}-->
        <!--                </div>-->
        <!--                <div>-->
        <!--                  {{ event.title }}-->
        <!--                </div>-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </template>-->
        <!--        </UPopover>-->

        <UButton
          :color="getColorByDate(day)"
          class="flex items-center justify-center rounded-full w-8 h-8 focus:text-white"
          variant="soft"
          v-else
          >{{ day.day }}</UButton
        >
      </template>
    </UCalendar>
    <div class="flex gap-8 mt-2 justify-end">
      <UButton
        icon="i-heroicons-arrow-left-16-solid"
        @click="changeMonth('prev')"
      />

      <UButton
        icon="i-heroicons-arrow-right-16-solid"
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
