<template>
  <div v-if="book" class="flex justify-between w-full">
    <div class="flex flex-col items-center justify-center w-1/2">
      <div>
        <img :src="book.preview.path" alt="" class="max-w-[400px] w-full" />
        <div class="font-bold self-start">{{ book.category }}</div>
        <div class="font-bold self-start">{{ book.storagePlace }}</div>
      </div>
    </div>

    <div class="w-1/2">
      <h1 class="">{{ book.title }}</h1>
      <p class="font-bold">{{ book.desc }}</p>
      <div v-html="book.content"></div>
      <UButton
        v-if="book.link"
        size="xl"
        @click="navigateTo(book.link, { open: { target: '_blank' } })"
        variant="outline"
        icon="i-heroicons-book-open"
        label="На литрес"
        class="mt-2"
      >
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBookApi } from '~~/services/api/bookService';

const route = useRoute();
const bookApi = useBookApi();

const { data: book } = await bookApi.getOneBook(route.params.slug as string);
</script>

<style scoped></style>
