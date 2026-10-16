<!-- Культурно-просветительские программы. Данные — app/constants/culturePrograms.ts -->
<template>
  <CommonContentContainer>
    <UBreadcrumb
      :ui="{ link: '[&>span]:text-black text-black' }"
      class="text-black mb-6"
      :items="BREADCRUMB_ITEMS"
    />

    <header class="mb-8 md:mb-10 max-w-3xl">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900">
        Программы и встречи
      </h1>
      <p class="mt-3 text-base md:text-lg text-gray-600">
        Литературные, музыкальные и просветительские программы библиотеки.
        Выберите удобную дату и запишитесь — по ссылке или по телефону отдела.
      </p>
    </header>

    <section
      v-if="upcoming.length"
      aria-labelledby="programs-upcoming"
    >
      <h2
        id="programs-upcoming"
        class="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900"
      >
        Ближайшие
        <span class="rounded-full bg-primary/10 px-2 py-0.5 text-sm text-primary">{{ upcoming.length }}</span>
      </h2>
      <div class="flex flex-col gap-6">
        <ProgramCard
          v-for="program in upcoming"
          :key="program.id"
          :program="program"
        />
      </div>
    </section>

    <section
      v-if="past.length"
      class="mt-12"
      aria-labelledby="programs-past"
    >
      <h2
        id="programs-past"
        class="mb-4 text-lg font-semibold text-gray-500"
      >
        Прошедшие
      </h2>
      <div class="flex flex-col gap-6 opacity-80">
        <ProgramCard
          v-for="program in past"
          :key="program.id"
          :program="program"
        />
      </div>
    </section>

    <p
      v-if="!upcoming.length && !past.length"
      class="py-16 text-center text-gray-500"
    >
      Программы скоро появятся
    </p>
  </CommonContentContainer>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { CULTURE_PROGRAMS } from '~/constants/culturePrograms';
import type { CultureProgram } from '~/constants/culturePrograms';

usePageSeo({
  title: 'Программы и встречи',
  description:
    'Литературные, музыкальные и просветительские программы Новосибирской областной молодёжной библиотеки.',
});

// Тестовая страница — не индексируем
useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] });

const BREADCRUMB_ITEMS = [
  { label: 'Главная', icon: 'i-heroicons-home', to: '/' },
  { label: 'Программы и встречи', icon: 'i-heroicons-musical-note', to: '/test' },
];

const today = dayjs().format('YYYY-MM-DD');

/** Ближайшая будущая дата программы (или undefined, если все прошли) */
const nextDate = (program: CultureProgram) =>
  program.sessions
    .map(session => session.date)
    .filter(date => date >= today)
    .sort()[0];

const lastDate = (program: CultureProgram) =>
  program.sessions.map(session => session.date).sort().at(-1) ?? '';

const upcoming = CULTURE_PROGRAMS.filter(nextDate).sort((a, b) =>
  nextDate(a)!.localeCompare(nextDate(b)!),
);

const past = CULTURE_PROGRAMS.filter(program => !nextDate(program)).sort((a, b) =>
  lastDate(b).localeCompare(lastDate(a)),
);
</script>
