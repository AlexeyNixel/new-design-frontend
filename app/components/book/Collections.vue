<template>
  <!-- Вкладка «Подборки» в блоке «Книги» на главной -->
  <div class="py-4">
    <div
      v-if="collections.length"
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <BookCollectionCard
        v-for="(collection, index) in collections"
        :key="collection.id"
        :collection="collection"
        :index="index"
      />
    </div>
    <p
      v-else
      class="py-10 text-center text-gray-500"
    >
      Подборки скоро появятся.
      <NuxtLink
        to="/books"
        class="font-medium text-[#157486] hover:underline"
      >
        Смотреть все книги
      </NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useBookApi } from '~~/services/api/bookService';

const bookApi = useBookApi();

const { data } = await bookApi.getAllCollections({ limit: 6 });

// Пустые подборки не показываем; на главной хватит трёх
const collections = computed(() =>
  nonEmptyCollections(data).slice(0, 3),
);
</script>
