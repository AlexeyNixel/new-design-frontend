<template>
  <NuxtLink
    :to="{ name: 'book-slug', params: { slug: book.id } }"
    class="h-full"
  >
    <img :src="book.preview.preview" :alt="book.title" class="h-[400px]" />
  </NuxtLink>
</template>
<script setup lang="ts">
import { type Book } from '~~/services/types/book.type';

defineProps<{
  book: Book;
}>();
</script>
<style scoped></style>
