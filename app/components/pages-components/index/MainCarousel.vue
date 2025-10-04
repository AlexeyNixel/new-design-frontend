<template>
  <UCarousel
    arrows
    loop
    dots
    :ui="ui"
    v-slot="{ item }"
    :items="slides"
    class="h-[500px] rounded-xl"
  >
    <NuxtLink :to="{ name: 'entry-slug', params: { slug: item.entry.slug } }">
      <img :src="item.image.preview" alt="" class="h-full rounded" />
    </NuxtLink>
  </UCarousel>
</template>

<script setup lang="ts">
import { useSlides } from '~~/services/api/slidesService';

const slideService = useSlides();
const ui = {
  viewport: 'h-full rounded',
  item: 'h-full',
  container: 'h-full',
  prev: 'rounded ml-[60px] bg-primary text-white border-0 ring-0 hover:bg-primary-100 hover:cursor-pointer',
  next: ' rounded mr-[60px] bg-primary text-white border-0 ring-0 hover:bg-primary-100 hover:cursor-pointer',
  dots: 'bottom-5',
  dot: 'w-6 h-1',
};
const { data: slides } = await slideService.getAllSlides({
  orderBy: '-createdAt',
  pageSize: 5,
  include: 'image,entry',
});
</script>

<style scoped></style>
