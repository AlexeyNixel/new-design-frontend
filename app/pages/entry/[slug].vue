<template>
  <div>
    <UBreadcrumb :items="items" />
    <header class="flex justify-between items-center">
      <h1 class="my-2 text-2xl font-bold">{{ entry.title }}</h1>
      <div class="font-bold">
        {{ entry.createdAt.slice(0, 10) }}
      </div>
    </header>

    <div class="indent-10" v-html="entry.content"></div>
    <USeparator class="my-5" color="primary" />
  </div>
</template>
<script setup lang="ts">
import { useEntryApi } from '~~/services/api/entryService';

const route = useRoute();
const entryApi = useEntryApi();

const { data: entry } = await entryApi.getBySlugEntry(
  route.params.slug as string
);

const items = ref([
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
  },
]);
</script>

<style scoped>
:deep(a) {
  color: var(--color-primary-50);
  font-weight: 700;
}
</style>
