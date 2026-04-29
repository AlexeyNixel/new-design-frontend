<template>
  <NuxtLink
    :to="{ name: 'entry-slug', params: { slug: entry.slug } }"
    class="group block"
  >
    <div
      class="flex gap-4 bg-white rounded-xl p-3 hover:shadow-md transition-all duration-300"
    >
      <!-- Миниатюра -->
      <div class="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
        <img
          class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
          :src="imgSrc"
          :alt="entry.title"
          @error="notFoundImage"
        />
      </div>

      <!-- Текст -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-xs text-gray-500">
            {{ dayjs(entry.publishedAt).format('DD.MM.YYYY') }}
          </span>
          <span v-if="entry.department" class="text-xs text-primary">
            {{ entry.department.title }}
          </span>
        </div>

        <h4
          class="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary transition"
        >
          {{ entry.title }}
        </h4>

        <div class="flex items-center text-primary text-sm">
          <span>Читать</span>
          <Icon
            class="ml-1 w-4 h-4 group-hover:translate-x-1 transition"
            name="i-heroicons-arrow-right-16-solid"
          />
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { type Entry } from '~~/services/types/entry.type';
import dayjs from 'dayjs';

interface Props {
  entry: Entry;
}

const props = defineProps<Props>();
const DEFAULT_IMAGE = '/placeholder.jpg';
const imgSrc = ref(props.entry?.preview?.path || DEFAULT_IMAGE);

const notFoundImage = () => {
  if (imgSrc.value !== DEFAULT_IMAGE) {
    imgSrc.value = DEFAULT_IMAGE;
  }
};
</script>
