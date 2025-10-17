<template>
  <CommonContentContainer>
    <!-- Хлебные крошки -->
    <UBreadcrumb :ui="breadcrumbUI" :items="breadcrumbItems" class="mb-6" />

    <!-- Основной контент документа -->
    <article class="max-w-4xl mx-auto">
      <header class="mb-8">
        <div class="mb-6">
          <h1
            class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight"
          >
            {{ document.document.title }}
          </h1>
        </div>
      </header>

      <!-- Контент документа -->
      <main class="max-w-none">
        <div
          ref="documentRef"
          class="ck-content"
          v-html="document.document.content"
        ></div>
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

const documentRef = ref();

const documentApi = useDocumentApi();
const { data: document } = await documentApi.getBySlugDocument(
  route.params.slug as string,
  { include: 'document' }
);

onMounted(() => {
  const iframe = documentRef.value.querySelectorAll('iframe');

  console.log(iframe);
  iframe[0].setAttribute('height', 100);
});

// SEO
useSeoMeta({
  title: document.document.title,
  description: document.document.title,
  ogTitle: document.document.title,
  ogDescription: document.document.title,
});
</script>

<style scoped>
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
