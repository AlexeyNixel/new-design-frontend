<template>
  <ul
    v-if="variant === 'chips' && specs.length"
    class="flex flex-wrap gap-2"
  >
    <li
      v-for="spec in specs"
      :key="spec.label"
      class="inline-flex items-center gap-2 rounded-full px-3.5 py-2 ring-1 ring-inset"
      :class="
        tone === 'onDark'
          ? 'bg-white/15 text-white ring-white/25 backdrop-blur-sm'
          : 'bg-primary-700/10 text-primary-800 ring-primary-700/15'
      "
    >
      <Icon
        :name="spec.icon"
        class="h-4 w-4 shrink-0"
        :class="tone === 'onDark' ? 'text-white/80' : 'text-primary-700'"
      />
      <span class="text-sm font-bold">{{ spec.value }}</span>
      <span
        class="text-xs"
        :class="tone === 'onDark' ? 'text-white/70' : 'text-primary-800/70'"
      >{{ spec.label }}</span>
    </li>
  </ul>

  <div
    v-else-if="variant === 'card'"
    class="flex flex-col gap-2.5"
  >
    <p
      v-if="!specs.length"
      class="text-sm text-gray-500"
    >
      Параметры уточняются
    </p>
    <div
      v-for="spec in specs"
      :key="spec.label"
      class="flex items-center gap-3 rounded-xl bg-neutral-100 p-3"
    >
      <div
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-700/10 text-primary-700"
      >
        <Icon
          :name="spec.icon"
          class="h-5 w-5"
        />
      </div>
      <div class="min-w-0">
        <div class="text-xs text-gray-500">
          {{ spec.label }}
        </div>
        <div class="font-bold text-gray-900">
          {{ spec.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Game } from '~~/services/types/game.type';

const props = withDefaults(
  defineProps<{
    game: Game;
    variant?: 'card' | 'chips';
    tone?: 'default' | 'onDark';
  }>(),
  { variant: 'card', tone: 'default' },
);

const playersText = computed(() => {
  const { playerMin, playerMax } = props.game;
  if (playerMin == null && playerMax == null) return '';
  if (playerMin != null && playerMax != null) {
    return playerMin === playerMax ? `${playerMin}` : `${playerMin}–${playerMax}`;
  }
  return `${playerMin ?? playerMax}`;
});

const durationText = computed(() => {
  const { durationMin, durationMax } = props.game;
  if (durationMin == null && durationMax == null) return '';
  if (durationMin != null && durationMax != null && durationMin !== durationMax) {
    return `${durationMin}–${durationMax} мин`;
  }
  const value = durationMin ?? durationMax;
  return durationMax == null && durationMin != null
    ? `от ${value} мин`
    : `${value} мин`;
});

const specs = computed(() => {
  const list: { icon: string; label: string; value: string }[] = [];

  if (playersText.value) {
    list.push({
      icon: 'i-heroicons-user-group',
      label: 'Игроков',
      value: playersText.value,
    });
  }
  if (props.game.playerAge != null) {
    list.push({
      icon: 'i-heroicons-cake',
      label: 'Возраст',
      value: `${props.game.playerAge}+`,
    });
  }
  if (durationText.value) {
    list.push({
      icon: 'i-heroicons-clock',
      label: 'Партия',
      value: durationText.value,
    });
  }
  if (props.game.year != null) {
    list.push({
      icon: 'i-heroicons-calendar-days',
      label: 'Год выпуска',
      value: `${props.game.year}`,
    });
  }

  return list;
});
</script>
