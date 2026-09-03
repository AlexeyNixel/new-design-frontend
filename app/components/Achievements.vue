<script setup lang="ts">
import { useAchievements } from '~~/services/api/achievment.api';

const achievementApi = useAchievements();

const achievements = await achievementApi.getAllAchievements();

const ICON_RULES: { test: RegExp; icon: string }[] = [
  { test: /книг/i, icon: 'i-heroicons-book-open' },
  { test: /ф[иі]?льм|флм|плёнк|плен|кино|видео/i, icon: 'i-heroicons-film' },
  { test: /игр|настол/i, icon: 'i-heroicons-puzzle-piece' },
  { test: /пластинк|винил|музык|аудио|диск/i, icon: 'i-heroicons-musical-note' },
  { test: /журнал|период|газет/i, icon: 'i-heroicons-newspaper' },
  { test: /читател|посетит|польз|гост/i, icon: 'i-heroicons-users' },
  { test: /лет|год|опыт/i, icon: 'i-heroicons-calendar-days' },
];

const iconFor = (label: string): string => {
  return ICON_RULES.find(rule => rule.test.test(label))?.icon ?? 'i-heroicons-sparkles';
};
</script>

<template>
  <div
    class="rounded-2xl border border-white/20 bg-white/10 p-4 shadow-lg backdrop-blur-md sm:p-5 lg:p-6"
  >
    <div class="grid grid-cols-2 md:grid-cols-4">
      <div
        v-for="item in achievements"
        :key="item.id"
        class="flex flex-col items-center gap-1 px-2 py-3 text-center text-white border-white/15 md:py-1 [&:nth-child(odd)]:border-r last:border-r-0 md:[&:nth-child(odd)]:border-r-0 md:border-l md:first:border-l-0 [&:nth-child(n+3)]:border-t md:[&:nth-child(n+3)]:border-t-0"
      >
        <Icon
          :name="iconFor(item.label)"
          class="w-5 h-5 text-white/70 sm:w-6 sm:h-6"
        />
        <div class="text-2xl font-bold leading-none sm:text-3xl lg:text-4xl">
          {{ item.count }}
        </div>
        <div class="text-[11px] leading-tight text-white/80 sm:text-xs">
          {{ item.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
