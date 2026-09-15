<template>
  <div
    v-if="list.length"
    class="flex flex-wrap gap-2"
  >
    <span
      v-for="genre in list"
      :key="genre.id"
      :class="
        tone === 'onDark'
          ? 'inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white ring-1 ring-inset ring-white/25 backdrop-blur-sm'
          : 'inline-flex items-center gap-1.5 rounded-full bg-primary-700/10 px-3 py-1 text-sm font-semibold text-primary-700'
      "
    >
      {{ genre.title }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Comic } from '~~/services/types/comic.type';

const props = withDefaults(
  defineProps<{
    comic: Comic;
    tone?: 'default' | 'onDark';
  }>(),
  { tone: 'default' },
);

const list = computed(() => props.comic.genres.map(({ genre }) => genre));
</script>
