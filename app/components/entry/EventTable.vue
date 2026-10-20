<template>
  <section
    class="event-table not-prose my-10"
    aria-label="Мероприятия"
  >
    <!-- Ближайшие и идущие -->
    <template v-if="upcoming.length">
      <div class="mb-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Ближайшие мероприятия
        </h2>
        <p class="text-sm text-gray-500">
          {{ upcoming.length }} {{ plural(upcoming.length, ['мероприятие', 'мероприятия', 'мероприятий']) }}
        </p>
      </div>

      <ul class="grid gap-5 sm:grid-cols-2">
        <li
          v-for="item in upcoming"
          :key="item.event.id"
        >
          <article class="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
            <!-- «Плакат»: цвет по типу, как в афише -->
            <div
              class="poster-head"
              :class="EVENT_CATEGORIES[item.category].poster"
            >
              <div class="flex items-start gap-3">
                <span
                  class="text-6xl font-bold leading-[0.8] tracking-tighter tabular-nums"
                  :class="{ 'text-[#157486]': item.category === 'talk' }"
                >{{ item.day.format('D') }}</span>
                <span class="pt-0.5 text-sm font-medium leading-tight">
                  {{ monthOf(item.day) }}<br>
                  <span
                    v-if="item.badge"
                    class="mt-1 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wide"
                    :class="EVENT_CATEGORIES[item.category].badge"
                  >
                    <span
                      v-if="item.isNow"
                      class="size-1.5 animate-pulse rounded-full bg-current motion-reduce:animate-none"
                    />
                    {{ item.badge }}
                  </span>
                  <span
                    v-else
                    class="opacity-75"
                  >{{ item.day.format('dddd') }}</span>
                </span>
                <span
                  v-if="item.event.timeStart"
                  class="ml-auto text-right text-lg font-bold leading-tight tabular-nums"
                >
                  {{ item.event.timeStart }}
                  <span
                    v-if="item.event.timeEnd"
                    class="block text-xs font-medium opacity-75"
                  >до {{ item.event.timeEnd }}</span>
                </span>
              </div>

              <div class="mt-5 flex items-end justify-between gap-3">
                <h3 class="text-lg font-bold leading-snug">
                  {{ item.event.title }}
                </h3>
                <span
                  v-if="item.event.age != null"
                  class="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-current text-xs font-bold"
                  :aria-label="`Возраст ${item.event.age}+`"
                >{{ item.event.age }}+</span>
              </div>
            </div>

            <!-- Подробности -->
            <div class="flex flex-1 flex-col p-5">
              <p
                v-if="item.event.description"
                :id="`event-desc-${item.event.id}`"
                class="whitespace-pre-line text-[15px] leading-relaxed text-gray-600"
                :class="{ 'line-clamp-4': !expanded.has(item.event.id) }"
              >
                {{ item.event.description }}
              </p>
              <button
                v-if="item.event.description.length > DESCRIPTION_CLAMP"
                type="button"
                class="mt-1 self-start text-sm font-medium text-[#157486] hover:underline focus-visible:outline-2 focus-visible:outline-[#0d4954]"
                :aria-expanded="expanded.has(item.event.id)"
                :aria-controls="`event-desc-${item.event.id}`"
                @click="toggle(item.event.id)"
              >
                {{ expanded.has(item.event.id) ? 'Свернуть' : 'Читать полностью' }}
              </button>

              <dl class="mt-5 space-y-2 border-t border-gray-100 pt-4 text-sm">
                <div
                  v-if="item.event.price"
                  class="flex items-center gap-2"
                >
                  <dt class="sr-only">
                    Стоимость
                  </dt>
                  <UIcon
                    name="i-heroicons-ticket"
                    class="size-[18px] shrink-0 text-[#157486]"
                  />
                  <dd class="font-semibold text-gray-900">
                    {{ item.event.price.toLocaleString('ru-RU') }} ₽
                  </dd>
                </div>
                <div
                  v-if="item.otherDates.length"
                  class="flex items-center gap-2"
                >
                  <dt class="sr-only">
                    Другие даты
                  </dt>
                  <UIcon
                    name="i-heroicons-calendar-days"
                    class="size-[18px] shrink-0 text-[#157486]"
                  />
                  <dd class="text-gray-700">
                    Также {{ item.otherDates.join(', ') }}
                  </dd>
                </div>
                <div
                  v-if="item.event.department || item.event.phone"
                  class="flex items-start gap-2"
                >
                  <dt class="sr-only">
                    Организатор
                  </dt>
                  <UIcon
                    name="i-heroicons-building-library"
                    class="mt-px size-[18px] shrink-0 text-[#157486]"
                  />
                  <dd class="text-gray-700">
                    {{ item.event.department }}<template v-if="item.event.department && item.event.phone">
                      ,
                    </template>
                    <a
                      v-if="item.event.phone"
                      :href="`tel:+7383${item.event.phone.replace(/\D/g, '')}`"
                      class="whitespace-nowrap font-medium text-gray-900 hover:text-[#157486] hover:underline"
                    >{{ item.event.phone }}</a>
                  </dd>
                </div>
              </dl>

              <UButton
                v-if="item.event.ticketUrl"
                :to="item.event.ticketUrl"
                target="_blank"
                rel="noopener"
                external
                size="lg"
                block
                trailing-icon="i-heroicons-arrow-up-right-20-solid"
                class="mt-5 rounded-xl"
                :aria-label="`Купить билет: ${item.event.title}`"
              >
                Купить билет
              </UButton>
            </div>
          </article>
        </li>
      </ul>
    </template>

    <div
      v-else
      class="rounded-2xl bg-white p-8 text-center ring-1 ring-gray-200"
    >
      <p class="text-lg font-bold text-gray-900">
        Новых мероприятий пока нет
      </p>
      <p class="mt-1 text-gray-600">
        Расписание обновляется — загляните позже или посмотрите афишу библиотеки.
      </p>
      <UButton
        to="/afisha"
        label="Открыть афишу"
        class="mt-4"
      />
    </div>

    <!-- Прошедшие -->
    <details
      v-if="past.length"
      class="group mt-8 rounded-2xl bg-white ring-1 ring-gray-200"
    >
      <summary class="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-5 py-4 font-semibold text-gray-900 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-[#0d4954] [&::-webkit-details-marker]:hidden">
        <span>
          Прошедшие мероприятия
          <span class="ml-1 font-normal text-gray-500">{{ past.length }}</span>
        </span>
        <UIcon
          name="i-heroicons-chevron-down"
          class="size-5 text-gray-400 transition-transform group-open:rotate-180 motion-reduce:transition-none"
        />
      </summary>
      <ul class="divide-y divide-gray-100 border-t border-gray-100">
        <li
          v-for="item in past"
          :key="item.event.id"
          class="flex items-baseline gap-4 px-5 py-3 text-sm"
        >
          <span class="w-24 shrink-0 tabular-nums text-gray-500">{{ item.day.format('D MMMM') }}</span>
          <span class="min-w-0 flex-1 text-gray-800">{{ item.event.title }}</span>
          <span
            v-if="item.event.age != null"
            class="shrink-0 text-xs text-gray-400"
          >{{ item.event.age }}+</span>
        </li>
      </ul>
    </details>
  </section>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import type { TableEvent } from '~/utils/eventTable';

