<template>
  <CommonContentContainer>
    <UBreadcrumb :ui="breadcrumbUI" :items="breadcrumbItems" class="mb-6" />

    <article class="max-w-4xl mx-auto animate-fade-in-up">
      <header class="mb-8">
        <div class="mb-6">
          <div class="flex gap-2">
            <UBadge
              v-for="tag in entry.tags"
              :label="tag.label"
              color="primary"
              variant="soft"
              class="mb-3"
            />
          </div>
          <h1
            class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight"
          >
            {{ entry.title }}
          </h1>
          <div class="flex flex-wrap gap-4 text-sm mb-4">
            <div
              class="flex items-center gap-4 text-gray-600 dark:text-gray-400"
            >
              <div class="flex items-center gap-1">
                <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                <span>{{ formattedDate(entry.publishedAt) }}</span>
              </div>
              <div class="flex items-center gap-1">
                <UIcon name="i-heroicons-clock" class="w-4 h-4" />
                <span
                  >{{ Math.round(entry.content.length / 1000) }} мин
                  чтения</span
                >
              </div>
              <div class="flex items-center gap-1">
                <UIcon name="i-heroicons-user" class="w-4 h-4" />
                <span>{{ entry.department.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main class="news-content">
        <div
          v-image-gallery="{ modal }"
          class="tiptap"
          v-html="entry.content"
        ></div>
      </main>

      <footer class="mt-8">
        <USeparator class="my-6" />

        <div class="flex justify-between items-center">
          <UButton
            to="/entry"
            icon="i-heroicons-arrow-left"
            label="Все новости"
            variant="ghost"
            color="primary"
          />
        </div>
      </footer>
    </article>
  </CommonContentContainer>
</template>

<script setup lang="ts">
import { ModalsCommon } from '#components';
import { useEntryApi } from '~~/services/api/entryService';

const route = useRoute();
const formattedDate = useFormateDate();
const overlay = useOverlay();

const modal = overlay.create(ModalsCommon);

const breadcrumbUI = {
  link: 'text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400',
  active: 'text-gray-900 dark:text-white font-medium',
};

const entryApi = useEntryApi();
const { data: entry } = await entryApi.getBySlugEntry(
  route.params.slug as string,
  {
    include: 'department',
  }
);

const breadcrumbItems = ref([
  {
    label: 'Главная',
    icon: 'i-heroicons-home',
    to: '/',
  },
  {
    label: 'Новости',
    icon: 'i-heroicons-newspaper',
    to: '/entry',
  },
  {
    label: entry.title,
    icon: 'i-heroicons-document-text',
    to: `/entry/${entry.slug}`,
  },
]);

useSeoMeta({
  title: entry.title,
  description: entry.description || entry.title,
  ogTitle: entry.title,
  ogDescription: entry.description || entry.title,
});
</script>

<style scoped></style>
