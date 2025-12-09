<template>
  <UCarousel
    arrows
    loop
    :ui="ui"
    :items="books"
    v-slot="{ item, index }"
    class-names
  >
    <BookCard :book="item" />
  </UCarousel>
</template>

<script setup lang="ts">
import { useBookApi } from '~~/services/api/bookService';

const ui = {
  root: 'relative w-full',
  viewport: 'w-full overflow-hidden',
  item: 'basis-full sm:basis-1/2 md:basis-1/3 xl:basis-1/4 2xl:basis-1/5',
  container: 'flex items-center',
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
console.log(books);
</script>
