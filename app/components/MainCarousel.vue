<template>
  <div class="h-full">
    <UCarousel
      arrows
      loop
      dots
      :autoplay="{ delay: 6000 }"
      :ui="ui"
      v-slot="{ item }"
      :items="slides"
      class="rounded-xl shadow overflow-hidden h-full"
    >
      <NuxtLink
        v-if="item?.post"
        :to="{ name: 'entry-slug', params: { slug: item.post?.slug } }"
        class="h-full"
      >
        <img :src="item.image.path" alt="" class="min-h-[600px] h-full" />
      </NuxtLink>
      <NuxtLink v-else :to="item.url">
        <img :src="item.image.path" alt="" class="min-h-[600px] h-full" />
      </NuxtLink>
    </UCarousel>
  </div>
</template>

<script setup lang="ts">
import { useSlides } from '~~/services/api/slidesService';

const slideService = useSlides();
const ui = {
  viewport: 'h-full rounded-b-xl',
  item: 'h-full',
  container: 'h-full',
  prev: 'rounded ml-[60px] bg-primary text-white border-0 ring-0 hover:bg-primary-100 hover:cursor-pointer',
  next: ' rounded mr-[60px] bg-primary text-white border-0 ring-0 hover:bg-primary-100 hover:cursor-pointer',
  dots: 'bottom-5',
  dot: 'w-6 h-1',
};
const { data: slides } = await slideService.getAllSlides({
  limit: 5,
});
</script>

<style scoped></style>
