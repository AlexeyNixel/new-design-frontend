<script setup lang="ts">
import { useExhibitionApi } from '~~/services/api/exhibitionsService';
import type { Exhibition } from '~~/services/api/exhibitionsService';
import type { ApiResponse } from '~~/services/api/base';

const PAGE_SIZE = 12;

const exhibitionApi = useExhibitionApi();
const route = useRoute();

usePageSeo({
  title: 'Виртуальные выставки',
  description:
    'Виртуальные выставки, викторины и квесты Новосибирской областной молодёжной библиотеки — смотрите онлайн в любое время.',
});

const page = ref(Number(route.query.page) || 1);
const exhibitions = ref<ApiResponse<Exhibition[]>>();

const loadExhibitions = async () => {
  // Если API недоступно — показываем сообщение на странице, а не ошибку 500
  exhibitions.value = await exhibitionApi
    .getAllExhibitions({
      page: page.value,
      limit: PAGE_SIZE,
      sortOrder: 'desc',
    })
    .catch(() => undefined);
};

await loadExhibitions();

const handlePageChange = async () => {
  await navigateTo({ query: page.value > 1 ? { page: page.value } : {} });
  await loadExhibitions();
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <CommonContentContainer>
    <header class="mb-6 md:mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
        Виртуальные выставки
      </h1>
      <p class="text-gray-600 max-w-3xl">
        Выставки, викторины и квесты, которые можно посмотреть онлайн.
        Выставка откроется в новой вкладке.
      </p>
    </header>

    <div
      v-if="exhibitions?.data?.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
    >
      <ExhibitionCard
        v-for="(item, index) in exhibitions.data"
        :key="item.id"
        :exhibition="item"
        :eager="index < 4"
      />
    </div>

    <p
      v-else
      class="py-16 text-center text-gray-500"
    >
      Не удалось загрузить выставки. Попробуйте обновить страницу.
    </p>

    <div
      v-if="(exhibitions?.meta?.total ?? 0) > PAGE_SIZE"
      class="flex justify-center mt-10"
    >
      <UPagination
        v-model:page="page"
        show-edges
        :total="exhibitions?.meta?.total"
        :items-per-page="PAGE_SIZE"
        @update:page="handlePageChange"
      />
    </div>
  </CommonContentContainer>
</template>
