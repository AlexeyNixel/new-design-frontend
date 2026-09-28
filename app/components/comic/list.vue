<template>
  <div class="relative w-full">
    <swiper-container
      ref="swiperElRef"
      class="block w-full py-4"
      init="false"
    >
      <swiper-slide
        v-for="comic in comics"
        :key="comic.id"
        class="h-auto"
      >
        <!-- Отступ вокруг карточки — иначе тень/сдвиг при ховере обрезает overflow:hidden внутри swiper -->
        <div class="h-full py-3">
          <ComicCard :comic="comic" />
        </div>
      </swiper-slide>
    </swiper-container>

    <!-- Стрелки -->
    <button
      type="button"
      aria-label="Предыдущие комиксы"
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
      aria-label="Следующие комиксы"
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
import { useComicApi } from '~~/services/api/comic.api';

// Нативный веб-компонент из nuxt-swiper (swiper/element), см. app/components/MainCarousel.vue.
// breakpoints — объект, а не примитив: при SSR Vue не может отрендерить его атрибутом,
// а при гидратации не переустанавливает такие пропсы на кастомном элементе, поэтому
// задаём их вручную через свойства после монтирования (init="false" — чтобы swiper
// не успел инициализироваться раньше с дефолтными параметрами).
type SwiperContainerEl = HTMLElement & {
  swiper?: SwiperInstance;
  initialize?: () => void;
  breakpoints?: Record<number, { slidesPerView: number; spaceBetween?: number }>;
  loop?: boolean;
};
interface SwiperInstance {
  slidePrev: () => void;
  slideNext: () => void;
}

const breakpoints = {
  0: { slidesPerView: 2, spaceBetween: 12 },
  640: { slidesPerView: 3, spaceBetween: 16 },
  768: { slidesPerView: 4, spaceBetween: 16 },
  1280: { slidesPerView: 5, spaceBetween: 16 },
  1536: { slidesPerView: 7, spaceBetween: 16 },
};

const comicApi = useComicApi();
const { data: comics } = await comicApi.getAllComics({ limit: 9 });

const swiperElRef = ref<SwiperContainerEl | null>(null);

onMounted(async () => {
  await customElements.whenDefined('swiper-container');
  const el = swiperElRef.value;
  if (!el) return;
  Object.assign(el, { loop: true, breakpoints });
  el.initialize?.();
});

const goPrev = () => swiperElRef.value?.swiper?.slidePrev();
const goNext = () => swiperElRef.value?.swiper?.slideNext();
</script>
