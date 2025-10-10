<template>
  <NuxtLink
    :to="{ name: 'entry-slug', params: { slug: entry.slug } }"
    class="news-tile"
  >
    <div class="news-preview">
      <img :src="entry?.preview?.path" :alt="entry.title" loading="lazy" />
    </div>

    <div class="news-content">
      <h2 class="news-title">{{ entry.title }}</h2>
      <p class="news-description">{{ entry.desc }}</p>

      <div class="news-meta">
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
</script>

<style scoped>
@import '~/assets/css/main.css';

.news-tile {
  @apply bg-white rounded overflow-hidden  shadow-primary-200 mb-8 transition-all
  flex items-stretch min-h-64;
}

.news-tile:hover {
  @apply -translate-y-1 shadow-xl;
}

.news-preview {
  @apply w-72 min-w-72 overflow-hidden relative shrink-0;
}

.news-preview img {
  @apply w-full h-full object-cover transition;
}

.news-tile:hover .news-preview img {
  transform: scale(1.05);
}

.news-content {
  @apply p-6 flex flex-col justify-between w-full;
}

.news-title {
  @apply text-2xl font-bold text-neutral-700 mb-3 overflow-hidden;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.news-description {
  @apply text-neutral-700 mb-4 grow hidden;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-meta {
  @apply flex justify-between items-center my-auto pt-4 border-t-1 border-t-neutral-200;
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