// Карточки мероприятий из таблицы в новости (см. app/utils/eventTable.ts)
const props = defineProps<{ events: TableEvent[] }>();

/** Описание длиннее — сворачиваем в 4 строки с кнопкой «Читать полностью» */
const DESCRIPTION_CLAMP = 220;

// «Сейчас» фиксируем один раз: на сервере и в браузере статусы совпадут
const now = useState('event-table-now', () => libraryNow().format('YYYY-MM-DDTHH:mm'));

const classify = (event: TableEvent) => {
  const nowValue = dayjs(now.value);
  const today = nowValue.format('YYYY-MM-DD');
  const nowTime = nowValue.format('HH:mm');
  const isOver = (date: string) => date < today || (date === today && !!event.timeEnd && event.timeEnd <= nowTime);

  const coming = event.dates.filter(date => !isOver(date)).sort();
  const dayKey = coming[0] ?? [...event.dates].sort().at(-1)!;
  const day = dayjs(dayKey);
  const isToday = dayKey === today;
  const isNow = isToday && !!event.timeStart && event.timeStart <= nowTime && (!event.timeEnd || nowTime < event.timeEnd);

  return {
    event,
    day,
    isPast: !coming.length,
    isNow,
    badge: isNow ? 'Идёт сейчас' : isToday ? 'Сегодня' : dayKey === nowValue.add(1, 'day').format('YYYY-MM-DD') ? 'Завтра' : null,
    category: eventCategory({ title: event.title, category: null }),
    otherDates: event.dates.filter(date => date !== dayKey && !isOver(date)).map(date => dayjs(date).format('D MMMM')),
  };
};

const classified = computed(() => props.events.map(classify));

// Ближайшие — по возрастанию даты и времени, прошедшие — от недавних к старым
const upcoming = computed(() =>
  classified.value
    .filter(item => !item.isPast)
    .sort((a, b) =>
      `${a.day.format('YYYY-MM-DD')}${a.event.timeStart ?? ''}`.localeCompare(`${b.day.format('YYYY-MM-DD')}${b.event.timeStart ?? ''}`),
    ),
);
const past = computed(() =>
  classified.value.filter(item => item.isPast).sort((a, b) => b.day.valueOf() - a.day.valueOf()),
);

const monthOf = (day: dayjs.Dayjs) => day.format('D MMMM').split(' ')[1];

const expanded = ref(new Set<string>());
const toggle = (id: string) => {
  const next = new Set(expanded.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  expanded.value = next;
};
</script>

<style scoped>
.poster-head {
  padding: 1.25rem;
}
</style>
