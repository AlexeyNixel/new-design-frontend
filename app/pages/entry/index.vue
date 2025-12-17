<template>
  <CommonContentContainer>
    <UBreadcrumb
      :ui="{ link: '[&>span]:text-black text-black' }"
      class="text-black mb-4"
      :items="BREADCRUMB_ITEMS"
    />
    <div class="flex mb-8">
      <UInput
        color="primary"
        size="xl"
        placeholder="Поиск новостей"
        class="w-full"
        icon="i-lucide-search"
        v-model="search"
        @keydown.enter="handleNavigate()"
      >
        <template #trailing>
          <UPopover>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              icon="i-heroicons-outline-filter"
              aria-label="Фильтры поиска"
            />

            <template #content>
              <div>
                <EntryFilter v-model:filters="filters" />
              </div>
            </template>
          </UPopover>
        </template>
      </UInput>
      <UButton class="ml-2" @click="handleNavigate()">Найти</UButton>
    </div>

    <div>
      <div v-if="entries?.data && entries.data.length > 0">
        <EntryTile
          v-for="entry in entries.data"
          :key="entry.id"
          :entry="entry"
        />
        <UPagination
          show-edges
          @update:page="handleNavigate"
          v-model:page="page"
          :total="entries?.meta?.total"
          class="flex items-center justify-center"
        />
      </div>
      <div v-else>Новостей не найдено</div>
    </div>
  </CommonContentContainer>
</template>

<script setup lang="ts">
import { useEntryApi } from '~~/services/api/entryService';
import type { Entry } from '~~/services/types/entry.type';
import type { ApiResponse } from '~~/services/api/base';
import type { Filters } from '~/components/entry/Filter.vue';

const entryApi = useEntryApi();
const { query } = useRoute();

const BREADCRUMB_ITEMS = [
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
];

const entries = ref<ApiResponse<Entry[]>>();
const page = ref(Number(query.page) || 1);
const search = ref((query.search as string) || undefined);

const filters = ref<Filters>({
  department: (query.department as string) || undefined,
  sort: (query.sort as string) || '-createdAt',
  year: (query.year as string) || undefined,
});

const handleSearchEntries = async () => {
  try {
    entries.value = await entryApi.getAllEntry({
      include: 'preview, department',
      search: search.value || undefined,
      page: page.value,
    });
  } catch (error) {
    console.error(error);
  }
};

const handleNavigate = async (localPage?: number) => {
  page.value = localPage ? localPage : 1;

  navigateTo({
    name: 'entry',
    query: {
      year: filters.value.year,
      sort: filters.value.sort,
      page: page.value,
      search: search.value || undefined,
    },
  });

  if (import.meta.client) {
    window.scroll(0, 0);
  }

  await handleSearchEntries();
};

await handleSearchEntries();

watch(
  filters,
  () => {
    handleNavigate();
  },
  { deep: true }
);
</script>

<style scoped></style>
