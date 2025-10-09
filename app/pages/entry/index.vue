<template>
  <div>
    <CommonContentContainer>
      <UBreadcrumb :ui="ui" class="text-black mb-4" :items="items" />

      <div class="flex mb-8">
        <UInput
          color="primary"
          size="xl"
          placeholder="Поиск новостей"
          class="w-full"
          icon="i-lucide-search"
          v-model="search"
        />
        <UButton class="ml-2" @click="handleSearchEntries">Найти</UButton>
      </div>

      <EntryTile
        v-if="entries?.data"
        v-for="entry in entries.data"
        :key="entry.id"
        :entry="entry"
      />

      <UPagination
        show-edges
        @update:page="handleSearchEntries"
        v-model:page="page"
        :total="entries?.meta?.total"
        class="flex items-center justify-center"
      />
    </CommonContentContainer>
  </div>
</template>

<script setup lang="ts">
import { useEntryApi } from '~~/services/api/entryService';
import type { Entry } from '~~/services/types/entry.type';
import type { ApiResponse } from '~~/services/api/base';

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
]);

const ui = {
  link: '[&>span]:text-black text-black',
};

const entryApi = useEntryApi();

const page = ref(1);
const search = ref('');
const entries = ref<ApiResponse<Entry[]>>();

const handleSearchEntries = async () => {
  entries.value = await entryApi.getAllEntry({
    include: 'preview,department',
    orderBy: '-createdAt',
    search: search.value ? search.value : undefined,
    page: page.value,
  });

  if (import.meta.client) {
    window.scroll(0, 0);
  }
};

await handleSearchEntries();
</script>

<style scoped></style>
