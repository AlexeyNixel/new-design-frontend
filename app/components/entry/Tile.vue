<template>
  <NuxtLink
    :to="{ name: 'entry-slug', params: { slug: entry.slug } }"
    class="bg-white rounded overflow-hidden shadow-primary-200 mb-8 transition-all flex items-stretch min-h-64 hover:-translate-y-1 hover:shadow-xl hover:transform: scale(1.05);"
  >
    <div class="w-72 min-w-72 overflow-hidden relative shrink-0">
      <img
        class="w-full h-full object-cover transition hover:transform: scale(1.05);"
        :onerror="notFoundImage"
        :src="entry?.preview?.path"
        :alt="entry.title"
        loading="lazy"
      />
    </div>

    <div class="p-6 flex flex-col justify-between w-full">
      <h2 class="text-2xl font-bold text-neutral-700 mb-3 overflow-hidden">
        {{ entry.title }}
      </h2>
      <div v-html="entry.description" class="text-neutral-700 mb-4 grow" />

      <div
        class="flex justify-between items-center my-auto pt-4 border-t-1 border-t-neutral-200"
      >
        <span class="news-date">{{ entry.department.title }}</span>
        <span class="news-date">{{ formateDate(entry.publishedAt) }}</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Entry } from '~~/services/types/entry.type';

defineProps<{
  entry: Entry;
}>();

const formateDate = useFormateDate();

const notFoundImage = (e: any) => {
  e.target.src = 'https://cdn1.flamp.ru/b1aea1d7e4be8c57b1e414678d5756f0.png';
};
</script>

<style scoped>
@import '~/assets/css/main.css';

.news-tile:hover .news-preview img {
  transform: scale(1.05);
}

.news-date {
  color: #888;
  font-size: 0.9rem;
}

/* Адаптивность */
@media (max-width: 768px) {
  .news-tile {
    flex-direction: column;
    min-height: auto;
  }

  .news-preview {
    width: 100%;
    min-width: 100%;
    height: 200px;
  }

  .news-content {
    padding: 20px;
  }

  .news-title {
    font-size: 1.3rem;
  }

  .news-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .news-preview {
    height: 180px;
  }

  .news-content {
    padding: 16px;
  }

  .news-title {
    font-size: 1.2rem;
  }
}
</style>
