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
/** Событие открыто из мобильной ленты дней (минуя список дня) */
const openedFromStrip = ref(false);
/** Выбранный в шапке календаря день недели (0 — воскресенье): все его события за месяц */
const weekdayFilter = ref<number | null>(null);

const view = computed<'calendar' | 'list' | 'detail'>(() => {
  if (selectedEvent.value) return 'detail';
  if (dayEvents.value || weekdayFilter.value !== null) return 'list';
  return 'calendar';
});

// Сокращения, которые отдаёт UCalendar при weekday-format="short" (локаль ru)
const WEEKDAY_KEYS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
const WEEKDAY_PLURAL = [
  'Воскресенья',
  'Понедельники',
  'Вторники',
  'Среды',
  'Четверги',
  'Пятницы',
  'Субботы',
];
const WEEKDAY_TITLE = [
  'по воскресеньям',
  'по понедельникам',
  'по вторникам',
  'по средам',
  'по четвергам',
  'по пятницам',
  'по субботам',
];

const weekdayIndex = (label: string) =>
  WEEKDAY_KEYS.indexOf(label.toLowerCase().replace('.', '').trim());

const headerTitle = computed(() => {
  if (view.value === 'detail' && selectedEvent.value)
    return selectedEvent.value.title;
  if (view.value === 'list' && weekdayFilter.value !== null) {
    const month = dayjs(calendarDate.value.toString()).format('MMMM');
    return `${WEEKDAY_PLURAL[weekdayFilter.value]}, ${month}`;
  }
  if (view.value === 'list' && dayEvents.value?.length)
    return parseEventTime(dayEvents.value[0]!.eventTime).format('D MMMM');
  return 'Календарь событий';
});

const fetchEvents = async (date: CalendarDate) => {
  const startDay = dayjs(date.toString()).startOf('month').format();
  const endDay = dayjs(date.toString()).endOf('month').format();

  eventsByDate.value = {};

  const { data } = await $fetch<{ data: Event[] }>(config.public.apiBaseUrl + '/api/event', {
    params: {
      startDate: startDay,
      endDate: endDay,
      limit: 100,
    },
  });

  // API отдаёт события от поздних к ранним — во всех списках показываем по возрастанию времени
  events.value = Array.isArray(data)
    ? [...data].sort(
        (a, b) =>
          parseEventTime(a.eventTime).valueOf()
          - parseEventTime(b.eventTime).valueOf(),
      )
    : data;

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
  normal: 'text-gray-700',
};

const changeMonth = async (direction: 'prev' | 'next') => {
  if (direction === 'prev') {
    calendarDate.value = calendarDate.value.subtract({ months: 1 });
  }
  else {
    calendarDate.value = calendarDate.value.add({ months: 1 });
  }

  loading.value = true;
  await fetchEvents(calendarDate.value);
  loading.value = false;
  selectDefaultDay();
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
  if (openedFromStrip.value) {
    closeToCalendar();
    return;
  }
  navDirection.value = 'back';
  selectedEvent.value = null;
};

const closeToCalendar = () => {
  openedFromStrip.value = false;
  weekdayFilter.value = null;
  navDirection.value = 'back';
  selectedEvent.value = null;
  dayEvents.value = null;
};

const openWeekday = (label: string) => {
  const index = weekdayIndex(label);
  if (index < 0) return;
  navDirection.value = 'forward';
  selectedEvent.value = null;
  dayEvents.value = null;
  weekdayFilter.value = index;
};

/** События выбранного дня недели, сгруппированные по датам (по возрастанию) */
const weekdayGroups = computed(() => {
  if (weekdayFilter.value === null) return [];
  return Object.keys(eventsByDate.value)
    .filter(key => dayjs(key).day() === weekdayFilter.value)
    .sort()
    .map(key => ({
      key,
      label: dayjs(key).format('D MMMM'),
      events: [...eventsByDate.value[key]!].sort(
        (a, b) =>
          parseEventTime(a.eventTime).valueOf()
          - parseEventTime(b.eventTime).valueOf(),
      ),
    }));
});

const weekdayCount = (label: string) => {
  const index = weekdayIndex(label);
  return Object.entries(eventsByDate.value)
    .filter(([key]) => dayjs(key).day() === index)
    .reduce((sum, [, list]) => sum + list.length, 0);
};

// ——— Мобильная лента дней ———

const loading = ref(true);
const stripRef = ref<HTMLElement | null>(null);
const todayKey = dayjs().format('YYYY-MM-DD');
const selectedDay = ref(todayKey);

const monthStart = computed(() =>
  dayjs(calendarDate.value.toString()).startOf('month'),
);

const monthLabel = computed(() => monthStart.value.format('MMMM YYYY'));

const monthDays = computed(() =>
  Array.from({ length: monthStart.value.daysInMonth() }, (_, index) => {
    const day = monthStart.value.add(index, 'day');
    const key = day.format('YYYY-MM-DD');
    return {
      key,
      date: day.date(),
      weekday: WEEKDAY_KEYS[day.day()],
      label: day.format('D MMMM, dddd'),
      isMonday: day.day() === 1,
      count: eventsByDate.value[key]?.length ?? 0,
    };
  }),
);

