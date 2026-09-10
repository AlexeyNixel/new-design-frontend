<template>
  <div
    v-if="list.length"
    class="flex flex-wrap gap-2"
  >
    <span
      v-for="genre in list"
      :key="genre.tag"
      :class="
        tone === 'onDark'
          ? 'inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white ring-1 ring-inset ring-white/25 backdrop-blur-sm'
          : 'inline-flex items-center gap-1.5 rounded-full bg-primary-700/10 px-3 py-1 text-sm font-semibold text-primary-700'
      "
    >
      <Icon
        v-if="genre.icon"
        :name="genre.icon"
        class="h-3.5 w-3.5"
      />
      {{ genre.label }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Game } from '~~/services/types/game.type';
import { GameGenres, GenresIcons } from '~/constants/gameGenres';

const props = withDefaults(
  defineProps<{
    game: Game;
    tone?: 'default' | 'onDark';
  }>(),
  { tone: 'default' },
);

const list = computed(() => {
  return (props.game.genres?.split('; ') ?? [])
    .map(tag => tag.trim())
    .filter(Boolean)
    .map(tag => ({
      tag,
      label: GameGenres[tag as keyof typeof GameGenres] || tag,
      icon: GenresIcons[tag as keyof typeof GenresIcons] || '',
    }));
});
</script>
