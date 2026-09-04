<template>
  <NuxtLink
    :to="{ name: 'books-slug', params: { slug: book.id } }"
    class="group h-full flex flex-col bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-gray-100"
  >
    <!-- Обертка для изображения: обложка всегда видна целиком -->
    <div
      class="relative aspect-[2/3] overflow-hidden bg-gray-100 flex items-center justify-center"
    >
      <img
        :src="book?.preview?.path"
        :alt="book.title"
        class="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
        @error="handleImageError"
      >

      <!-- Иконка типа (видео/книга) -->
      <div class="absolute top-2.5 right-2.5">
        <div
          class="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow"
        >
          <Icon
            :name="
              book.isVideo
                ? 'i-heroicons-video-camera'
                : 'i-heroicons-book-open'
            "
            class="w-4 h-4 text-primary"
          />
        </div>
      </div>
    </div>

    <!-- Контент карточки: фиксированная структура, чтобы карточки были одной высоты -->
    <div class="p-3 flex flex-1 flex-col">
      <!-- Заголовок книги: всегда резервирует 2 строки -->
      <h3
        class="min-h-[2.5rem] text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-300"
      >
        {{ book.title }}
      </h3>

      <!-- Место хранения: строка всегда занимает место -->
      <div class="mt-1.5 min-h-[1.125rem]">
        <div
          v-if="book.place"
          class="flex items-center gap-1 text-[11px] text-gray-500"
        >
          <Icon
            name="i-heroicons-map-pin"
            class="w-3 h-3 shrink-0"
          />
          <span class="truncate">{{ book.place }}</span>
        </div>
      </div>

      <!-- Ссылка/действие: прижата к низу -->
      <div
        class="mt-auto pt-1.5 flex items-center text-primary font-semibold text-xs"
      >
        <span>{{ book.isVideo ? 'Смотреть' : 'Подробнее' }}</span>
        <Icon
          name="i-heroicons-arrow-right-20-solid"
          class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
        />
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Book } from '~~/services/types/book.type';

defineProps<{
  book: Book;
}>();

// Обработка ошибок изображения
const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.src = 'https://placehold.co/320x480/e5e7eb/6b7280?text=Обложка+книги';

  // Можно использовать иконку вместо placeholder
  // target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='400' viewBox='0 0 320 400'%3E%3Crect width='320' height='400' fill='%23e5e7eb'/%3E%3Cpath d='M80 120L160 80L240 120V280L160 320L80 280V120Z' fill='%239ca3af'/%3E%3Cpath d='M80 120L160 160L240 120M160 160V320' stroke='%236b7280' stroke-width='4' fill='none'/%3E%3C/svg%3E`;
};
</script>

<style scoped></style>