const sortByTime = (list: Event[]) =>
  [...list].sort(
    (a, b) =>
      parseEventTime(a.eventTime).valueOf()
      - parseEventTime(b.eventTime).valueOf(),
  );

const selectedDayEvents = computed(() =>
  sortByTime(eventsByDate.value[selectedDay.value] ?? []),
);

const selectedDayLabel = computed(() => {
  const day = dayjs(selectedDay.value);
  const prefix = selectedDay.value === todayKey ? 'Сегодня, ' : '';
  return prefix + day.format('D MMMM, dddd');
});

const isSelectedMonday = computed(() => dayjs(selectedDay.value).day() === 1);

/** Ближайший следующий день месяца с событиями */
const nextEventDay = computed(() =>
  monthDays.value.find(day => day.key > selectedDay.value && day.count)?.key,
);

const formatDayShort = (key: string) => dayjs(key).format('D MMMM');

// Прокручиваем ленту так, чтобы выбранный день был по центру (без прокрутки страницы)
const scrollToSelected = async (smooth = true) => {
  await nextTick();
  const strip = stripRef.value;
  const chip = strip?.querySelector<HTMLElement>(
    `[data-day="${selectedDay.value}"]`,
  );
  if (!strip || !chip) return;
  strip.scrollTo({
    left: chip.offsetLeft - strip.clientWidth / 2 + chip.clientWidth / 2,
    behavior: smooth ? 'smooth' : 'auto',
  });
};

const selectDay = (key: string) => {
  selectedDay.value = key;
  scrollToSelected();
};

// После смены месяца: сегодня (если это текущий месяц), иначе первый день с событиями
const selectDefaultDay = () => {
  const inMonth = monthDays.value.some(day => day.key === todayKey);
  selectedDay.value = inMonth
    ? todayKey
    : (monthDays.value.find(day => day.count)?.key ?? monthDays.value[0]!.key);
  scrollToSelected(false);
};

const goToToday = async () => {
  const today = dayjs();
  if (
    today.month() + 1 !== calendarDate.value.month
    || today.year() !== calendarDate.value.year
  ) {
    calendarDate.value = new CalendarDate(
      today.year(),
      today.month() + 1,
      today.date(),
    );
    loading.value = true;
    await fetchEvents(calendarDate.value);
    loading.value = false;
  }
  selectDay(todayKey);
};

const openEventFromStrip = (event: Event) => {
  openedFromStrip.value = true;
  navDirection.value = 'forward';
  dayEvents.value = selectedDayEvents.value;
  selectedEvent.value = event;
};

// При возврате из подробностей лента монтируется заново — восстанавливаем прокрутку
const onViewEntered = () => {
  if (view.value === 'calendar') scrollToSelected(false);
};

