<template>
  <CommonContentContainer v-if="page">
    <!-- Хлебные крошки -->
    <UBreadcrumb
      :ui="breadcrumbUI"
      :items="breadcrumbItems"
      class="mb-6"
    />

    <div class="max-w-6xl mx-auto">
      <!-- Заголовок страницы -->
      <div class="text-center mb-10">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {{ page.title }}
        </h1>
      </div>

      <!-- Основной контент -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div class="p-8 md:p-10">
          <div
            class="tiptap"
            v-html="page.content"
          />
        </div>
      </div>
    </div>
  </CommonContentContainer>
</template>

<script setup lang="ts">
import { usePageApi } from '~~/services/api/page.api';

const route = useRoute();

const pageApi = usePageApi();

const { data: page } = await pageApi.getOnePage(route.params.slug as string);

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
    label: page?.title || 'Страница',
    to: `/page/${page?.slug}`,
  },
]);

if (!page) {
  showError({
    status: 404,
    statusText: 'Страницы не существует',
  });
}

// SEO
useSeoMeta({
  title: page?.title,
  description: page?.content?.substring(0, 160),
});
</script>
