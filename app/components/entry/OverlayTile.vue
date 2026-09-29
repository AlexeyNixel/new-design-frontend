<template>
  <NuxtLink
    :to="{ name: 'post-slug', params: { slug: post.slug } }"
    class="group relative block h-full overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300"
  >
    <EntryPreviewImage
      :file="post.preview"
      :alt="post.title"
      :sizes="sizes"
      :width="480"
      :height="300"
      img-class="duration-500 group-hover:scale-105"
    />

    <!-- Затемнение снизу, чтобы белый текст читался на любой картинке -->
    <div
      class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
    />

    <div class="absolute inset-x-0 bottom-0 p-3">
      <div class="mb-1 text-xs text-white/80">
        {{ dayjs(post.publishedAt).format('D MMMM YYYY') }}
      </div>
      <h3
        class="text-sm font-bold text-white line-clamp-3 group-hover:text-primary-100 transition-colors"
      >
        {{ post.title }}
      </h3>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Post } from '~~/services/types/post.type';
import dayjs from 'dayjs';

interface Props {
  post: Post;
  sizes?: string;
}

withDefaults(defineProps<Props>(), {
  sizes: '(max-width: 640px) 50vw, 280px',
});
</script>