onMounted(async () => {
  await fetchEvents(calendarDate.value);
  loading.value = false;
  scrollToSelected(false);
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
      @after-enter="onViewEntered"
    >
      <!-- Календарь -->
      <div
        v-if="view === 'calendar'"
        key="calendar"
        class="flex-1 min-h-0 flex flex-col"
      >
        <!-- Мобильная версия: лента дней месяца + события выбранного дня -->
        <div class="sm:hidden flex flex-col">
          <div class="flex items-center justify-between gap-2 px-3 pt-3 pb-2">
            <span class="text-sm font-semibold text-gray-900 capitalize">
              {{ monthLabel }}
            </span>
            <button
              v-if="selectedDay !== todayKey"
              type="button"
              class="text-xs font-semibold text-info px-2.5 py-1 rounded-full bg-info/10 active:bg-info/20"
              @click="goToToday"
            >
              Сегодня
            </button>
          </div>

          <div
            ref="stripRef"
            class="day-strip flex gap-1.5 overflow-x-auto px-3 pb-3 snap-x"
            role="listbox"
            :aria-label="`Дни: ${monthLabel}`"
          >
            <button
              v-for="day in monthDays"
              :key="day.key"
              :data-day="day.key"
              type="button"
              role="option"
              :aria-selected="day.key === selectedDay"
              :aria-label="`${day.label}${day.count ? `, событий: ${day.count}` : ''}`"
              class="relative flex flex-col items-center justify-center shrink-0 w-11 h-16 rounded-xl snap-center transition-colors"
              :class="[
                day.key === selectedDay
                  ? 'bg-info text-white shadow-sm'
                  : day.isMonday
                    ? 'bg-gray-50 text-gray-400'
                    : 'bg-gray-50 text-gray-800 active:bg-gray-100',
                day.key === todayKey && day.key !== selectedDay
                  ? 'ring-2 ring-info/40 ring-inset'
                  : '',
              ]"
              @click="selectDay(day.key)"
            >
              <span
                class="text-[10px] font-medium uppercase"
                :class="day.key === selectedDay ? 'text-white/80' : 'text-gray-400'"
              >
                {{ day.weekday }}
              </span>
              <span class="text-base font-bold leading-tight">{{ day.date }}</span>
              <span
                v-if="day.count"
                class="mt-0.5 size-1.5 rounded-full"
                :class="day.key === selectedDay ? 'bg-white' : 'bg-info'"
              />
              <span
                v-else-if="day.isMonday"
                class="text-[9px] leading-none mt-0.5"
              >вых.</span>
              <span
                v-else
                class="mt-0.5 size-1.5"
              />
            </button>
          </div>

          <div class="border-t border-gray-100 p-3 min-h-[148px]">
            <p class="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
              {{ selectedDayLabel }}
            </p>

            <div
              v-if="loading"
              class="space-y-1.5"
            >
              <div
                v-for="i in 2"
                :key="i"
                class="h-10 rounded-lg bg-gray-100 animate-pulse"
              />
            </div>

            <EventDetail
              v-else-if="selectedDayEvents.length"
              :events="selectedDayEvents"
              :selected-event="null"
              @select="openEventFromStrip"
            />

            <div
              v-else
              class="py-3 text-center"
            >
              <p class="text-sm text-gray-500">
                {{ isSelectedMonday ? 'Понедельник — выходной день' : 'В этот день событий нет' }}
              </p>
              <button
                v-if="nextEventDay"
                type="button"
                class="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-info"
                @click="selectDay(nextEventDay)"
              >
                Ближайшее событие: {{ formatDayShort(nextEventDay) }}
                <UIcon
                  name="i-heroicons-arrow-right-20-solid"
                  class="size-4"
                />
              </button>
              <button
                v-else
                type="button"
                class="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-info"
                @click="changeMonth('next')"
              >
                Смотреть следующий месяц
                <UIcon
                  name="i-heroicons-arrow-right-20-solid"
                  class="size-4"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Desktop версия - сетка календаря -->
        <div class="hidden sm:flex sm:flex-col flex-1 min-h-0">
          <div class="px-1 pt-2 lg:flex-1 lg:min-h-0 lg:overflow-y-auto">
            <!-- Без v-model: календарь только показывает месяц (placeholder),
                 поэтому ни сегодняшний, ни какой-либо другой день не «выбран» и не подсвечивается -->
            <UCalendar
              :placeholder="calendarDate"
              :year-controls="false"
              :month-controls="false"
              weekday-format="short"
              size="md"
              class="w-full"
              :ui="{
                root: 'w-full',
                heading: 'font-semibold text-sm',
                headCell: 'p-0',
                cell: 'p-0',
                cellTrigger:
                  'data-today:font-normal hover:not-data-[selected]:bg-transparent',
              }"
            >
              <!-- Заголовок дня недели: показывает все события этого дня недели за месяц -->
              <template #week-day="{ day }">
                <button
                  type="button"
                  class="weekday-btn"
                  :class="{ 'weekday-btn--empty': !weekdayCount(day) }"
                  :disabled="!weekdayCount(day)"
                  :title="
                    weekdayCount(day)
                      ? `Все события ${WEEKDAY_TITLE[weekdayIndex(day)]}`
                      : 'В эти дни событий нет'
                  "
                  @click="openWeekday(day)"
                >
                  {{ day }}
                </button>
              </template>

              <template #day="{ day }">
                <!-- День с событиями: бейдж-уведомление в правом верхнем углу, поверх дня -->
                <UChip
                  v-if="dayState(day) === 'event'"
                  :text="String(isEvent(day)?.length)"
                  color="info"
                  position="top-right"
                  :ui="{
                    base: 'h-3.5 min-w-3.5 px-0.5 text-[9px] leading-none font-semibold ring-[1.5px] ring-white',
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
                  @click.stop
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
        <!-- Все события выбранного дня недели, по датам -->
        <div
          v-if="weekdayFilter !== null && !selectedEvent"
          class="space-y-3"
        >
          <section
            v-for="group in weekdayGroups"
            :key="group.key"
          >
            <h3 class="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
              {{ group.label }}
            </h3>
            <EventDetail
              :events="group.events"
              :selected-event="null"
              @select="openEvent"
            />
          </section>
        </div>

        <EventDetail
          v-else
          :events="dayEvents ?? []"
          :selected-event="selectedEvent"
          @select="openEvent"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.weekday-btn {
  width: 100%;
  padding: 0;
  line-height: 1rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--ui-info);
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.weekday-btn:hover {
  background: color-mix(in oklab, var(--ui-info) 12%, transparent);
}

.weekday-btn--empty {
  color: var(--color-gray-300);
  cursor: default;
}

.weekday-btn--empty:hover {
  background: transparent;
}

/* Лента дней листается пальцем — полоса прокрутки не нужна */
.day-strip {
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.day-strip::-webkit-scrollbar {
  display: none;
}

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
