<template>
  <div class="relative w-full">
    <swiper-container
      ref="swiperElRef"
      class="block w-full"
      init="false"
    >
      <swiper-slide
        v-for="book in books"
        :key="book.id"
        class="h-auto"
      >
        <!-- Отступ вокруг карточки — иначе тень/сдвиг при ховере обрезает overflow:hidden внутри swiper -->
        <div class="h-full py-3">
          <BookCard :book="book" />
        </div>
      </swiper-slide>
    </swiper-container>

    <!-- Стрелки; на телефоне карусель листают пальцем -->
    <button
      type="button"
      aria-label="Предыдущие книги"
      class="absolute z-10 top-1/2 -translate-y-1/2 left-1 sm:left-2 hidden sm:flex items-center justify-center size-10 rounded-full bg-white/90 text-[#0d4954] shadow-[0_2px_10px_rgb(0_0_0/0.15)] backdrop-blur-sm hover:bg-white hover:cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[#0d4954]"
      @click="goPrev"
    >
      <Icon
        name="i-heroicons-chevron-left-20-solid"
        class="w-5 h-5"
      />
    </button>
    <button
      type="button"
      aria-label="Следующие книги"
      class="absolute z-10 top-1/2 -translate-y-1/2 right-1 sm:right-2 hidden sm:flex items-center justify-center size-10 rounded-full bg-white/90 text-[#0d4954] shadow-[0_2px_10px_rgb(0_0_0/0.15)] backdrop-blur-sm hover:bg-white hover:cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[#0d4954]"
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

const bookApi = useBookApi();
const { data: books } = await bookApi.getAllBooks({
  include: 'preview',
  pageSize: 9,
});

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
