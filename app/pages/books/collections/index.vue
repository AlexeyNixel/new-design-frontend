<template>
  <div class="bg-neutral-100">
    <section class="bg-[#0d4954] text-white">
      <div class="mx-auto max-w-[1236px] px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-14 3xl:max-w-[1710px]">
        <UBreadcrumb
          :items="breadcrumbItems"
          :ui="{
            link: 'text-white/70 hover:text-white',
            linkLeadingIcon: 'text-white/70',
            separatorIcon: 'text-white/40',
          }"
          class="mb-8"
        />
        <h1 class="text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl">
          Подборки книг
        </h1>
        <p class="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
          Библиотекари собрали книги вокруг тем и настроений — чтобы не выбирать
          вслепую из всего фонда. Каждую книгу можно взять в библиотеке.
        </p>
      </div>
    </section>

    <div class="mx-auto max-w-[1236px] px-4 py-10 sm:px-6 lg:px-8 3xl:max-w-[1710px]">
      <div
        v-if="collections.length"
        class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <BookCollectionCard
          v-for="(collection, index) in collections"
          :key="collection.id"
          :collection="collection"
          :index="index"
          :eager="index < 3"
        />
      </div>

      <div
        v-else
        class="rounded-2xl bg-white p-10 text-center ring-1 ring-gray-200"
      >
        <p class="text-lg font-bold text-gray-900">
          Подборки скоро появятся
        </p>
        <p class="mt-1 text-gray-600">
          А пока можно посмотреть все книги, которые советуют библиотекари.
        </p>
        <UButton
          to="/books"
          label="Смотреть все книги"
          class="mt-4"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBookApi } from '~~/services/api/bookService';

const bookApi = useBookApi();

const { data } = await bookApi.getAllCollections({ limit: 100 });
// Пустые подборки посетителю не показываем
const collections = computed(() =>
  nonEmptyCollections(data),
);

const breadcrumbItems = [
  { label: 'Главная', icon: 'i-heroicons-home', to: '/' },
  { label: 'Книги', to: '/books' },
  { label: 'Подборки', to: '/books/collections' },
];
useBreadcrumbSchema(breadcrumbItems);

usePageSeo({
  title: 'Подборки книг — что почитать',
  description:
    'Тематические подборки книг от библиотекарей Новосибирской областной молодёжной библиотеки: что почитать, если не знаете, с чего начать.',
});
</script>
