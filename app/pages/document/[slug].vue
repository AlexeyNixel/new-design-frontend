<template>
  <CommonContentContainer>
    <!-- Хлебные крошки -->
    <UBreadcrumb :ui="breadcrumbUI" :items="breadcrumbItems" class="mb-6" />

    <!-- Основной контент документа -->
    <article class="document-article">
      <header class="document-header">
        <div class="document-meta">
          <h1 class="document-title">{{ document.document.title }}</h1>
        </div>
      </header>

      <!-- Контент документа -->
      <main class="document-content">
        <div class="ck-content" v-html="document.document.content"></div>
      </main>

      <footer class="document-footer">
        <USeparator class="my-8" />
      </footer>
    </article>
  </CommonContentContainer>
</template>

<script setup lang="ts">
import { useDocumentApi } from '~~/services/api/documentService';

const route = useRoute();

const breadcrumbUI = {
  link: 'text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400',
  active: 'text-gray-900 dark:text-white font-medium',
};

const documentApi = useDocumentApi();
const { data: document } = await documentApi.getBySlugDocument(
  route.params.slug as string,
  { include: 'document' }
);

const breadcrumbItems = computed(() => [
  {
    label: 'Главная',
    icon: 'i-heroicons-home',
    to: '/',
  },
  {
    label: 'Документы',
    icon: 'i-heroicons-document-text',
    to: '/document',
  },
  {
    label: document.document.title,
    icon: 'i-heroicons-document',
    to: `/document/${document.id}`,
  },
]);

// SEO
useSeoMeta({
  title: document.document.title,
  description: document.document.title,
  ogTitle: document.document.title,
  ogDescription: document.document.title,
});
</script>

<style scoped>
@import '~/assets/css/main.css';

.document-article {
  @apply max-w-4xl mx-auto;
}

.document-header {
  @apply mb-8;
}

.document-title {
  @apply text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight;
}

.document-meta {
  @apply mb-6;
}

/* Контент документа */
.document-content {
  @apply max-w-none;
}

/* Стили для контента CKEditor */
:deep(.ck-content) {
  @apply leading-relaxed text-justify;

  h2,
  h3,
  h4 {
    @apply mt-8 mb-4 font-bold scroll-mt-20;
  }

  h2 {
    @apply text-2xl border-b border-gray-200 dark:border-gray-700 pb-2;
  }
  h3 {
    @apply text-xl;
  }
  h4 {
    @apply text-lg;
  }

  p {
    @apply mb-4 leading-7;
  }

  blockquote {
    @apply border-l-4 border-primary-500 bg-primary-50 dark:bg-primary-900/20 pl-6 py-4 my-6 italic text-gray-700 dark:text-gray-300;
  }

  img {
    @apply rounded-lg shadow-md mx-auto my-8 max-w-full h-auto;
  }

  ul,
  ol {
    @apply my-6 pl-6 space-y-2;
  }

  li {
    @apply mb-2;
  }

  table {
    @apply w-full border-collapse my-8 rounded-lg overflow-hidden shadow-sm;
  }

  th,
  td {
    @apply border border-gray-300 dark:border-gray-600 px-4 py-3;
  }

  th {
    @apply bg-gray-50 dark:bg-gray-700 font-semibold text-left;
  }

  tr:nth-child(even) {
    @apply bg-gray-50/50 dark:bg-gray-700/50;
  }

  code {
    @apply bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono;
  }

  pre {
    @apply bg-gray-900 text-gray-100 p-4 rounded-lg my-6 overflow-x-auto;
  }

  pre code {
    @apply bg-transparent p-0 text-inherit;
  }
}

/* Анимации */
.document-article {
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
  .document-title {
    @apply text-2xl;
  }
}

/* Стили для печати */
@media print {
  .document-actions,
  .related-documents,
  .document-toc {
    @apply hidden;
  }

  .document-article {
    @apply max-w-none;
  }
}
</style>
