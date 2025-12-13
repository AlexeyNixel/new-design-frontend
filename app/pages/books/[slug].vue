<template>
  <CommonContentContainer v-if="book">
    <!-- Хлебные крошки -->
    <UBreadcrumb :ui="breadcrumbUI" :items="breadcrumbItems" class="mb-8" />

    <div class="max-w-7xl mx-auto px-4">
      <!-- Основная информация о книге -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Левая колонка - обложка и мета-информация -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Обложка книги с тенями -->
          <div class="relative group">
            <div
              class="absolute -inset-4 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"
            ></div>
            <div
              class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div
                class="aspect-[3/4] w-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
              >
                <img
                  :src="book.preview.path"
                  :alt="book.title"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <!-- Мета-информация -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3
              class="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
            >
              <Icon
                name="i-heroicons-information-circle"
                class="text-primary"
              />
              Детали книги
            </h3>

            <div class="space-y-4">
              <!-- Место хранения -->
              <div class="flex items-start gap-3">
                <Icon
                  name="i-heroicons-map-pin"
                  class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0"
                />
                <div>
                  <p class="text-sm text-gray-500">Место хранения</p>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ book.place }}
                  </p>
                </div>
              </div>

              <!-- Дата публикации -->
              <div class="flex items-start gap-3">
                <Icon
                  name="i-heroicons-calendar"
                  class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0"
                />
                <div>
                  <p class="text-sm text-gray-500">Добавлена</p>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ formatDate(book.createdAt) }}
                  </p>
                </div>
              </div>

              <!-- Статус -->
              <div class="flex items-start gap-3">
                <Icon
                  name="i-heroicons-check-badge"
                  class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0"
                />
                <div>
                  <p class="text-sm text-gray-500">Статус</p>
                  <UBadge
                    :label="book.isDeleted ? 'Архив' : 'Доступна'"
                    :color="book.isDeleted ? 'gray' : 'green'"
                    variant="soft"
                    class="mt-1"
                  />
                </div>
              </div>
            </div>

            <!-- Кнопка Литрес -->
            <UButton
              v-if="book.litresLink"
              @click="navigateTo(book.litresLink, { external: true })"
              variant="solid"
              color="orange"
              icon="i-heroicons-shopping-cart"
              label="Купить на Литрес"
              class="w-full mt-6"
              :ui="{ rounded: 'rounded-xl' }"
            />
          </div>

          <!-- Подборки -->
          <div
            v-if="book.collections?.length"
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3
              class="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
            >
              <Icon name="i-heroicons-rectangle-stack" class="text-primary" />
              В подборках
            </h3>
            <div class="space-y-2">
              <UBadge
                v-for="collection in book.collections"
                :key="collection.id"
                :label="collection.label"
                color="amber"
                variant="outline"
                class="w-full justify-start cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                @click="navigateTo(`/collection/${collection.slug}`)"
              >
                <template #leading>
                  <Icon name="i-heroicons-bookmark" class="w-4 h-4" />
                </template>
              </UBadge>
            </div>
          </div>
        </div>

        <!-- Правая колонка - детали книги -->
        <div class="lg:col-span-3 space-y-8">
          <!-- Заголовок и описание -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 relative overflow-hidden"
          >
            <!-- Декоративный фон -->
            <div
              class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-50 to-transparent dark:from-amber-900/10 rounded-full -translate-y-32 translate-x-32"
            ></div>

            <div class="relative">
              <!-- Категория -->
              <div class="mb-4">
                <UBadge
                  :label="book.isVideo ? 'Видео' : 'Книга'"
                  :color="book.isVideo ? 'secondary' : 'warning'"
                  variant="subtle"
                  class="text-sm"
                />
              </div>

              <!-- Название -->
              <h1
                class="text-4xl lg:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-6 leading-tight"
              >
                {{ book.title }}
              </h1>

              <!-- Автор (если есть в данных) -->
              <div
                class="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-6"
              >
                <Icon name="i-heroicons-user" class="w-5 h-5" />
                <span class="text-lg">{{
                  extractAuthor(book.description) || 'Автор не указан'
                }}</span>
              </div>

              <!-- Краткое описание -->
              <div class="prose prose-lg dark:prose-invert max-w-none">
                <p
                  class="text-xl text-gray-700 dark:text-gray-300 leading-relaxed italic border-l-4 border-primary pl-4 py-2 bg-amber-50/50 dark:bg-amber-900/10 rounded-r-lg"
                >
                  {{ book.description }}
                </p>
              </div>
            </div>
          </div>

          <!-- Содержание книги -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <!-- Заголовок секции -->
            <div
              class="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 px-8 py-6 border-b border-gray-200 dark:border-gray-700"
            >
              <h2
                class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3"
              >
                <Icon name="i-heroicons-document-text" class="text-primary" />
                Содержание
              </h2>
            </div>

            <!-- Контент -->
            <div class="p-8">
              <div
                class="ck-content prose prose-lg dark:prose-invert max-w-none"
                v-html="book.content"
              ></div>

              <!-- Декоративный элемент в конце -->
              <div
                class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center"
              >
                <Icon
                  name="i-heroicons-bookmark"
                  class="w-12 h-12 text-primary mx-auto mb-4"
                />
                <p class="text-gray-500 dark:text-gray-400 italic">
                  Конец произведения
                </p>
              </div>
            </div>
          </div>

          <!-- Дополнительная информация -->
          <div class="">
            <div
              class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3
                class="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
              >
                <Icon name="i-heroicons-qr-code" class="text-blue-500" />
                Техническая информация
              </h3>
              <div class="space-y-3">
                <div
                  class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700"
                >
                  <span class="text-gray-600 dark:text-gray-400">ISBN</span>
                  <span class="font-mono text-gray-900 dark:text-white">{{
                    extractISBN(book.description) || 'Не указан'
                  }}</span>
                </div>
                <div
                  class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700"
                >
                  <span class="text-gray-600 dark:text-gray-400">Тип</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{
                    book.isVideo ? 'Видео' : 'Текст'
                  }}</span>
                </div>
                <div class="flex items-center justify-between py-2">
                  <span class="text-gray-600 dark:text-gray-400">Слаг</span>
                  <span
                    class="font-mono text-sm text-gray-900 dark:text-white"
                    >{{ book.slug }}</span
                  >
                </div>
              </div>
            </div>
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

