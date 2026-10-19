<template>
  <div class="bg-neutral-100">
    <!-- Шапка: название раздела и ближайшее событие -->
    <section class="bg-[#0d4954] text-white">
      <div class="mx-auto max-w-[1236px] px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-14 3xl:max-w-[1710px]">
        <UBreadcrumb
          :items="breadcrumbItems"
          :ui="{
            link: 'text-white/70 hover:text-white',
            linkLeadingIcon: 'text-white/70',
            separatorIcon: 'text-white/40',
          }"
          class="mb-8"
        />

        <div class="grid items-end gap-8 lg:grid-cols-[1fr_minmax(0,460px)]">
          <div>
            <h1 class="text-6xl font-bold leading-[0.9] tracking-tight sm:text-8xl lg:text-9xl">
              Афиша
            </h1>
            <p class="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              Мастер-классы, игры, концерты и встречи в молодёжной библиотеке
              на ближайшие два месяца. Новосибирск, {{ LIBRARY_INFO.address.streetAddress }},
              по понедельникам выходной.
            </p>
          </div>

          <NuxtLink
            v-if="nearest"
            :to="`/afisha/${nearest.id}`"
            class="group block rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:p-6"
          >
            <p class="text-sm font-medium text-[#F2B632]">
              Ближайшее событие, {{ relativeDay(nearest.eventTime) }} в {{ formatTime(nearest.eventTime) }}
            </p>
            <p class="mt-2 text-xl font-bold leading-snug group-hover:underline group-hover:underline-offset-4 sm:text-2xl">
              {{ nearest.title }}
            </p>
            <p
              v-if="eventPlaceName(nearest)"
              class="mt-3 text-sm text-white/70"
            >
              {{ eventPlaceName(nearest) }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <div class="mx-auto max-w-[1236px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10 3xl:max-w-[1710px]">
      <!-- Фильтры: по типу и по возрасту -->
      <div
        v-if="events.length"
        class="mb-8 flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Фильтр мероприятий"
      >
        <button
          type="button"
          class="chip"
          :class="{ 'chip--active': !category }"
          :aria-pressed="!category"
          @click="category = null"
        >
          Все
          <span class="chip__count">{{ events.length }}</span>
        </button>
        <button
          v-for="item in categoryOptions"
          :key="item.value"
          type="button"
          class="chip"
          :class="{ 'chip--active': category === item.value }"
          :aria-pressed="category === item.value"
          @click="category = category === item.value ? null : item.value"
        >
          <span
            class="size-3 rounded-full"
            :class="EVENT_CATEGORIES[item.value].swatch"
          />
          {{ EVENT_CATEGORIES[item.value].label }}
          <span class="chip__count">{{ item.count }}</span>
        </button>

        <span class="mx-1 hidden h-6 w-px bg-gray-300 sm:block" />

        <button
          v-for="age in ageOptions"
          :key="age"
          type="button"
          class="chip"
          :class="{ 'chip--active': maxAge === age }"
          :aria-pressed="maxAge === age"
          :title="`Мероприятия, куда можно прийти с ${age} лет`"
          @click="maxAge = maxAge === age ? null : age"
        >
          Можно с {{ age }} лет
        </button>
      </div>

      <!-- Плакаты по неделям -->
      <section
        v-for="week in weeks"
        :key="week.key"
        class="mb-12 last:mb-0"
        :aria-labelledby="`week-${week.key}`"
      >
        <h2
          :id="`week-${week.key}`"
          class="mb-5 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
        >
          {{ week.label }}
        </h2>

        <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <li
            v-for="event in week.events"
            :key="event.id"
          >
            <NuxtLink
              :to="`/afisha/${event.id}`"
              class="poster group"
              :class="EVENT_CATEGORIES[eventCategory(event)].poster"
            >
              <div class="flex items-start gap-3">
                <span
                  class="text-7xl font-bold leading-[0.8] tracking-tighter tabular-nums"
                  :class="{ 'text-[#157486]': eventCategory(event) === 'talk' }"
                >
                  {{ parseEventTime(event.eventTime).format('D') }}
                </span>
                <span class="pt-0.5 text-sm font-medium leading-tight">
                  {{ monthGenitive(event.eventTime) }}<br>
                  <span class="opacity-75">{{ parseEventTime(event.eventTime).format('dddd') }}</span>
                </span>
                <span class="ml-auto text-lg font-bold tabular-nums">
                  {{ formatTime(event.eventTime) }}
                </span>
              </div>

              <p class="mt-6 line-clamp-5 sm:mt-8 flex-1 text-lg font-bold leading-snug group-hover:underline group-hover:underline-offset-4">
                {{ event.title }}
              </p>

              <div class="mt-5 flex items-end justify-between gap-3 text-sm">
                <span class="opacity-80">{{ eventPlaceName(event) }}</span>
                <span
                  v-if="Number(event.age)"
                  class="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-current text-xs font-bold"
                  :aria-label="`Возраст ${Number(event.age)}+`"
                >
                  {{ Number(event.age) }}+
                </span>
              </div>
            </NuxtLink>
          </li>
        </ul>
      </section>

      <!-- Пусто: нет событий вообще или под выбранные фильтры -->
      <div
        v-if="!weeks.length"
        class="rounded-2xl bg-white p-10 text-center ring-1 ring-gray-200"
      >
        <template v-if="events.length">
          <p class="text-lg font-bold text-gray-900">
            Под эти фильтры ничего не нашлось
          </p>
          <UButton
            label="Показать все мероприятия"
            class="mt-4"
            @click="resetFilters"
          />
        </template>
        <template v-else>
          <p class="text-lg font-bold text-gray-900">
            Ближайших мероприятий пока нет
          </p>
          <p class="mt-1 text-gray-600">
            Новые анонсы появляются в новостях и в нашем сообществе ВКонтакте.
          </p>
          <UButton
            to="/post"
            label="Читать новости"
            class="mt-4"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import type { Event } from '~~/services/types/event.type';
import type { EventCategory } from '~/utils/eventCategory';
import { useEventApi } from '~~/services/api/eventService';

/** Сколько дней вперёд показывает афиша */
const DAYS_AHEAD = 60;

const eventApi = useEventApi();
const parseEventTime = useParseEventTime();
const toEventSchema = useEventSchema();
const toAbsolute = useAbsoluteUrl();

const today = dayjs().startOf('day');
const { data } = await eventApi.getAllEvents({
  startDate: today.format(),
  endDate: today.add(DAYS_AHEAD, 'day').endOf('day').format(),
  limit: 200,
});

// API отдаёт события от поздних к ранним — в афише нужен порядок по времени
const events = computed<Event[]>(() =>
  [...(data ?? [])]
    // isDeleted приходит то булевым, то строкой 'False'
    .filter(event => String(event.isDeleted).toLowerCase() !== 'true')
    .sort(
      (a, b) =>
        parseEventTime(a.eventTime).valueOf()
        - parseEventTime(b.eventTime).valueOf(),
    ),
);

// ——— Фильтры ———

const category = ref<EventCategory | null>(null);
const maxAge = ref<number | null>(null);

const categoryOptions = computed(() =>
  (Object.keys(EVENT_CATEGORIES) as EventCategory[])
    .map(value => ({
      value,
      count: events.value.filter(event => eventCategory(event) === value).length,
    }))
    .filter(item => item.count),
);

/** Возрастные пороги, которые реально встречаются в афише */
const ageOptions = computed(() =>
  [...new Set(events.value.map(event => Number(event.age)).filter(Boolean))]
    .sort((a, b) => a - b)
    .slice(0, -1),
);

const filtered = computed(() =>
  events.value.filter(
    event =>
      (!category.value || eventCategory(event) === category.value)
      && (!maxAge.value || Number(event.age) <= maxAge.value),
  ),
);

const resetFilters = () => {
  category.value = null;
  maxAge.value = null;
};

// ——— Группировка по неделям (с понедельника) ———

const weekStart = (date: dayjs.Dayjs) =>
  date.subtract((date.day() + 6) % 7, 'day').startOf('day');

const weekLabel = (start: dayjs.Dayjs) => {
  const current = weekStart(today);
  if (start.isSame(current, 'day')) return 'На этой неделе';
  if (start.isSame(current.add(1, 'week'), 'day')) return 'На следующей неделе';
  const end = start.add(6, 'day');
  return start.month() === end.month()
    ? `${start.format('D')}–${end.format('D MMMM')}`
    : `${start.format('D MMMM')} – ${end.format('D MMMM')}`;
};

const weeks = computed(() => {
  const groups = new Map<string, Event[]>();
  for (const event of filtered.value) {
    const key = weekStart(parseEventTime(event.eventTime)).format('YYYY-MM-DD');
    groups.set(key, [...(groups.get(key) ?? []), event]);
  }
  return [...groups].map(([key, list]) => ({
    key,
    label: weekLabel(dayjs(key)),
    events: list,
  }));
});

// ——— Ближайшее событие ———

const nearest = computed(() =>
  events.value.find(event => parseEventTime(event.eventTime).isAfter(dayjs())),
);

const relativeDay = (date: Date | string) => {
  const day = parseEventTime(date).startOf('day');
  if (day.isSame(today, 'day')) return 'сегодня';
  if (day.isSame(today.add(1, 'day'), 'day')) return 'завтра';
  return day.format('D MMMM');
};

const formatTime = (date: Date | string) => parseEventTime(date).format('HH:mm');

/** «октября», а не «октябрь»: родительный падеж dayjs даёт только рядом с числом */
const monthGenitive = (date: Date | string) =>
  parseEventTime(date).format('D MMMM').split(' ')[1];

// ——— SEO ———

const breadcrumbItems = [
  { label: 'Главная', icon: 'i-heroicons-home', to: '/' },
  { label: 'Афиша', to: '/afisha' },
];
useBreadcrumbSchema(breadcrumbItems);

usePageSeo({
  title: 'Афиша мероприятий в Новосибирске — куда сходить',
  description:
    'Афиша Новосибирской областной молодёжной библиотеки: мастер-классы, игры и квесты, концерты, встречи и лекции на ближайшие два месяца. Красный проспект, 26.',
});

useJsonLd('content', () => {
  const items = events.value
    .map(event => toEventSchema(event))
    .filter(item => !!item);
  if (!items.length) return undefined;

  return {
    '@type': 'ItemList',
    'name': 'Афиша мероприятий НОМБ',
    'url': toAbsolute('/afisha'),
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': item,
    })),
  };
});
</script>

<style scoped>
.poster {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 220px;
  padding: 1.25rem;
  border-radius: 1rem;
}

@media (min-width: 640px) {
  .poster {
    min-height: 300px;
  }
}

.poster:focus-visible {
  outline: 3px solid #0d4954;
  outline-offset: 3px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  border-radius: 9999px;
  background: #fff;
  color: #1f2937;
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: inset 0 0 0 1px rgb(13 73 84 / 0.15);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.chip:hover {
  background: rgb(13 73 84 / 0.06);
}

.chip:focus-visible {
  outline: 2px solid #0d4954;
  outline-offset: 2px;
}

.chip--active,
.chip--active:hover {
  background: #0d4954;
  color: #fff;
}

.chip__count {
  font-size: 0.75rem;
  opacity: 0.6;
  font-variant-numeric: tabular-nums;
}
</style>
