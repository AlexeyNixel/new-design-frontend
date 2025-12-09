<template>
  <NuxtLink
    :to="{ name: 'books-slug', params: { slug: book.id } }"
    class="h-full flex justify-center mt-10"
  >
    <div class="flex flex-col">
      <img :src="book?.preview?.path" :alt="book.title" class="h-[400px]" />
      <h3>{{ book.title }}</h3>
    </div>
  </NuxtLink>
</template>
<script setup lang="ts">
import { type Book } from '~~/services/types/book.type';

defineProps<{
  book: Book;
}>();
</script>
<style scoped></style>
