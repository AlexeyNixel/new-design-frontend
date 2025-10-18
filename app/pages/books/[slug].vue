<template>
  <CommonContentContainer v-if="book">
    <!-- Хлебные крошки -->
    <UBreadcrumb :ui="breadcrumbUI" :items="breadcrumbItems" class="mb-6" />

    <div class="max-w-6xl mx-auto">
      <!-- Основная информация о книге -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start lg:gap-6">
        <!-- Левая колонка - обложка и мета-информация -->
        <div class="lg:col-span-1">
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl sm:p-4 sm:rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <img
              :src="book.preview.path"
              :alt="book.title"
              class="w-full max-w-sm mx-auto rounded-lg shadow-md object-cover"
            />
            <div class="flex flex-wrap gap-2 mt-4 justify-center">
              <UBadge
                v-if="book.category"
                :label="book.category"
                color="primary"
                variant="soft"
                class="text-sm"
              />
              <UBadge
                v-if="book.storagePlace"
                :label="book.storagePlace"
                variant="outline"
                class="text-sm"
              />
            </div>
          </div>

          <!-- Кнопка Литрес -->
          <UButton
            v-if="book.link"
            size="xl"
            @click="navigateTo(book.link, { open: { target: '_blank' } })"
            variant="solid"
            color="primary"
            icon="i-heroicons-book-open"
            label="Читать на Литрес"
            class="w-full mt-6"
          />
        </div>

        <!-- Правая колонка - детали книги -->
        <div class="lg:col-span-2 space-y-6">
          <header
            class="bg-white dark:bg-gray-800 rounded-2xl sm:p-4 sm:rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <h1
              class="text-3xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight"
            >
              {{ book.title }}
            </h1>
            <p
              v-if="book.desc"
              class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
            >
              {{ book.desc }}
            </p>
          </header>

          <!-- Контент книги -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 sm:p-4 sm:rounded-xl"
          >
            <div class="ck-content" v-html="book.content"></div>
          </div>
        </div>
      </div>
    </div>
  </CommonContentContainer>
</template>

<script setup lang="ts">
import { useBookApi } from '~~/services/api/bookService';

const route = useRoute();
const bookApi = useBookApi();

const { data: book } = await bookApi.getOneBook(route.params.slug as string);

// Конфигурация хлебных крошек
const breadcrumbUI = {
  link: 'text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400',
  active: 'text-gray-900 dark:text-white font-medium',
};

// Хлебные крошки
const breadcrumbItems = computed(() => [
  {
    label: 'Главная',
    icon: 'i-heroicons-home',
    to: '/',
  },
  {
    label: 'Книги',
    icon: 'i-heroicons-book-open',
    to: '/books',
  },
  {
    label: book.title || 'Книга',
    icon: 'i-heroicons-document-text',
    to: `/books/${book.id}`,
  },
]);

// SEO
useSeoMeta({
  title: book?.title,
  description: book.desc,
});
</script>

<style scoped>
/* Анимации */

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
