<script setup lang="ts">
import type { DateValue } from '@internationalized/date';
import type { Event } from '~~/services/types/event.type';
import { CalendarDate } from '@internationalized/date';
import dayjs from 'dayjs';
import { NuxtLink } from '#components';
import { useEventApi } from '~~/services/api/eventService';
import { libraryNow, toEventApiDate } from '~/composables/useEventTime';

/** Кнопки шапки: на телефоне — на зелёной полосе, с sm — круглые на белой шапке */
const HEADER_BTN_CLASS
  = 'shrink-0 rounded-full text-primary-800 bg-[#eef5f6] hover:bg-[#e0ecee]';

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

// ——— Ближайшие события ———
// Календарь открывается сразу на ближайшем событии; стрелки листают следующие,
// а кнопка «Календарь» поднимает на уровень выше — к сетке месяца.

/** Насколько вперёд искать — те же параметры, что у EventNearest (один запрос на двоих) */
const NEAREST_DAYS = 14;
/** Сколько ближайших событий можно пролистать — дальше удобнее календарь */
const NEAREST_MAX = 7;

const eventApi = useEventApi();
const today = libraryNow().startOf('day');
const { data: upcomingData } = await eventApi.getAllEvents({
  startDate: toEventApiDate(today),
  endDate: toEventApiDate(today.add(NEAREST_DAYS, 'day').endOf('day')),
  limit: 100,
});

const upcoming = [...(upcomingData ?? [])]
  // isDeleted приходит то булевым, то строкой 'False'
  .filter(event => String(event.isDeleted).toLowerCase() !== 'true')
  .filter(event => parseEventTime(event.eventTime).isAfter(libraryNow()))
  .sort(
    (a, b) =>
      parseEventTime(a.eventTime).valueOf()
      - parseEventTime(b.eventTime).valueOf(),
  )
  .slice(0, NEAREST_MAX);

/** Открыты подробности ближайшего события (а не события из календаря) */
const nearestMode = ref(upcoming.length > 0);
if (upcoming[0]) selectedEvent.value = upcoming[0];

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
  if (view.value === 'detail' && selectedEvent.value) {
    return nearestMode.value
      ? 'Ближайшее событие'
      : parseEventTime(selectedEvent.value.eventTime).format('D MMMM');
  }
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

// Сетка месяца показывается только с sm — в фирменных бирюзовых цветах
const DAY_CIRCLE_CLASS: Record<DayState, string> = {
  event: 'bg-[#eef5f6] text-primary-800 font-bold cursor-pointer hover:bg-primary-800 hover:text-white',
  monday: 'text-gray-300',
  outside: 'text-gray-200',
  normal: 'text-gray-600',
};

const isTodayDate = (date: DateValue) =>
  dayjs(date.toString()).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD');

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
  if (openedFromStrip.value || nearestMode.value) {
    closeToCalendar();
    return;
  }
  navDirection.value = 'back';
  selectedEvent.value = null;
};

