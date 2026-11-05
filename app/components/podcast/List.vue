<template>
  <!-- Вкладка «Подкасты» в блоке «Книжная полка» на главной -->
  <div class="py-4">
    <div
      v-if="podcasts.length"
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <PodcastCard
        v-for="podcast in podcasts"
        :key="podcast.id"
        :podcast="podcast"
      />
    </div>
    <p
      v-else
      class="py-10 text-center text-gray-500"
    >
      Подкасты скоро появятся.
    </p>
  </div>
</template>

<script setup lang="ts">
import { usePodcastApi } from '~~/services/api/podcastService';
import { MOCK_PODCASTS } from '~~/services/mocks/podcasts.mock';
import type { Podcast } from '~~/services/types/podcast.type';

const podcastApi = usePodcastApi();

const podcasts = ref<Podcast[]>([]);

// Пока в админке не загружены реальные аудиофайлы, показываем моковые подкасты.
// Как только появятся записи в БД — они заменят моковые данные.
try {
  const res = await podcastApi.getAllPodcasts({ include: 'audio', limit: 20 });
  podcasts.value = res.data?.length ? res.data : MOCK_PODCASTS;
}
catch {
  podcasts.value = MOCK_PODCASTS;
}
</script>

<style scoped></style>
