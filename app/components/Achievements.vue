<script setup lang="ts">
import { useAchievements } from '~~/services/api/achievment.api';
import type { Achievement } from '~~/services/types/achievment.type';

const NuxtLink = resolveComponent('NuxtLink');
const achievementApi = useAchievements();

const achievements = await achievementApi.getAllAchievements();

const ICON_RULES: { test: RegExp; icon: string; to?: string }[] = [
  { test: /книг/i, icon: 'i-heroicons-book-open', to: '/books' },
  { test: /ф[иі]?льм|флм|плёнк|плен|кино|видео/i, icon: 'i-heroicons-film', to: '/page/mediateka' },
  { test: /игр|настол/i, icon: 'i-heroicons-puzzle-piece', to: '/games' },
  { test: /пластинк|винил|музык|аудио|диск/i, icon: 'i-heroicons-musical-note', to: '/page/mediateka' },
  { test: /журнал|период|газет/i, icon: 'i-heroicons-newspaper' },
  { test: /читател|посетит|польз|гост/i, icon: 'i-heroicons-users' },
  { test: /лет|год|опыт/i, icon: 'i-heroicons-calendar-days' },
];

const ruleFor = (label: string) => ICON_RULES.find(rule => rule.test.test(label));

const iconFor = (label: string): string => ruleFor(label)?.icon ?? 'i-heroicons-sparkles';

/** Ссылка из админки в приоритете, иначе — раздел сайта по названию */
const linkFor = (item: Achievement): string | undefined =>
  item.url || ruleFor(item.label)?.to;
</script>

<template>
  <div
    class="rounded-2xl border border-white/20 bg-white/10 p-4 shadow-lg backdrop-blur-md sm:p-5 lg:p-6"
  >
    <div class="grid grid-cols-2 md:grid-cols-4">
      <component
        :is="linkFor(item) ? NuxtLink : 'div'"
        v-for="item in achievements"
        :key="item.id"
        :to="linkFor(item)"
        :aria-label="linkFor(item) ? `${item.label}: ${item.count} — перейти` : undefined"
        class="group flex flex-col items-center gap-1 px-2 py-3 text-center text-white border-white/15 md:py-1 [&:nth-child(odd)]:border-r last:border-r-0 md:[&:nth-child(odd)]:border-r-0 md:border-l md:first:border-l-0 [&:nth-child(n+3)]:border-t md:[&:nth-child(n+3)]:border-t-0"
        :class="linkFor(item) && 'rounded-xl transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white/70'"
      >
        <Icon
          :name="iconFor(item.label)"
          class="w-5 h-5 text-white/70 transition-colors group-hover:text-white sm:w-6 sm:h-6"
        />
        <div class="text-2xl font-bold leading-none sm:text-3xl lg:text-4xl">
          {{ item.count }}
        </div>
        <div class="text-[11px] leading-tight text-white/80 sm:text-xs">
          {{ item.label }}
          <Icon
            v-if="linkFor(item)"
            name="i-heroicons-arrow-right-20-solid"
            class="w-3 h-3 align-[-2px] opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0"
          />
        </div>
      </component>
    </div>
  </div>
</template>

<style scoped></style>