const { data: book } = await bookApi.getOneBook(route.params.slug as string, {
  include: 'preview, collections',
});

// Вспомогательные функции
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const extractAuthor = (description: string) => {
  // Пытаемся извлечь автора из описания
  const match = description.match(/^([^\.]+)\./);
  return match ? match[1].trim() : null;
};

const extractISBN = (description: string) => {
  const match = description.match(/ISBN\s+([\d\-]+)/);
  return match ? match[1] : null;
};

// Действия
const printBookInfo = () => {
  window.print();
};

const shareBook = () => {
  if (navigator.share) {
    navigator.share({
      title: book.title,
      text: book.description,
      url: window.location.href,
    });
  } else {
    navigator.clipboard.writeText(window.location.href);
    const toast = useToast();
    toast.add({ title: 'Ссылка скопирована в буфер', color: 'success' });
  }
};

const addToFavorites = () => {
  const toast = useToast();
  toast.add({ title: 'Добавлено в избранное', color: 'success' });
};

// Конфигурация хлебных крошек
const breadcrumbUI = {
  link: 'text-gray-600 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400 transition-colors',
  active: 'text-gray-900 dark:text-white font-medium',
  wrapper: 'flex items-center gap-2',
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
    to: `/books/${book.slug}`,
  },
]);

// SEO
useSeoMeta({
  title: book?.title + ' | Библиотека',
  description: book.description,
  ogImage: book.preview?.path,
  ogTitle: book?.title,
  ogDescription: book.description,
});
</script>

<style scoped></style>
