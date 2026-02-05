<template>
  <NuxtLink
    :to="{ name: 'books-slug', params: { slug: book.id } }"
    class="group min-h-[600px] h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow transition-all duration-300 hover:-translate-y-2 border border-gray-100 my-4"
  >
    <!-- Обертка для изображения -->
    <div
      class="relative h-72 md:h-80 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <img
        :src="book?.preview?.path"
        :alt="book.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        @error="handleImageError"
      />

      <!-- Иконка типа (видео/книга) -->
      <div class="absolute top-4 right-4">
        <div
          class="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
        >
          <Icon
            :name="
              book.isVideo
                ? 'i-heroicons-video-camera'
                : 'i-heroicons-book-open'
            "
            class="w-5 h-5 text-primary"
          />
        </div>
      </div>

      <!-- Место хранения -->
      <div class="absolute bottom-4 right-4">
        <div
          class="bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full"
        >
          {{ truncateText(book.place, 15) }}
        </div>
      </div>
    </div>

    <!-- Контент карточки -->
    <div class="p-4 md:p-5 flex-1 flex flex-col">
      <!-- Заголовок книги -->
      <h3
        class="text-lg font-bold text-gray-900 mb-3 line-clamp-3 group-hover:text-primary transition-colors duration-300"
      >
        {{ book.title }}
      </h3>

      <!-- Краткое описание -->
      <div
        v-if="book.description"
        class="text-gray-600 text-sm mb-4 line-clamp-3"
        v-html="book.description"
      />

      <!-- Мета-информация -->
      <div class="pt-4 border-t border-gray-100 mt-auto">
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <!-- Основная информация -->
          <div class="flex items-center gap-3">
            <!-- Иконка типа -->
            <div
              class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center"
            >
              <Icon
                :name="
                  book.isVideo
                    ? 'i-heroicons-film'
                    : 'i-heroicons-document-text'
                "
                class="w-5 h-5 text-primary"
              />
            </div>

            <div>
              <div class="text-xs text-gray-500">Добавлена</div>
              <div class="text-sm font-medium text-gray-900">
                {{ formatDate(book.createdAt) }}
              </div>
            </div>
          </div>

          <!-- Ссылка/действие -->
          <div class="flex items-center text-primary font-semibold text-sm">
            <span>{{ book.isVideo ? 'Смотреть' : 'Подробнее' }}</span>
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
import type { Book } from '~~/services/types/book.type';

defineProps<{
  book: Book;
}>();

// Форматирование даты
const formatDate = (dateString: string, format: string = 'DD MMMM YYYY') => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  if (format === 'DD.MM.YYYY') {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  return date.toLocaleDateString('ru-RU', options);
};

// Обрезка текста
const truncateText = (text: string, maxLength: number) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Обработка ошибок изображения
const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.src = 'https://placehold.co/320x400/e5e7eb/6b7280?text=Обложка+книги';

  // Можно использовать иконку вместо placeholder
  // target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='400' viewBox='0 0 320 400'%3E%3Crect width='320' height='400' fill='%23e5e7eb'/%3E%3Cpath d='M80 120L160 80L240 120V280L160 320L80 280V120Z' fill='%239ca3af'/%3E%3Cpath d='M80 120L160 160L240 120M160 160V320' stroke='%236b7280' stroke-width='4' fill='none'/%3E%3C/svg%3E`;
};
</script>

<style scoped></style>
