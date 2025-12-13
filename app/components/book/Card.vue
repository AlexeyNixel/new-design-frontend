<template>
  <NuxtLink
    :to="{ name: 'books-slug', params: { slug: book.id } }"
    class="h-full flex justify-center mt-10"
  >
    <UPopover mode="hover">
      <div class="flex flex-col">
        <img :src="book?.preview?.path" :alt="book.title" class="h-[400px]" />
      </div>
      <template #content>
        <div class="p-2">{{ book.title }}</div>
      </template>
    </UPopover>
  </NuxtLink>
</template>
<script setup lang="ts">
import { type Book } from '~~/services/types/book.type';

defineProps<{
  book: Book;
}>();
</script>
<style scoped></style>
