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

      <main ref="contentRef" class="news-content">
        <div class="ck-content tiptap" v-html="entry.content"></div>
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

          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-600">Поделиться:</span>
            <div class="flex gap-2">
              <UButton
                icon="i-heroicons-share"
                variant="ghost"
                @click="shareNews"
              />
            </div>
          </div>
        </div>
      </footer>
    </article>
  </CommonContentContainer>
</template>

<script setup lang="ts">
import { ModalsCommon } from '#components';
import 'ckeditor5/ckeditor5.css';
import { useEntryApi } from '~~/services/api/entryService';

const { $toast } = useNuxtApp();
const route = useRoute();
const overlay = useOverlay();
const contentRef = ref();

const modal = overlay.create(ModalsCommon);

const formattedDate = useFormateDate();

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

const shareNews = () => {
  if (navigator.share) {
    navigator.share({
      title: entry.title,
      text: entry.excerpt || entry.title,
      url: window.location.href,
    });
  } else {
    $toast.success('Ссылка скопирована в буфер обмена');
    copyLink();
  }
};

onMounted(() => {
  if (import.meta.client) {
    contentRef.value.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (target.tagName === 'IMG' && target instanceof HTMLImageElement) {
        const images = contentRef.value.querySelectorAll('img');
        const arrImageLink: string[] = Array.from(images).map(
          (image: HTMLImageElement | string) => image.src
        );

        const startIndex = arrImageLink.findIndex((img) => img === target.src);
        modal.open({ imgLinks: arrImageLink, startIndex: startIndex });
      }
    });
  }
});

useSeoMeta({
  title: entry.title,
  description: entry.desc || entry.title,
  ogTitle: entry.title,
  ogDescription: entry.desc || entry.title,
  twitterCard: 'summary_large_image',
});
</script>

<style scoped>
:deep(.ck-content .table p) {
  text-indent: 0 !important;
}
</style>
