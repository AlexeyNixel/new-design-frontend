<script setup lang="ts">
interface Event {
  eventDate: string;
  title?: string;
}

const { data: events } = await $fetch('http://api.infomania.ru/api/affiche', {
  params: {
    orderBy: '-eventDate',
    pageSize: 30,
  },
});

const currentDate = ref();

const eventMap = new Map<string, Event>();

if (events && Array.isArray(events)) {
  events.forEach((event: Event) => {
    if (event.eventDate) {
      const date = new Date(event.eventDate);
      const dateString = date.toISOString().split('T')[0];
      eventMap.set(dateString, event);
    }
  });
}

function getEventForDate(date: Date): Event | null {
  const dateString = date.toISOString().split('T')[0];
  return eventMap.get(dateString) || null;
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 1;
}

function getColorByDate(date: Date): string | undefined {
  const event = getEventForDate(date);

  if (event) {
    return 'info'; // Голубой для дат с событиями
  }

  if (isWeekend(date)) {
    return 'warning'; // Оранжевый для выходных
  }

  return undefined; // Без цвета для обычных дней
}

function getTooltipText(date: Date): string {
  const event = getEventForDate(date);

  if (event && event.title) {
    return event.title; // Тайтл события
  }

  if (isWeekend(date)) {
    return 'Выходной'; // Для выходных без событий
  }

  if (event) {
    return 'Событие'; // Для событий без тайтла
  }

  return ''; // Для обычных дней без событий
}

function shouldShowTooltip(date: Date): boolean {
  const event = getEventForDate(date);
  return event !== null || isWeekend(date);
}
</script>

<template>
  <UCalendar v-model="currentDate" class="w-full" color="primary">
    <template #day="{ day }">
      <UTooltip
        v-if="shouldShowTooltip(day.toDate('UTC'))"
        :text="getTooltipText(day.toDate('UTC'))"
        :popper="{ placement: 'top' }"
      >
        <UButton
          :variant="!!getColorByDate(day.toDate('UTC')) ? 'soft' : 'link'"
          :color="getColorByDate(day.toDate('UTC'))"
          class="flex items-center justify-center rounded-full h-[34px] w-[34px]"
        >
          {{ day.day }}
        </UButton>
      </UTooltip>

      <UButton
        v-else
        variant="link"
        class="flex items-center justify-center rounded-full h-[34px] w-[34px]"
      >
        {{ day.day }}
      </UButton>
    </template>
  </UCalendar>
</template>
