<template>
  <NuxtLink
    :to="{ name: 'entry-slug', params: { slug: post.slug } }"
    class="group block h-full"
  >
    <div
      class="relative bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 h-full flex flex-col"
    >
      <!-- Изображение -->
      <div class="relative w-full h-64 md:h-80 overflow-hidden">
        <img
          class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          :src="imgSrc"
          :alt="post.title"
          @error="notFoundImage"
        />

        <!-- Дата -->
        <div class="absolute top-4 left-4">
          <div
            class="flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg"
          >
            <span class="text-sm font-semibold text-gray-500">{{
              dayjs(post.publishedAt).format('MMM')
            }}</span>
            <span class="text-2xl font-bold text-gray-800">{{
              dayjs(post.publishedAt).format('DD')
            }}</span>
            <span class="text-xs text-gray-500">{{
              dayjs(post.publishedAt).format('YYYY')
            }}</span>
          </div>
        </div>

        <!-- Бейдж отдела -->
        <div v-if="post.department" class="absolute bottom-4 left-4">
          <span
            class="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium"
          >
            {{ post.department.title }}
          </span>
        </div>
      </div>

      <!-- Контент -->
      <div class="p-5 flex-1 flex flex-col">
        <h3
          class="text-xl md:text-2xl font-bold text-gray-900 mb-3 line-clamp-3 group-hover:text-primary transition"
        >
          {{ post.title }}
        </h3>

        <p class="text-gray-600 line-clamp-3 mb-4">
          {{ post.description || 'Нажмите чтобы узнать подробности...' }}
        </p>

        <div
          class="mt-auto flex items-center text-primary font-semibold text-sm"
        >
          <span>Читать полностью</span>
          <Icon
            class="ml-2 group-hover:translate-x-2 transition duration-300"
            name="i-heroicons-arrow-right-16-solid"
          />
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Entry } from '~~/services/types/entry.type';
import dayjs from 'dayjs';

interface Props {
  post: Entry;
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
