<script setup lang="ts">
import { CalendarDate } from '@internationalized/date';

const { data: events } = await $fetch('http://api.infomania.ru/api/affiche', {
  params: {
    orderBy: '-eventDate',
    pageSize: 30,
  },
});

const eventDates = new Set();

if (events && Array.isArray(events)) {
  events.forEach((event) => {
    if (event.eventDate) {
      const date = new Date(event.eventDate);
      const dateString = date.toISOString().split('T')[0];
      eventDates.add(dateString);
    }
  });
}
function hasEvent(date: Date) {
  const dateString = date.toISOString().split('T')[0];
  return eventDates.has(dateString);
}

function getColorByDate(date: Date) {
  if (hasEvent(date)) {
    const isWeekend = date.getDay() % 6 === 0;

    if (isWeekend) {
      return 'warning';
    }

    return 'info';
  }

  return undefined; // Без цвета для дат без событий
}
</script>

<template>
  <div class="flex">
    <UCalendar class="w-4/5" color="primary">
      <template #day="{ day }">
        <UChip
          :show="!!getColorByDate(day.toDate('UTC'))"
          :color="getColorByDate(day.toDate('UTC'))"
          size="2xs"
        >
          <UTooltip
            :text="
              getColorByDate(day.toDate('UTC')) === 'warning'
                ? 'Выходной'
                : 'События'
            "
          >
            <UButton variant="link" color="neutral">
              {{ day.day }}
            </UButton>
          </UTooltip>
        </UChip>
      </template>
    </UCalendar>
    <div class="w-[60%] text-wrap">
      * последний день месяца — технический день
    </div>
  </div>
</template>
