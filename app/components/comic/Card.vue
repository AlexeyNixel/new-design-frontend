<template>
  <NuxtLink
    :to="`/comics/${comic.slug}`"
    class="group h-full bg-white rounded-2xl overflow-hidden shadow transition-all duration-300 flex flex-col w-full max-w-[320px] hover:-translate-y-2 border border-gray-100"
    :class="compact ? '' : 'min-h-[560px]'"
  >
    <!-- Обертка для изображения -->
    <div
      class="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200"
      :class="compact ? 'h-56' : 'h-80'"
    >
      <img
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        :src="cover"
        :alt="comic.title"
        loading="lazy"
        @error="handleImageError"
      >

      <UBadge
        v-if="volumeLabel"
        :label="volumeLabel"
        color="primary"
        class="absolute top-3 left-3 rounded-full"
      />

      <UBadge
        v-if="comic.year"
        class="absolute top-3 right-3 bg-black/70 font-bold px-3 py-1.5 rounded-full"
        :label="String(comic.year)"
      />

      <div
        v-if="comic.ageRating != null"
        class="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg flex items-center gap-1"
      >
        <Icon
          name="i-heroicons-cake"
          class="w-4 h-4 text-primary"
        />
        <span class="font-bold text-gray-900">{{ comic.ageRating }}+</span>
      </div>
    </div>

    <!-- Контент карточки -->
    <div class="p-4 md:p-5 flex-1 flex flex-col">
      <h3
        class="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight"
      >
        {{ comic.title }}
      </h3>

      <p
        v-if="authorLine"
        class="text-sm text-gray-500 mb-3"
      >
        {{ authorLine }}
      </p>

      <div
        v-if="comic.genres.length"
        class="mb-4"
      >
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="{ genre } in comic.genres"
            :key="genre.id"
            :label="genre.title"
            color="info"
            variant="soft"
          />
        </div>
      </div>

      <div class="pt-4 border-t border-gray-100 mt-auto">
        <div class="flex items-center justify-between">
          <div class="flex items-center text-primary font-semibold text-sm">
            <span>Подробнее</span>
            <Icon
              name="i-heroicons-arrow-right-20-solid"
              class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Comic } from '~~/services/types/comic.type';

const props = defineProps<{
  comic: Comic;
  compact?: boolean;
}>();

const cover = computed(() => props.comic.images[0]?.file.path || '/placeholder.jpg');

const volumeLabel = computed(() => {
  if (!props.comic.volumeNumber) return '';
  return `Том ${props.comic.volumeNumber}`;
});

const authorLine = computed(() => {
  const { author, illustrator } = props.comic;
  if (author && illustrator && author !== illustrator) return `${author} / ${illustrator}`;
  return author || illustrator || '';
});

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.src = '/placeholder.jpg';
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
