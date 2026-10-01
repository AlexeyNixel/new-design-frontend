<!-- components/MainCarousel.vue -->
<template>
  <div class="main-slider relative w-full h-full">
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

    <!-- Стрелки: прижаты к краям, невидимы до наведения на баннер; на телефоне — только свайп -->
    <button
      type="button"
      aria-label="Предыдущий слайд"
      class="slider-arrow left-3 lg:left-4"
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
      class="slider-arrow right-3 lg:right-4"
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
.slider-arrow {
  position: absolute;
  top: 50%;
  z-index: 10;
  display: none;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: rgb(255 255 255 / 0.7);
  color: var(--color-gray-800);
  box-shadow: 0 2px 10px rgb(0 0 0 / 0.12);
  backdrop-filter: blur(6px);
  opacity: 0;
  transform: translateY(-50%) scale(0.92);
  transition:
    opacity 0.25s ease,
    transform 0.25s ease,
    background-color 0.15s ease;
  cursor: pointer;
}

@media (min-width: 768px) {
  .slider-arrow {
    display: flex;
  }
}

/* Появляются при наведении на баннер или при фокусе с клавиатуры */
.main-slider:hover .slider-arrow,
.slider-arrow:focus-visible {
  opacity: 1;
  transform: translateY(-50%) scale(1);
}

.slider-arrow:hover {
  background: rgb(255 255 255 / 0.95);
}

.slider-arrow:focus-visible {
  outline: 2px solid var(--ui-primary);
  outline-offset: 2px;
}

/* До гидратации swiper-slide ещё не апгрейжен в кастомный элемент и по умолчанию
   рендерится как inline — из-за этого слайды могут "поплыть" до инициализации Swiper. */
swiper-slide {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
