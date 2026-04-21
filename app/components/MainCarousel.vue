<template>
  <UCarousel
    arrows
    loop
    dots
    :autoplay="{ delay: 6000 }"
    :ui="ui"
    v-slot="{ item }"
    :items="slides"
    class="rounded-xl shadow overflow-hidden w-full h-full lg:h-full"
  >
    <NuxtLink
      v-if="item?.post"
      :to="{ name: 'entry-slug', params: { slug: item.post?.slug } }"
      class="max-w-7xl h-full"
    >
      <img :src="item.image.path" alt="" class="w-full h-full" />
    </NuxtLink>
    <NuxtLink class="max-w-7xl h-full" v-else :to="item.url">
      <img :src="item.image.path" alt="" class="w-full h-full" />
    </NuxtLink>
  </UCarousel>
</template>

<script setup lang="ts">
import { useSlides } from '~~/services/api/slidesService';

const slideService = useSlides();
const ui = {
  viewport: 'h-full rounded-b-xl',
  item: 'h-full',
  container: 'h-full',
  prev: 'rounded ml-[60px] bg-primary text-white border-0 ring-0 hover:bg-primary/60 hover:cursor-pointer',
  next: ' rounded mr-[60px] bg-primary text-white border-0 ring-0 hover:bg-primary/60 hover:cursor-pointer',
  dots: 'bottom-5',
  dot: 'w-4 h-4 data-[state=active]:bg-primary',
};
const { data: slides } = await slideService.getAllSlides({
  limit: 5,
});
</script>

<style scoped></style>
