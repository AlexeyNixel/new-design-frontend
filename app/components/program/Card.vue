<!-- Карточка культурно-просветительской программы: даты слева, описание и запись справа.
     Данные — app/constants/culturePrograms.ts -->
<template>
  <article
    class="grid overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm md:grid-cols-[220px_minmax(0,1fr)]"
  >
    <!-- Даты сеансов: ближайшие сверху, прошедшие приглушены -->
    <aside
      class="flex gap-2 overflow-x-auto bg-primary/5 p-4 md:flex-col md:overflow-visible md:p-5"
      aria-label="Даты проведения"
    >
      <p
        class="hidden md:block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1"
      >
        {{ sessions.length > 1 ? 'Даты' : 'Дата' }}
      </p>
      <div
        v-for="session in sessions"
        :key="session.date + session.start"
        class="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5"
        :class="session.isPast ? 'bg-transparent opacity-50' : 'bg-white shadow-sm'"
      >
        <div class="flex flex-col items-center leading-none w-10">
          <span
            class="text-2xl font-extrabold"
            :class="session.isPast ? 'text-gray-500' : 'text-primary'"
          >{{ session.day }}</span>
          <span class="mt-1 text-[11px] font-semibold uppercase text-gray-500">{{ session.month }}</span>
        </div>
        <div class="text-sm leading-tight">
          <p class="font-semibold text-gray-900 capitalize">
            {{ session.weekday }}
          </p>
          <p class="text-gray-600">
            {{ session.time }}
          </p>
          <p
            v-if="session.isPast"
            class="text-xs text-gray-500"
          >
            прошло
          </p>
        </div>
      </div>
    </aside>

    <!-- Описание -->
    <div class="flex flex-col p-5 sm:p-7">
      <p class="text-xs sm:text-sm font-semibold uppercase tracking-wide text-primary">
        {{ program.kind }}
      </p>
      <h2
        class="mt-1.5 flex flex-wrap items-start gap-x-3 gap-y-1 text-xl sm:text-2xl font-bold leading-tight text-gray-900"
      >
        <span>«{{ program.title }}»</span>
        <span
          v-if="program.age !== undefined"
          class="mt-0.5 rounded-full border border-gray-300 px-2 py-0.5 text-xs font-semibold text-gray-600"
        >{{ program.age }}+</span>
      </h2>

      <div class="mt-4 text-sm sm:text-base leading-relaxed text-gray-700">
        <div
          :id="descriptionId"
          class="space-y-3"
          :class="{ 'line-clamp-4': collapsible && !expanded }"
        >
          <p
            v-for="(paragraph, index) in paragraphs"
            :key="index"
          >
            {{ paragraph }}
          </p>
        </div>
        <button
          v-if="collapsible"
          type="button"
          class="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          :aria-expanded="expanded"
          :aria-controls="descriptionId"
          @click="expanded = !expanded"
        >
          {{ expanded ? 'Свернуть' : 'Читать полностью' }}
          <Icon
            name="i-heroicons-chevron-down-20-solid"
            class="size-4 transition-transform"
            :class="{ 'rotate-180': expanded }"
          />
        </button>
      </div>

      <!-- Стоимость, контакты, запись -->
      <div
        class="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-end sm:justify-between"
      >
        <dl class="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <div>
            <dt class="text-xs text-gray-500">
              Стоимость
            </dt>
            <dd class="mt-0.5 text-lg font-bold text-gray-900">
              {{ priceLabel }}
            </dd>
          </div>
          <div>
            <dt class="text-xs text-gray-500">
              Организатор
            </dt>
            <dd class="mt-0.5 font-medium text-gray-900">
              {{ program.department }}
            </dd>
            <dd
              v-if="program.phone"
              class="mt-0.5"
            >
              <a
                :href="`tel:${phoneHref}`"
                class="inline-flex items-center gap-1 text-primary hover:underline"
              >
                <Icon
                  name="i-heroicons-phone-20-solid"
                  class="size-4"
                />
                {{ program.phone }}
              </a>
            </dd>
          </div>
        </dl>

        <UButton
          v-if="hasUpcoming && program.ticketUrl"
          :to="program.ticketUrl"
          target="_blank"
          size="lg"
          class="rounded-xl px-6 justify-center"
          icon="i-heroicons-ticket"
          label="Приобрести билет"
        />
        <UButton
          v-else-if="hasUpcoming && program.phone"
          :to="`tel:${phoneHref}`"
          size="lg"
          variant="soft"
          class="rounded-xl px-6 justify-center"
          icon="i-heroicons-phone"
          label="Записаться по телефону"
        />
        <span
          v-else-if="!hasUpcoming"
          class="text-sm text-gray-500"
        >Новые даты появятся позже</span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import type { CultureProgram } from '~/constants/culturePrograms';

const props = defineProps<{
  program: CultureProgram;
}>();

/** Описание длиннее этого — сворачиваем до 4 строк */
const COLLAPSE_FROM = 320;

const expanded = ref(false);
const descriptionId = `program-${props.program.id}-description`;
const today = dayjs().format('YYYY-MM-DD');

const sessions = computed(() =>
  [...props.program.sessions]
    .map((session) => {
      const date = dayjs(session.date);
      return {
        ...session,
        day: date.format('D'),
        month: date.format('MMM').replace('.', ''),
        weekday: date.format('dddd'),
        time: session.end ? `${session.start}–${session.end}` : session.start,
        isPast: session.date < today,
      };
    })
    // Сначала будущие по возрастанию, затем прошедшие — от недавних к давним
    .sort((a, b) => {
      if (a.isPast !== b.isPast) return a.isPast ? 1 : -1;
      return a.isPast ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date);
    }),
);

const hasUpcoming = computed(() => sessions.value.some(session => !session.isPast));

const paragraphs = computed(() =>
  props.program.description.split(/\n{2,}/).map(text => text.trim()).filter(Boolean),
);
const collapsible = computed(() => props.program.description.length > COLLAPSE_FROM);

const priceLabel = computed(() =>
  props.program.price ? `${props.program.price} ₽` : 'Вход свободный',
);

// Городской номер из афиши («218-27-34») → +7 383 …
const phoneHref = computed(() => {
  const digits = (props.program.phone ?? '').replace(/\D/g, '');
  if (digits.length === 7) return `+7383${digits}`;
  if (digits.length === 10) return `+7${digits}`;
  if (digits.length === 11) return `+7${digits.slice(1)}`;
  return digits;
});
</script>
