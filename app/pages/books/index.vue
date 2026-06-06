<template>
  <CommonContentContainer>
    <UInput
      class="w-full"
      placeholder="Поиск книг..."
    />
    <div class="grid grid-cols-6">
      <BookCard
        v-for="book in data"
        :key="book.id"
        :book="book"
      />
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
