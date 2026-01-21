<template>
  <CommonContentContainer>
    <UInput class="w-full" placeholder="Поиск книг..."></UInput>
    <div class="grid grid-cols-6">
      <BookCard v-for="book in data" :book="book" />
    </div>
  </CommonContentContainer>
</template>

<script setup lang="ts">
import { useBookApi } from '~~/services/api/bookService';

const bookApi = useBookApi();
const { data } = await bookApi.getAllBooks({
  include: 'preview',
  limit: 15,
});
</script>

<style scoped></style>
