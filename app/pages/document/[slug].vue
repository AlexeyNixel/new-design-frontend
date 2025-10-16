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
