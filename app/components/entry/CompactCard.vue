<!-- Компактная карточка новости: превью слева, дата и заголовок справа.
     Используется в «Анонсах» и «Новостях партнёров» на главной.
     stackOnXl — на широких экранах превью уходит наверх (для сетки в 5 колонок). -->
<template>
  <NuxtLink
    :to="{ name: 'post-slug', params: { slug: post.slug } }"
    class="group flex items-stretch bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    :class="{ 'xl:flex-col': stackOnXl }"
  >
    <!-- 5:4 — формат большинства превью с бэкенда. Превью растянуто абсолютно,
         чтобы вертикальные картинки не вытягивали карточку по высоте -->
    <div
      class="relative shrink-0 w-32 sm:w-40 min-h-28 overflow-hidden"
      :class="{ 'xl:w-full xl:min-h-0 xl:aspect-[16/10]': stackOnXl }"
    >
      <EntryPreviewImage
        :file="post.preview"
        :alt="post.title"
        :sizes="stackOnXl ? '(min-width: 1280px) 240px, 160px' : '160px'"
        :width="160"
        :height="128"
        img-class="duration-300 group-hover:scale-105"
        class="absolute! inset-0"
      />
    </div>
    <div
      class="flex-1 min-w-0 px-3 py-2 flex flex-col justify-center"
      :class="{ 'xl:justify-start xl:py-3': stackOnXl }"
    >
      <span class="text-xs text-gray-500 mb-0.5">
        {{ dayjs(post.publishedAt).format('D MMMM YYYY') }}
      </span>
      <span
        class="font-semibold text-sm text-gray-900 line-clamp-3 group-hover:text-primary transition-colors"
      >
        {{ post.title }}
      </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Post } from '~~/services/types/post.type';
import dayjs from 'dayjs';

defineProps<{
  post: Post;
  stackOnXl?: boolean;
}>();
</script>
