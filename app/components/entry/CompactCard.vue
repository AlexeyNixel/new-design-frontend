<template>
  <NuxtLink
    :to="{ name: 'post-slug', params: { slug: post.slug } }"
    class="group block h-full"
  >
    <div
      class="flex gap-4 bg-white rounded-xl hover:shadow-md p-3 transition-all duration-300 h-full"
    >
      <div class="flex-shrink-0 my-auto w-36 h-28 rounded-l-lg overflow-hidden">
        <img
          class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
          :src="imgSrc"
          :alt="post.title"
          @error="notFoundImage"
        >
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-xs text-gray-500">
            {{ dayjs(post.publishedAt).format('DD.MM.YYYY') }}
          </span>
          <UBadge
            v-if="post.tags[0]"
            size="sm"
            color="secondary"
            variant="soft"
          >
            {{ post.tags[0].title }}
          </UBadge>
        </div>

        <div
          class="font-bold text-md text-gray-900 line-clamp-3 mb-2 group-hover:text-primary transition"
        >
          {{ post.title }}
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Post } from '~~/services/types/post.type';
import dayjs from 'dayjs';

interface Props {
  post: Post;
}

const props = defineProps<Props>();
const DEFAULT_IMAGE = '/placeholder.jpg';
const imgSrc = ref(props.post?.preview?.path || DEFAULT_IMAGE);

const notFoundImage = () => {
  if (imgSrc.value !== DEFAULT_IMAGE) {
    imgSrc.value = DEFAULT_IMAGE;
  }
};
</script>
