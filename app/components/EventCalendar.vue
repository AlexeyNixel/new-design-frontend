<script setup lang="ts">
import type { DateValue } from '@internationalized/date';
import type { Event } from '~~/services/types/event.type';
import { CalendarDate } from '@internationalized/date';
import dayjs from 'dayjs';

const config = useRuntimeConfig();
const parseEventTime = useParseEventTime();
const events = ref<Event[]>();
const now = new Date();
const calendarDate = shallowRef(
  new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate()),
);

const eventsByDate = ref<{ [key: string]: Event[] }>({});

const dayEvents = ref<Event[] | null>(null);
const selectedEvent = ref<Event | null>(null);
const navDirection = ref<'forward' | 'back'>('forward');

const view = computed<'calendar' | 'list' | 'detail'>(() => {
  if (selectedEvent.value) return 'detail';
  if (dayEvents.value) return 'list';
  return 'calendar';
});

const headerTitle = computed(() => {
  if (view.value === 'detail' && selectedEvent.value)
    return selectedEvent.value.title;
  if (view.value === 'list' && dayEvents.value?.length)
    return parseEventTime(dayEvents.value[0].eventTime).format('D MMMM');
  return 'Календарь событий';
});

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
      const dateKey = parseEventTime(event.eventTime).format('YYYY-MM-DD');

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

type DayState = 'event' | 'monday' | 'outside' | 'normal';

const dayState = (date: DateValue): DayState => {
  if (isOutsideMonth(date)) return 'outside';
  if (isEvent(date)) return 'event';
  if (isMonday(date)) return 'monday';
  return 'normal';
};

const DAY_CIRCLE_CLASS: Record<DayState, string> = {
  event: 'bg-info/20 text-info cursor-pointer hover:bg-info/30',
  monday: 'bg-warning/20 text-warning',
  outside: 'text-gray-300',
  normal: '',
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

const openDay = (list: Event[]) => {
  navDirection.value = 'forward';
  selectedEvent.value = null;
  dayEvents.value = list;
};

const openEvent = (event: Event) => {
  navDirection.value = 'forward';
  selectedEvent.value = event;
};

const backToList = () => {
  navDirection.value = 'back';
  selectedEvent.value = null;
};

const closeToCalendar = () => {
  navDirection.value = 'back';
  selectedEvent.value = null;
  dayEvents.value = null;
};

const upcomingEvents = computed(() => {
  if (!events.value) return [];
  const now = dayjs();
  return events.value
    .filter(event => parseEventTime(event.eventTime).isAfter(now))
    .sort(
      (a, b) =>
        parseEventTime(a.eventTime).valueOf()
        - parseEventTime(b.eventTime).valueOf(),
    )
    .slice(0, 5);
});

const formatEventDate = (date: string) => {
  return parseEventTime(date).format('DD MMM, HH:mm');
};

onMounted(async () => {
  await fetchEvents(calendarDate.value);
});
</script>

<template>
  <div
    class="bg-white shadow rounded-xl relative overflow-hidden flex flex-col h-full"
  >
    <!-- Единая шапка для календаря и панели событий -->
    <header
      class="flex items-center shrink-0 bg-gradient-to-r from-success to-success/70 px-1 sm:px-2 py-2 sm:py-3 text-white rounded-t-xl"
    >
      <UButton
        v-if="view === 'calendar'"
        variant="ghost"
        icon="i-iconoir-nav-arrow-left"
        class="text-white hover:bg-white/20 shrink-0"
        @click="changeMonth('prev')"
      />
      <UButton
        v-else-if="view === 'detail'"
        variant="ghost"
        icon="i-heroicons-arrow-left-20-solid"
        class="text-white hover:bg-white/20 shrink-0"
        @click="backToList"
      />
      <div
        v-else
        class="w-9 shrink-0"
      />

      <div class="flex items-center gap-2 flex-1 justify-center min-w-0">
        <Icon
          class="text-lg sm:text-xl shrink-0"
          name="i-heroicons-calendar-days"
        />
        <div class="font-bold text-sm sm:text-base truncate">
          {{ headerTitle }}
        </div>
      </div>

      <UButton
        v-if="view === 'calendar'"
        variant="ghost"
        icon="i-iconoir-nav-arrow-right"
        class="text-white hover:bg-white/20 shrink-0"
        @click="changeMonth('next')"
      />
      <UButton
        v-else
        variant="ghost"
        icon="heroicons:x-mark-20-solid"
        class="text-white hover:bg-white/20 shrink-0"
        @click="closeToCalendar"
      />
    </header>

    <!-- Тело: контент сменяется на месте, без наложения поверх календаря -->
    <Transition
      :name="navDirection === 'forward' ? 'nav-forward' : 'nav-back'"
      mode="out-in"
    >
      <!-- Календарь -->
      <div
        v-if="view === 'calendar'"
        key="calendar"
        class="flex-1 min-h-0 flex flex-col"
      >
        <!-- Мобильная версия - список событий -->
        <div class="block sm:hidden p-2.5">
          <div class="space-y-2 max-h-[300px] overflow-y-auto">
            <div
              v-for="event in upcomingEvents"
              :key="event.id"
              class="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors"
              @click="openDay([event])"
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
        <div class="hidden sm:flex sm:flex-col flex-1 min-h-0">
          <div class="px-1 pt-2 lg:flex-1 lg:min-h-0 lg:overflow-y-auto">
            <UCalendar
              v-model="calendarDate"
              :year-controls="false"
              :month-controls="false"
              size="md"
              class="w-full"
              :ui="{
                root: 'w-full',
                heading: 'font-semibold text-sm',
                cell: 'p-0',
              }"
            >
              <template #day="{ day }">
                <!-- День с событиями: бейдж-уведомление в правом верхнем углу, поверх дня -->
                <UChip
                  v-if="dayState(day) === 'event'"
                  :text="String(isEvent(day)?.length)"
                  color="info"
                  position="top-right"
                  :ui="{
                    base: 'h-5 min-w-5 px-1 text-[10px] font-bold ring-2 ring-white',
                  }"
                >
                  <div
                    class="flex items-center justify-center rounded-full w-8 h-8 text-xs font-medium transition-colors"
                    :class="DAY_CIRCLE_CLASS.event"
                    @click.stop="openDay(isEvent(day) ?? [])"
                  >
                    {{ day.day }}
                  </div>
                </UChip>

                <div
                  v-else
                  class="flex items-center justify-center rounded-full w-8 h-8 text-xs font-medium"
                  :class="DAY_CIRCLE_CLASS[dayState(day)]"
                >
                  {{ day.day }}
                </div>
              </template>
            </UCalendar>
          </div>
        </div>
      </div>

      <!-- Список событий дня / детали события -->
      <div
        v-else
        key="events"
        class="overflow-y-auto p-2.5 sm:p-3 max-h-[320px] lg:max-h-none lg:flex-1 lg:min-h-0"
      >
        <EventDetail
          :events="dayEvents ?? []"
          :selected-event="selectedEvent"
          @select="openEvent"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.nav-forward-enter-active,
.nav-forward-leave-active,
.nav-back-enter-active,
.nav-back-leave-active {
  transition:
    transform 0.18s ease,
    opacity 0.18s ease;
}

.nav-forward-enter-from {
  opacity: 0;
  transform: translateX(12px);
}

.nav-forward-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}

.nav-back-enter-from {
  opacity: 0;
  transform: translateX(-12px);
}

.nav-back-leave-to {
  opacity: 0;
  transform: translateX(12px);
}
</style>
