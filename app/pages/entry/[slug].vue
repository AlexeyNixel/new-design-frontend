<template>
  <CommonContentContainer>
    <UBreadcrumb :ui="breadcrumbUI" :items="breadcrumbItems" class="mb-6" />

    <article class="news-article">
      <header class="news-header">
        <div class="news-meta">
          <UBadge
            :label="entry.department.title"
            color="primary"
            variant="soft"
            class="mb-3"
          />
          <h1 class="news-title">{{ entry.title }}</h1>
          <div class="news-info">
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
                <span> Алексей Печенкин</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main ref="contentRef" class="news-content">
        <div class="ck-content" v-html="entry.content"></div>
      </main>

      <footer class="news-footer">
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
  // ogImage: entry.preview.path,
  twitterCard: 'summary_large_image',
});
</script>

<style scoped>
:deep(p) {
  @apply indent-4 mb-2;
}
@import '~/assets/css/main.css';

:deep(p) {
  @apply indent-12 mb-2;
}

.news-article {
  @apply max-w-4xl mx-auto;
}

.news-header {
  @apply mb-8;
}

.news-title {
  @apply text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight;
}

.news-meta {
  @apply mb-6;
}

.news-info {
  @apply flex flex-wrap gap-4 text-sm mb-4;
}

.news-content {
  /* Стили для улучшенного отображения контента CKEditor */
  :deep(.ck-content) {
    @apply leading-relaxed;

    h2,
    h3,
    h4 {
      @apply mt-8 mb-4 font-bold;
    }

    h2 {
      @apply text-2xl;
    }
    h3 {
      @apply text-xl;
    }
    h4 {
      @apply text-lg;
    }

    p {
      @apply mb-4 text-justify;
    }

    blockquote {
      @apply border-l-4 border-primary-500 bg-primary-50 dark:bg-primary-900/20 pl-4 py-2 my-4 italic;
    }

    img {
      @apply rounded-lg shadow-md mx-auto my-6;
    }

    ul,
    ol {
      @apply my-4 pl-6;
    }

    li {
      @apply mb-2;
    }

    table {
      @apply w-full border-collapse my-6;
    }

    th,
    td {
      @apply border border-gray-300 dark:border-gray-600 px-4 py-2;
    }

    th {
      @apply bg-gray-50 dark:bg-gray-700 font-semibold;
    }
  }
}

.news-footer {
  @apply mt-8;
}

/* Анимации */
.news-article {
  animation: fadeInUp 0.6s ease-out;
}

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

/* Адаптивность */
@media (max-width: 768px) {
  .news-title {
    @apply text-2xl;
  }

  .news-info {
    @apply flex-col gap-2;
  }

  .news-footer {
    @apply flex-col gap-4;
  }
}
</style>
