<template>
  <UCarousel
    v-slot="{ item }"
    arrows
    loop
    :ui="ui"
    :items="books"
  >
    <BookCard :book="item" />
  </UCarousel>
</template>

<script setup lang="ts">
import { useBookApi } from '~~/services/api/bookService';

const ui = {
  root: 'relative w-full',
  viewport: 'w-full overflow-hidden py-4',
  item: 'basis-1/2 sm:basis-1/3 md:basis-1/4 xl:basis-1/5 2xl:basis-1/7',
  container: 'flex items-stretch',
  prev: 'rounded ml-[60px] bg-primary text-white border-0 ring-0 hover:bg-primary-100 hover:cursor-pointer',
  next: 'rounded mr-[60px] bg-primary text-white border-0 ring-0 hover:bg-primary-100 hover:cursor-pointer',
  dots: 'bottom-5',
  dot: 'w-6 h-1',
};

const bookApi = useBookApi();
const { data: books } = await bookApi.getAllBooks({
  include: 'preview',
  pageSize: 9,
});
</script>