const closeToCalendar = () => {
  nearestMode.value = false;
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

// ——— Листание подробностей ———

/** События, между которыми листают стрелки: ближайшие, события дня недели или дня */
const detailList = computed<Event[]>(() => {
  if (nearestMode.value) return upcoming;
  if (weekdayFilter.value !== null) return weekdayGroups.value.flatMap(group => group.events);
  return dayEvents.value ?? [];
});

const detailIndex = computed(() =>
  detailList.value.findIndex(event => event.id === selectedEvent.value?.id),
);

// Подробности листаются свайпером (мышью, пальцем или стрелками, как в главной карусели).
// Нативный веб-компонент из nuxt-swiper — см. MainCarousel.
type SwiperContainerEl = HTMLElement & {
  swiper?: { activeIndex: number; slidePrev: () => void; slideNext: () => void };
};
const detailSwiperRef = ref<SwiperContainerEl | null>(null);

/** Слайд, с которого открылись подробности; дальше индекс меняет сам свайпер */
const detailStartIndex = ref(0);
watch(view, (value) => {
  if (value === 'detail') detailStartIndex.value = Math.max(detailIndex.value, 0);
}, { immediate: true });

const onDetailSlideChange = () => {
  const next = detailList.value[detailSwiperRef.value?.swiper?.activeIndex ?? 0];
  if (next) selectedEvent.value = next;
};

const showSibling = (step: 1 | -1) => {
  const swiper = detailSwiperRef.value?.swiper;
  if (step > 0) swiper?.slideNext();
  else swiper?.slidePrev();
};

/** «Подняться» из подробностей: к календарю или к списку дня, откуда открыли */
const upLabel = computed(() =>
  nearestMode.value || openedFromStrip.value ? 'Календарь' : 'К списку',
);

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
    class="relative overflow-hidden flex flex-col h-full bg-white shadow rounded-xl sm:rounded-2xl sm:shadow-xl"
  >
    <!-- Единая шапка для календаря и панели событий -->
    <header
      class="flex items-center gap-1 shrink-0 px-2 sm:px-3 py-2 sm:py-3 bg-white text-primary-800 border-b border-gray-100"
    >
      <UButton
        v-if="view === 'calendar'"
        variant="ghost"
        icon="i-iconoir-nav-arrow-left"
        :class="HEADER_BTN_CLASS"
        @click="changeMonth('prev')"
      />
      <div
        v-else
        class="w-9 h-8 shrink-0"
      />

      <!-- В режиме календаря заголовок ведёт на полную афишу -->
      <component
        :is="view === 'calendar' ? NuxtLink : 'div'"
        v-bind="view === 'calendar' ? { to: '/afisha', title: 'Вся афиша' } : {}"
        class="flex items-center gap-2 flex-1 justify-center min-w-0"
        :class="{ 'hover:underline underline-offset-4': view === 'calendar' }"
      >
        <Icon
          class="text-lg sm:text-xl shrink-0"
          name="i-heroicons-calendar-days"
        />
        <div class="font-bold text-sm sm:text-base truncate">
          {{ headerTitle }}
        </div>
      </component>

      <UButton
        v-if="view === 'calendar'"
        variant="ghost"
        icon="i-iconoir-nav-arrow-right"
        :class="HEADER_BTN_CLASS"
        @click="changeMonth('next')"
      />
      <div
        v-else-if="view === 'detail'"
        class="w-9 h-8 shrink-0"
      />
      <UButton
        v-else
        variant="ghost"
        icon="heroicons:x-mark-20-solid"
        :class="HEADER_BTN_CLASS"
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
          <div class="px-2.5 pt-2 lg:flex-1 lg:min-h-0 lg:overflow-y-auto">
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
                heading: 'font-semibold text-sm capitalize text-primary-800',
                headCell: 'p-0',
                cell: 'p-0',
                cellTrigger:
                  'size-auto p-0 my-px data-today:font-normal hover:not-data-[selected]:bg-transparent',
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
                <!-- Точки под числом — сколько событий в этот день (не больше трёх) -->
                <div
                  class="group relative flex flex-col items-center justify-center rounded-xl w-9 h-8 text-xs font-medium transition-colors"
                  :class="[
                    DAY_CIRCLE_CLASS[dayState(day)],
                    dayState(day) !== 'outside' && isTodayDate(day) ? 'ring-2 ring-primary-50 ring-inset' : '',
                  ]"
                  :title="dayState(day) === 'monday' ? 'Выходной' : undefined"
                  @click.stop="dayState(day) === 'event' && openDay(isEvent(day) ?? [])"
                >
                  <span class="leading-none">{{ day.day }}</span>
                  <span
                    v-if="dayState(day) === 'event'"
                    class="absolute bottom-1 flex gap-0.5"
                  >
                    <span
                      v-for="i in Math.min(isEvent(day)?.length ?? 0, 3)"
                      :key="i"
                      class="size-1 rounded-full bg-primary-50 group-hover:bg-white"
                    />
                  </span>
                </div>
              </template>
            </UCalendar>
          </div>
        </div>
      </div>

      <!-- Подробности события: плакат + описание, кнопки закреплены снизу -->
      <div
        v-else-if="view === 'detail' && selectedEvent"
        key="detail"
        class="flex flex-col max-h-[460px] lg:max-h-none lg:flex-1 lg:min-h-0"
      >
        <!-- Каждое событие — слайд; листается мышью, пальцем и стрелками -->
        <div class="event-slider relative overflow-hidden flex-1 min-h-0 h-[460px] lg:h-auto">
          <swiper-container
            ref="detailSwiperRef"
            class="block w-full h-full"
            :initial-slide="detailStartIndex"
            space-between="12"
            @swiperslidechange="onDetailSlideChange"
          >
            <swiper-slide
              v-for="(item, index) in detailList"
              :key="item.id"
              class="overflow-y-auto"
            >
              <EventDetail
                :events="[]"
                :selected-event="item"
                :position="{ index, total: detailList.length }"
              />
            </swiper-slide>
          </swiper-container>

          <!-- Стрелки как в главной карусели: появляются при наведении -->
          <template v-if="detailList.length > 1">
            <button
              v-show="detailIndex > 0"
              type="button"
              aria-label="Предыдущее событие"
              class="event-arrow left-1"
              @click="showSibling(-1)"
            >
              <Icon
                name="i-heroicons-chevron-left-20-solid"
                class="w-5 h-5"
              />
            </button>
            <button
              v-show="detailIndex < detailList.length - 1"
              type="button"
              aria-label="Следующее событие"
              class="event-arrow right-1"
              @click="showSibling(1)"
            >
              <Icon
                name="i-heroicons-chevron-right-20-solid"
                class="w-5 h-5"
              />
            </button>
          </template>
        </div>
        <div class="flex gap-2 p-2.5 shrink-0 border-t border-gray-100">
          <UButton
            :to="`/afisha/${selectedEvent.id}`"
            label="Подробнее"
            trailing-icon="i-heroicons-arrow-right-20-solid"
            class="flex-1 justify-center bg-[#0d4954] hover:bg-[#0d4954]/90 font-bold"
          />
          <UButton
            :label="upLabel"
            :icon="upLabel === 'Календарь' ? 'i-heroicons-calendar-days' : 'i-heroicons-list-bullet'"
            color="neutral"
            variant="soft"
            class="flex-1 justify-center bg-[#eef5f6] text-[#0d4954] hover:bg-[#e0ecee] font-bold"
            @click="backToList"
          />
        </div>
      </div>

      <!-- Список событий дня -->
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
          :selected-event="null"
          @select="openEvent"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Дни недели в сетке месяца (только с sm) */
