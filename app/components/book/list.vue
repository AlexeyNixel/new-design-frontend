<template>
  <ClientOnly>
    <swiper-container class="h-full" :slides-per-view="6" :space-between="20">
      <swiper-slide class="h-full" v-for="book in books" :key="book.id">
        <NuxtLink to="/" class="h-full">
          <img
            :src="'http://static.infomania.ru' + book.preview.path"
            alt=""
            class="h-full object-cover"
          />
        </NuxtLink>
      </swiper-slide>
    </swiper-container>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useBookApi } from '~~/services/api/bookService';

const bookApi = useBookApi();

const { data: books } = await bookApi.getAllBooks({
  include: 'preview',
});
</script>

<style scoped></style>
