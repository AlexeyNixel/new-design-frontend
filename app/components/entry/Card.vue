<template>
  <NuxtLink
    :to="{ name: 'entry-slug', params: { slug: entry.slug } }"
    class="group block h-full"
  >
    <div
      class="relative flex flex-col h-full bg-white w-full rounded-2xl overflow-hidden transition-all duration-300 hover:shadow hover:-translate-y-1"
    >
      <!-- Обертка для изображения с эффектом -->
      <div class="relative w-full h-56 overflow-hidden">
        <!-- Изображение с эффектом зума -->
        <img
          class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          :src="entry?.preview?.path"
          :alt="entry.title"
        />
        <div class="absolute top-4 left-4">
          <div
            class="flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg"
          >
            <span class="text-sm font-semibold text-gray-500">
              {{ dayjs(entry.publishedAt).format('MMM') }}
            </span>
            <span class="text-2xl font-bold text-gray-800">
              {{ dayjs(entry.publishedAt).format('DD') }}
            </span>
            <span class="text-xs text-gray-500">
              {{ dayjs(entry.publishedAt).format('YYYY') }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex-1 p-5 md:p-6 flex flex-col">
        <div
          class="text-lg md:text-xl line-clamp-5 font-bold text-gray-900 mb-3 group-hover:text-primary"
        >
          {{ entry.title }}
        </div>

        <div class="mt-auto pt-4 border-t border-gray-100">
          <div class="flex items-center justify-between">
            <div v-if="entry.department" class="flex items-center space-x-2">
              <div
                class="w-8 h-8 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full flex items-center justify-center"
              >
                <span class="text-primary font-bold text-sm">
                  {{ entry.department.title?.charAt(0) || 'A' }}
                </span>
              </div>
              <span class="text-sm text-gray-600">
                {{ entry.department.title }}
              </span>
            </div>

            <div class="flex items-center text-primary font-semibold text-sm">
              <span>Читать</span>
              <Icon name="i-heroicons-arrow-right-16-solid" />
            </div>
          </div>
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
</script>

<style scoped></style>
