<template>
  <div class="w-[min(92vw,360px)]">
    <!-- Шапка панели: тот же бирюзовый градиент, что у карточки раздела в мега-меню -->
    <div class="rounded-t-2xl bg-gradient-to-br from-primary-700 to-primary-800 px-5 pt-5 pb-4 text-white">
      <p class="text-xs font-semibold uppercase tracking-wider text-white/60">
        Режим работы
      </p>
      <p
        class="mt-1.5 flex items-center gap-2 text-base font-bold leading-snug"
        aria-live="polite"
      >
        <span
          class="size-2.5 shrink-0 rounded-full"
          :class="status ? (status.isOpen ? 'bg-emerald-400' : 'bg-amber-300') : 'bg-white/30'"
          aria-hidden="true"
        />
        {{ status?.text ?? 'Часы работы библиотеки' }}
      </p>
    </div>

    <div class="px-5 py-4">
      <p class="mb-2 px-2.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
        {{ currentSchedule.label }}
      </p>
      <!-- Неделя с понедельника; сегодняшний день подсвечивается после загрузки -->
      <ol aria-label="Часы работы по дням недели">
        <li
          v-for="day in week"
          :key="day.index"
          class="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm"
          :class="day.index === status?.today ? 'bg-[#eef5f6] font-semibold text-primary-800' : 'text-gray-700'"
        >
          <span class="flex items-center gap-2">
            {{ day.label }}
            <span
              v-if="day.index === status?.today"
              class="rounded-full bg-primary-700 px-1.5 py-px text-[11px] font-semibold text-white"
            >сегодня</span>
          </span>
          <span
            class="tabular-nums"
            :class="{ 'text-gray-400': !day.hours }"
          >
            {{ day.hours ?? 'выходной' }}
          </span>
        </li>
      </ol>

      <ul class="mt-4 space-y-2.5 border-t border-gray-100 pt-4 text-[13px] leading-snug text-gray-600">
        <li class="flex gap-2.5">
          <UIcon
            name="i-heroicons-wrench-screwdriver"
            class="mt-px size-4 shrink-0 text-primary-700"
          />
          <span>Последний день месяца — технический день</span>
        </li>
        <li class="flex gap-2.5">
          <UIcon
            :name="otherSeason === 'summer' ? 'i-heroicons-sun' : 'i-heroicons-academic-cap'"
            class="mt-px size-4 shrink-0 text-primary-700"
          />
          <span>{{ otherScheduleText }}</span>
        </li>
        <li class="flex gap-2.5">
          <UIcon
            name="i-heroicons-identification"
            class="mt-px size-4 shrink-0 text-primary-700"
          />
          <span>Вход бесплатный, запись по паспорту</span>
        </li>
      </ul>

      <NuxtLink
        to="/page/rezhim-raboty"
        class="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-neutral-100 px-4 py-2.5 text-sm font-semibold text-primary-800 transition-colors hover:bg-[#e2eef0]"
        @click="emit('navigate')"
      >
        Подробнее о режиме работы
        <UIcon
          name="i-heroicons-arrow-right-20-solid"
          class="size-4"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LibrarySeason, LibraryStatus } from '~/utils/librarySchedule';

const props = defineProps<{
  /** Статус считается в браузере (зависит от текущего времени), до гидрации — null */
  status: LibraryStatus | null;
}>();

const emit = defineEmits<{ navigate: [] }>();

const WEEKDAY_FULL = [
  'Воскресенье',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
];

const formatHours = (hours: { open: number; close: number }) =>
  `${hours.open}:00–${hours.close}:00`;

const season = computed<LibrarySeason>(() => props.status?.season ?? getLibrarySeason());
const otherSeason = computed<LibrarySeason>(() => (season.value === 'summer' ? 'regular' : 'summer'));
const currentSchedule = computed(() => LIBRARY_SCHEDULES[season.value]);

const week = computed(() =>
  getWeekSchedule(season.value).map(({ index, hours }) => ({
    index,
    label: WEEKDAY_FULL[index],
    hours: hours ? formatHours(hours) : null,
  })),
);

/** Второе расписание одной строкой: соседние дни с одинаковыми часами склеиваются («пн–сб 10:00–19:00») */
const otherScheduleText = computed(() => {
  const days = getWeekSchedule(otherSeason.value);
  const groups: { from: number; to: number; hours: string | null }[] = [];
  for (const { index, hours } of days) {
    const text = hours ? formatHours(hours) : null;
    const last = groups.at(-1);
    if (last && last.hours === text) last.to = index;
    else groups.push({ from: index, to: index, hours: text });
  }
  const parts = groups.map(({ from, to, hours }) => {
    const range = from === to
      ? WEEKDAY_SHORT[from]!.toLowerCase()
      : `${WEEKDAY_SHORT[from]!.toLowerCase()}–${WEEKDAY_SHORT[to]!.toLowerCase()}`;
    return `${range} ${hours ?? '— выходной'}`;
  });
  return `${LIBRARY_SCHEDULES[otherSeason.value].label}: ${parts.join(', ')}`;
});
</script>
