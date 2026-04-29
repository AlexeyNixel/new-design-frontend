<!-- components/MainCarousel.vue -->
<template>
  <div class="relative w-full h-full">
    <UCarousel
      arrows
      loop
      dots
      :autoplay="{ delay: 6000 }"
      :ui="carouselUi"
      v-slot="{ item }"
      :items="slides"
      class="rounded-xl shadow overflow-hidden w-full h-full"
    >
      <NuxtLink class="block w-full h-full">
        <img
          :src="item.image.path"
          :alt="item.title || 'Слайд'"
          class="w-full h-full object-cover"
          :style="{ objectPosition: 'center center' }"
          loading="lazy"
        />
      </NuxtLink>
    </UCarousel>
  </div>
</template>

<script setup lang="ts">
import { useSlides } from '~~/services/api/slidesService';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const slideService = useSlides();

const carouselUi = {
  viewport: 'rounded-b-xl h-full',
  item: 'h-full',
  container: 'h-full',
  prev: `
    rounded
    ml-2 sm:ml-4 md:ml-[60px]
    bg-primary text-white border-0 ring-0
    hover:bg-primary/60 hover:cursor-pointer
    !w-8 !h-8 sm:!w-10 sm:!h-10 md:!w-12 md:!h-12
    z-10
  `,
  next: `
    rounded
    mr-2 sm:mr-4 md:mr-[60px]
    bg-primary text-white border-0 ring-0
    hover:bg-primary/60 hover:cursor-pointer
    !w-8 !h-8 sm:!w-10 sm:!h-10 md:!w-12 md:!h-12
    z-10
  `,
  dots: 'bottom-2 sm:bottom-3 md:bottom-5 z-10',
  dot: 'w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 data-[state=active]:bg-primary mx-0.5 sm:mx-1',
};

const { data: slides } = await slideService.getAllSlides({
  limit: 5,
});
</script  >