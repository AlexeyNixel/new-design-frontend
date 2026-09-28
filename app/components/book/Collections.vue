<template>
  <div class="relative w-full">
    <swiper-container
      ref="swiperElRef"
      class="block w-full py-4"
      loop="true"
      :breakpoints="breakpoints"
    >
      <swiper-slide
        v-for="item in collections"
        :key="item.id"
        class="h-auto"
      >
        <!-- Отступ вокруг карточки — иначе тень обрезает overflow:hidden внутри swiper -->
        <div class="h-full py-3">
          <NuxtLink class="block h-full overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
            <img
              class="h-[250px] w-full object-cover"
              :src="item?.preview?.path"
              alt=""
            >
            <h3 class="p-3 font-semibold text-gray-900">
              {{ item.label }}
            </h3>
          </NuxtLink>
        </div>
      </swiper-slide>
    </swiper-container>

    <!-- Стрелки -->
    <button
      type="button"
      aria-label="Предыдущие подборки"
      class="absolute z-10 top-1/2 -translate-y-1/2 left-2 sm:left-4 md:left-[60px] flex items-center justify-center w-9 h-9 rounded bg-primary text-white hover:bg-primary/60 hover:cursor-pointer transition-colors"
      @click="goPrev"
    >
      <Icon
        name="i-heroicons-chevron-left-20-solid"
        class="w-5 h-5"
      />
    </button>
    <button
      type="button"
      aria-label="Следующие подборки"
      class="absolute z-10 top-1/2 -translate-y-1/2 right-2 sm:right-4 md:right-[60px] flex items-center justify-center w-9 h-9 rounded bg-primary text-white hover:bg-primary/60 hover:cursor-pointer transition-colors"
      @click="goNext"
    >
      <Icon
        name="i-heroicons-chevron-right-20-solid"
        class="w-5 h-5"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useBookApi } from '~~/services/api/bookService';

// Нативный веб-компонент из nuxt-swiper (swiper/element), см. app/components/MainCarousel.vue.
type SwiperContainerEl = HTMLElement & { swiper?: SwiperInstance };
interface SwiperInstance {
  slidePrev: () => void;
  slideNext: () => void;
}

const breakpoints = {
  0: { slidesPerView: 1, spaceBetween: 12 },
  640: { slidesPerView: 2, spaceBetween: 16 },
  768: { slidesPerView: 3, spaceBetween: 16 },
  1280: { slidesPerView: 4, spaceBetween: 16 },
  1536: { slidesPerView: 6, spaceBetween: 16 },
};

const bookApi = useBookApi();

const { data: collections } = await bookApi.getAllCollections({
  include: 'preview',
});

const swiperElRef = ref<SwiperContainerEl | null>(null);

const goPrev = () => swiperElRef.value?.swiper?.slidePrev();
const goNext = () => swiperElRef.value?.swiper?.slideNext();
</script>
