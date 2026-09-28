<template>
  <NuxtLink
    :to="`/comics/${comic.slug}`"
    class="group h-full flex flex-col bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-gray-100"
  >
    <!-- Обертка для изображения: обложка всегда видна целиком -->
    <div
      class="relative aspect-[2/3] overflow-hidden bg-gray-100 flex items-center justify-center"
    >
      <img
        :src="cover"
        :srcset="imageSrcset(comic.images[0]?.file)"
        sizes="(max-width: 640px) 50vw, 200px"
        :alt="comic.title"
        width="400"
        height="600"
        class="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
        @error="handleImageError"
      >

      <!-- Возрастной рейтинг -->
      <div
        v-if="comic.ageRating != null"
        class="absolute top-2.5 right-2.5"
      >
        <div
          class="h-8 px-2 min-w-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow"
        >
          <span class="text-xs font-bold text-primary">{{ comic.ageRating }}+</span>
        </div>
      </div>
    </div>

    <!-- Контент карточки: фиксированная структура, чтобы карточки были одной высоты -->
    <div class="p-3 flex flex-1 flex-col">
      <!-- Заголовок: всегда резервирует 2 строки -->
      <h3
        class="min-h-[2.5rem] text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-300"
      >
        {{ comic.title }}
      </h3>

      <!-- Том / автор: строка всегда занимает место -->
      <div class="mt-1.5 min-h-[1.125rem]">
        <div
          v-if="secondaryLine"
          class="flex items-center gap-1 text-[11px] text-gray-500"
        >
          <Icon
            :name="comic.volumeNumber ? 'i-heroicons-bookmark' : 'i-heroicons-pencil-square'"
            class="w-3 h-3 shrink-0"
          />
          <span class="truncate">{{ secondaryLine }}</span>
        </div>
      </div>

      <!-- Ссылка/действие: прижата к низу -->
      <div
        class="mt-auto pt-1.5 flex items-center text-primary font-semibold text-xs"
      >
        <span>Подробнее</span>
        <Icon
          name="i-heroicons-arrow-right-20-solid"
          class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
        />
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Comic } from '~~/services/types/comic.type';

const props = defineProps<{
  comic: Comic;
}>();

const cover = computed(
  () => props.comic.images[0]?.file.path || '/placeholder.jpg',
);

const secondaryLine = computed(() => {
  if (props.comic.volumeNumber) return `Том ${props.comic.volumeNumber}`;

  const { author, illustrator } = props.comic;
  if (author && illustrator && author !== illustrator)
    return `${author} / ${illustrator}`;
  return author || illustrator || '';
});

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.removeAttribute('srcset');
  target.src = '/placeholder.jpg';
};
</script>

<style scoped></style>
