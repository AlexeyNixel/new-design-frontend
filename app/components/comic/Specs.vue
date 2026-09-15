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
import type { Comic } from '~~/services/types/comic.type';

const props = withDefaults(
  defineProps<{
    comic: Comic;
    variant?: 'card' | 'chips';
    tone?: 'default' | 'onDark';
  }>(),
  { variant: 'card', tone: 'default' },
);

const specs = computed(() => {
  const list: { icon: string; label: string; value: string }[] = [];

  if (props.comic.author) {
    list.push({ icon: 'i-heroicons-pencil-square', label: 'Сценарист', value: props.comic.author });
  }
  if (props.comic.illustrator && props.comic.illustrator !== props.comic.author) {
    list.push({ icon: 'i-heroicons-paint-brush', label: 'Художник', value: props.comic.illustrator });
  }
  if (props.comic.volumeNumber != null) {
    list.push({ icon: 'i-heroicons-book-open', label: 'Том', value: `${props.comic.volumeNumber}` });
  }
  if (props.comic.year != null) {
    list.push({ icon: 'i-heroicons-calendar-days', label: 'Год издания', value: `${props.comic.year}` });
  }
  if (props.comic.ageRating != null) {
    list.push({ icon: 'i-heroicons-cake', label: 'Возраст', value: `${props.comic.ageRating}+` });
  }

  return list;
});
</script>
