<template>
  <CommonContentContainer v-if="page">
    <!-- Хлебные крошки -->
    <UBreadcrumb :ui="breadcrumbUI" :items="breadcrumbItems" class="mb-6" />

    <div class="max-w-6xl mx-auto">
      <!-- Заголовок страницы -->
      <div class="text-center mb-10">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-6"
        >
          <Icon name="i-heroicons-document-text" class="text-2xl text-white" />
        </div>
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {{ page.title }}
        </h1>
        <div
          class="flex items-center justify-center gap-4 text-gray-500 dark:text-gray-400 text-sm"
        >
          <div class="flex items-center gap-1">
            <Icon name="i-heroicons-calendar" class="w-4 h-4" />
            <span>{{ formatDate(page.createdAt) }}</span>
          </div>
          <div class="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div class="flex items-center gap-1">
            <Icon name="i-heroicons-clock" class="w-4 h-4" />
            <span>{{ readingTime }} мин чтения</span>
          </div>
        </div>
      </div>

      <!-- Основной контент -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <!-- Декоративный верхний бордер -->
        <div
          class="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        ></div>

        <div class="p-8 md:p-10">
          <div class="ck-content" v-html="page.content"></div>
        </div>

        <!-- Декоративный нижний бордер -->
        <div
          class="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
        ></div>
      </div>

      <!-- Мета-информация в футере -->
      <div
        class="mt-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <Icon
              name="i-heroicons-information-circle"
              class="w-5 h-5 text-gray-400"
            />
            <span class="text-sm text-gray-600 dark:text-gray-400">
              Последнее обновление:
              {{ formatDate(page.updatedAt || page.createdAt) }}
            </span>
          </div>
          <UBadge
            :label="page.isDeleted ? 'Скрыта' : 'Активна'"
            :color="page.isDeleted ? 'gray' : 'green'"
            variant="soft"
            size="sm"
          />
        </div>
      </div>

      <!-- Кнопки действий -->
      <div class="mt-8 flex flex-col sm:flex-row gap-3">
        <UButton
          icon="i-heroicons-arrow-left"
          label="Назад к списку"
          variant="outline"
          color="gray"
          class="flex-1"
          to="/pages"
        />
        <UButton
          icon="i-heroicons-printer"
          label="Распечатать"
          variant="outline"
          color="gray"
          class="flex-1"
          @click="printPage"
        />
        <UButton
          icon="i-heroicons-share"
          label="Поделиться"
          variant="outline"
          color="gray"
          class="flex-1"
          @click="sharePage"
        />
      </div>
    </div>
  </CommonContentContainer>
</template>

<script setup lang="ts">
import type { Page } from '~~/services/types/page.type';

const route = useRoute();

// Загружаем данные страницы
const { data: page } = await useFetch<Page>(
  `http://api2.infomania.ru/api/page/${route.params.slug}`
);

// Форматирование даты
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Расчет времени чтения
const readingTime = computed(() => {
  if (!page.value?.content) return 3;
  const words = page.value.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.ceil(words / 200);
});

// Действия
const printPage = () => {
  window.print();
};

const sharePage = () => {
  if (navigator.share) {
    navigator.share({
      title: page.value?.title,
      text: page.value?.content?.substring(0, 100),
      url: window.location.href,
    });
  } else {
    navigator.clipboard.writeText(window.location.href);
    const toast = useToast();
    toast.add({ title: 'Ссылка скопирована', color: 'green' });
  }
};

// Хлебные крошки
const breadcrumbUI = {
  link: 'text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400',
  active: 'text-gray-900 dark:text-white font-medium',
};

const breadcrumbItems = computed(() => [
  {
    label: 'Главная',
    icon: 'i-heroicons-home',
    to: '/',
  },
  {
    label: 'Страницы',
    icon: 'i-heroicons-document-text',
    to: '/pages',
  },
  {
    label: page.value?.title || 'Страница',
    to: `/page/${page.value?.slug}`,
  },
]);

// SEO
useSeoMeta({
  title: page.value?.title,
  description: page.value?.content?.substring(0, 160),
});
</script>

<style scoped>
@import '~/assets/css/main.css';
</style>
