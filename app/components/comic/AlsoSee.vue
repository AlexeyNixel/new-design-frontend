<template>
  <section
    v-if="list.length"
    class="mt-14"
  >
    <h2 class="text-2xl font-bold text-gray-900">
      {{ isSeries ? 'Другие тома серии' : 'Смотрите также' }}
    </h2>
    <p class="mt-1 text-sm text-gray-500">
      {{ isSeries ? seriesTitle : 'Другие комиксы из нашей коллекции' }}
    </p>
    <div
      class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
    >
      <ComicCard
        v-for="comic in list"
        :key="comic.id"
        :comic="comic"
        compact
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Comic } from '~~/services/types/comic.type';

const props = defineProps<{
  comics: Comic[] | null | undefined;
  excludeId?: string;
  /** Если задано — заголовок и подпись отражают, что это часть той же серии. */
  seriesTitle?: string | null;
}>();

const isSeries = computed(() => !!props.seriesTitle);

const list = computed(() => {
  return (props.comics ?? []).filter(comic => comic.id !== props.excludeId).slice(0, 5);
});
</script>