.weekday-btn {
  width: 100%;
  padding: 0;
  line-height: 1.5rem;
  border-radius: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-primary-800);
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.weekday-btn:hover {
  background: #eef5f6;
}

.weekday-btn--empty {
  color: var(--color-gray-300);
  cursor: default;
}

.weekday-btn--empty:hover {
  background: transparent;
}

/* Стрелки подробностей — как .slider-arrow в MainCarousel; на телефоне только свайп */
.event-arrow {
  position: absolute;
  top: 50%;
  z-index: 10;
  display: none;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background: rgb(255 255 255 / 0.7);
  color: var(--color-gray-800);
  box-shadow: 0 2px 10px rgb(0 0 0 / 0.12);
  backdrop-filter: blur(6px);
  opacity: 0;
  transform: translateY(-50%) scale(0.92);
  transition:
    opacity 0.25s ease,
    transform 0.25s ease,
    background-color 0.15s ease;
  cursor: pointer;
}

@media (min-width: 640px) {
  .event-arrow {
    display: flex;
  }
}

.event-slider:hover .event-arrow,
.event-arrow:focus-visible {
  opacity: 1;
  transform: translateY(-50%) scale(1);
}

.event-arrow:hover {
  background: rgb(255 255 255 / 0.95);
}

.event-arrow:focus-visible {
  outline: 2px solid var(--ui-primary);
  outline-offset: 2px;
}

/* До гидратации swiper-slide рендерится как inline — задаём размеры заранее */
.event-slider swiper-slide {
  display: block;
  width: 100%;
  height: 100%;
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
