<template>
  <NuxtLink
    :to="{ name: 'post-slug', params: { slug: post.slug } }"
    class="group block h-full"
  >
    <div
      class="flex bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full"
    >
      <!-- Картинка вплотную к краю карточки и на всю её высоту: 160×128 — это 5:4,
           формат большинства превью с бэкенда (420×336); если текст выше,
           картинка всё равно видна целиком (object-contain в EntryPreviewImage) -->
      <div class="shrink-0 w-40 min-h-32 self-stretch overflow-hidden">
        <EntryPreviewImage
          :file="post.preview"
          :alt="post.title"
          sizes="160px"
          :width="160"
          :height="128"
          img-class="duration-300 group-hover:scale-105"
        />
      </div>

      <div class="flex-1 min-w-0 p-3">
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
            {{ post.tags[0].tag.title }}
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

defineProps<Props>();
</script>
