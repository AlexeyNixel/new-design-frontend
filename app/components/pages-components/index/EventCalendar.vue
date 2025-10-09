<script setup lang="ts">
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
    <UCalendar class="w-full" color="primary">
      <template #day="{ day }">
        <UTooltip
          :text="
            getColorByDate(day.toDate('UTC')) === 'warning'
              ? 'Выходной'
              : 'События'
          "
        >
          <UButton
            :variant="!!getColorByDate(day.toDate('UTC')) ? 'soft' : 'link'"
            :color="getColorByDate(day.toDate('UTC'))"
            class="flex items-center justify-center rounded-full h-[34px] w-[34px]"
          >
            {{ day.day }}
          </UButton>
        </UTooltip>
      </template>
    </UCalendar>
    <!--    <div class="w-[60%] text-wrap">-->
    <!--      * последний день месяца — технический день-->
    <!--    </div>-->
  </div>
</template>
