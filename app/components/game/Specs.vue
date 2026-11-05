<template>
  <ul
    v-if="specs.length"
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
</template>

<script setup lang="ts">
import type { Game } from '~~/services/types/game.type';

// Параметры игры чипами. Используется в hero игры, карточке клуба и панели параметров.
const props = withDefaults(
  defineProps<{
    game: Game;
    tone?: 'default' | 'onDark';
  }>(),
  { tone: 'default' },
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
