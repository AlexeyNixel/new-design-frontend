<template>
  <!-- Новый формат: страница собрана из контентных блоков -->
  <div
    v-if="page && hasBlocks"
    class="bg-neutral-100"
  >
    <PageBlocksHero
      v-if="heroBlock"
      :icon="heroBlock.icon"
      :label="heroBlock.label"
      :title="heroBlock.title"
      :subtitle="heroBlock.subtitle"
      :contacts="heroBlock.contacts"
    />

    <div class="container mx-auto px-4 py-16 max-w-7xl">
      <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 md:p-12">
        <h1
          v-if="!heroBlock"
          class="text-4xl font-bold text-gray-900 text-center mb-10"
        >
          {{ page.title }}
        </h1>

        <PageBlocksRenderer :blocks="contentBlocks" />
      </div>
    </div>
  </div>

  <!-- Старый формат: страница со свободным HTML-контентом -->
  <CommonContentContainer v-else-if="page">
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
import type { PageContentBlock, PageHeroBlock } from '~~/services/types/page.type';

const route = useRoute();

const pageApi = usePageApi();

const { data: page } = await pageApi.getOnePage(route.params.slug as string);

if (!page) {
  showError({
    status: 404,
    statusText: 'Страницы не существует',
  });
}

// Новый формат страницы: контент собран из типизированных блоков (см. docs/page-content-blocks.md)
const hasBlocks = computed(() => !!page?.blocks?.length);

const heroBlock = computed(() =>
  page?.blocks?.find((block): block is PageHeroBlock => block.type === 'hero'),
);

const contentBlocks = computed<PageContentBlock[]>(() =>
  (page?.blocks ?? []).filter((block): block is PageContentBlock => block.type !== 'hero'),
);

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

// SEO
useSeoMeta({
  title: page?.title,
  description: page?.content?.substring(0, 160) || heroBlock.value?.subtitle,
});
</script>
