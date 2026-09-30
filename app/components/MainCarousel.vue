<!-- components/MainCarousel.vue -->
<template>
  <div class="relative w-full h-full">
    <swiper-container
      ref="swiperElRef"
      class="block w-full h-full rounded-xl shadow overflow-hidden"
      loop="true"
      :autoplay-delay="6000"
      @swiperslidechange="handleSlideChange"
    >
      <swiper-slide
        v-for="(item, index) in slides"
        :key="item.id"
      >
        <NuxtLink
          :to="slideLink(item)"
          class="block w-full h-full"
        >
          <picture class="relative block w-full h-full">
            <UButton
              v-if="hasSession"
              icon="akar-icons:gear"
              variant="soft"
              color="error"
              size="xl"
              class="absolute top-5 right-5 z-50"
              aria-label="Редактировать слайд"
              @click.prevent.stop="goToAdmin('/slide/admin/' + item.id)"
            />
            <img
              :src="item.image.path"
              :srcset="imageSrcset(item.image)"
              sizes="(max-width: 1024px) 100vw, 75vw"
              :alt="item.post?.title || 'Слайд'"
              class="w-full h-full object-cover"
              :style="{ objectPosition: 'center center' }"
              width="1200"
              height="480"
              :loading="index === 0 ? 'eager' : 'lazy'"
              :fetchpriority="index === 0 ? 'high' : 'auto'"
            >
          </picture>
        </NuxtLink>
      </swiper-slide>
    </swiper-container>

    <!-- Стрелки -->
    <button
      type="button"
      aria-label="Предыдущий слайд"
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
      aria-label="Следующий слайд"
      class="absolute z-10 top-1/2 -translate-y-1/2 right-2 sm:right-4 md:right-[60px] flex items-center justify-center w-9 h-9 rounded bg-primary text-white hover:bg-primary/60 hover:cursor-pointer transition-colors"
      @click="goNext"
    >
      <Icon
        name="i-heroicons-chevron-right-20-solid"
        class="w-5 h-5"
      />
    </button>

    <!-- Точки -->
    <div
      class="absolute z-10 bottom-2 sm:bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-1.5"
    >
      <button
        v-for="(item, index) in slides"
        :key="item.id"
        type="button"
        :aria-label="`Перейти к слайду ${index + 1}`"
        class="rounded-full w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 transition-colors hover:cursor-pointer shadow-sm"
        :class="
          index === activeIndex
            ? 'bg-primary ring-1 ring-white/70'
            : 'bg-white/80 ring-1 ring-black/10 hover:bg-white'
        "
        @click="goTo(index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSlides } from '~~/services/api/slidesService';
import type { Slide } from '~~/services/types/slide.type';

// Нативный веб-компонент из nuxt-swiper (swiper/element): в шаблоне регистрируется
// как <swiper-container>/<swiper-slide> (см. isCustomElement в nuxt.config).
type SwiperContainerEl = HTMLElement & { swiper?: SwiperInstance };
interface SwiperInstance {
  realIndex: number;
  slidePrev: () => void;
  slideNext: () => void;
  slideToLoop: (index: number) => void;
}

const slideService = useSlides();
const { hasSession, goToAdmin } = useAuth();

const { data } = await slideService.getAllSlides({
  limit: 10,
});

// Порядок задаётся в админке полем slideOrder; при равных значениях
// сохраняется порядок API (новые сверху)
const slides = [...(data ?? [])].sort(
  (a, b) => (a.slideOrder ?? 0) - (b.slideOrder ?? 0),
);

const slideLink = (slide: Slide) =>
  slide.post?.slug
    ? { name: 'post-slug', params: { slug: slide.post.slug } }
    : slide.url;

const swiperElRef = ref<SwiperContainerEl | null>(null);
const activeIndex = ref(0);

const handleSlideChange = () => {
  activeIndex.value = swiperElRef.value?.swiper?.realIndex ?? 0;
};

const goPrev = () => swiperElRef.value?.swiper?.slidePrev();
const goNext = () => swiperElRef.value?.swiper?.slideNext();
const goTo = (index: number) => swiperElRef.value?.swiper?.slideToLoop(index);
</script>

<style scoped>
/* До гидратации swiper-slide ещё не апгрейжен в кастомный элемент и по умолчанию
   рендерится как inline — из-за этого слайды могут "поплыть" до инициализации Swiper. */
swiper-slide {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
