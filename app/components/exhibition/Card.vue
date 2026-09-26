<template>
  <a
    :href="exhibitionUrl(exhibition)"
    target="_blank"
    rel="noopener"
    class="group flex flex-col bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
  >
    <!-- Обложки бывают 16:9 и 4:3 — рамка 16:9, у 4:3 срезаются только поля -->
    <div class="relative aspect-video overflow-hidden bg-gray-100">
      <img
        :src="exhibitionCover(exhibition)"
        :alt="`Обложка виртуальной выставки от ${formatDate(exhibition.createdAt)}`"
        width="640"
        height="360"
        :loading="eager ? 'eager' : 'lazy'"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        @error="onImageError"
      >
    </div>

    <div class="flex items-center justify-between gap-3 px-4 py-3 text-sm">
      <span class="text-gray-500">
        {{ formatDate(exhibition.createdAt) }}
      </span>
      <span class="inline-flex items-center gap-1 font-semibold text-primary-500 group-hover:underline">
        Открыть
        <UIcon
          name="i-heroicons-arrow-top-right-on-square"
          class="size-4"
        />
      </span>
    </div>
  </a>
</template>

<script setup lang="ts">
import type { Exhibition } from '~~/services/api/exhibitionsService';

withDefaults(
  defineProps<{
    exhibition: Exhibition;
    /** Первые карточки на экране грузить сразу */
    eager?: boolean;
  }>(),
  { eager: false },
);

const formatDate = useFormateDate();

const onImageError = (event: Event) => {
  (event.target as HTMLImageElement).src = '/placeholder.jpg';
};
</script>
