<template>
  <UCarousel class="" v-slot="{ item, index }" :items="collections" :ui="ui">
    <NuxtLink>
      <UCard :ui="cardUI">
        <img
          class="h-[250px] w-full object-cover"
          :src="item?.preview?.path"
          alt=""
        />
        <template #footer>
          <h3>{{ item.label }}</h3>
        </template>
      </UCard>
    </NuxtLink>
  </UCarousel>
</template>

<script setup lang="ts">
import { useBookApi } from '~~/services/api/bookService';

const bookApi = useBookApi();

const { data: collections } = await bookApi.getAllCollections({
  include: 'preview',
});

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

const cardUI = {
  root: '!p-0',
  header: '!p-0',
  body: '!p-0',
  footer: '!p-2',
};
</script>

<style scoped></style>
