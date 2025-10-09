<template>
  <UCarousel arrows loop :ui="ui" :items="books" v-slot="{ item }">
    <BookCard :book="item" />
  </UCarousel>
</template>

<script setup lang="ts">
import { useBookApi } from '~~/services/api/bookService';
const ui = {
  viewport: 'h-full rounded-xl',
  item: 'h-full basis-1/5',
  container: 'h-full',
  prev: 'rounded ml-[60px] bg-primary text-white border-0 ring-0 hover:bg-primary-100 hover:cursor-pointer',
  next: ' rounded mr-[60px] bg-primary text-white border-0 ring-0 hover:bg-primary-100 hover:cursor-pointer',
  dots: 'bottom-5',
  dot: 'w-6 h-1',
};
const bookApi = useBookApi();

const { data: books } = await bookApi.getAllBooks({
  include: 'preview',
});
</script>

<style scoped></style>
