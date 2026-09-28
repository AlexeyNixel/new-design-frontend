<template>
  <div>
    <h2 class="mb-6 text-xl font-bold text-gray-900 md:mb-8 md:text-2xl lg:text-3xl">
      {{ title }}
    </h2>

    <div
      v-if="data && data.length"
      class="relative pb-8 lg:pb-0"
    >
      <swiper-container
        ref="swiperElRef"
        class="block w-full"
        init="false"
        @swiperslidechange="handleSlideChange"
      >
        <swiper-slide
          v-for="item in data"
          :key="item.id"
          class="h-auto"
        >
          <!-- Отступ вокруг карточки — иначе тень/сдвиг при ховере обрезает overflow:hidden внутри swiper -->
          <div class="h-full py-3">
            <EntryCard
              :post="item"
              class="h-full"
            />
          </div>
        </swiper-slide>
      </swiper-container>

      <!-- Стрелки: видны от md и только если карточек достаточно для цикла -->
      <template v-if="showArrows">
        <button
          type="button"
          aria-label="Предыдущие новости"
          class="hidden md:flex absolute z-10 top-1/2 -translate-y-1/2 -left-2 lg:-left-4 items-center justify-center w-9 h-9 rounded bg-primary text-white hover:bg-primary/60 hover:cursor-pointer transition-colors"
          @click="goPrev"
        >
          <Icon
            name="i-heroicons-chevron-left-20-solid"
            class="w-5 h-5"
          />
        </button>
        <button
          type="button"
          aria-label="Следующие новости"
          class="hidden md:flex absolute z-10 top-1/2 -translate-y-1/2 -right-2 lg:-right-4 items-center justify-center w-9 h-9 rounded bg-primary text-white hover:bg-primary/60 hover:cursor-pointer transition-colors"
          @click="goNext"
        >
          <Icon
            name="i-heroicons-chevron-right-20-solid"
            class="w-5 h-5"
          />
        </button>
      </template>

      <!-- Точки: видны только там, где скрыты стрелки -->
      <div
        v-if="showDots"
        class="lg:hidden absolute -bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-1"
      >
        <button
          v-for="(item, index) in data"
          :key="item.id"
          type="button"
          :aria-label="`Перейти к слайду ${index + 1}`"
          class="rounded-full w-2 h-2 transition-colors hover:cursor-pointer"
          :class="index === activeIndex ? 'bg-primary' : 'bg-gray-300 hover:bg-gray-400'"
          @click="goTo(index)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEntryApi } from '~~/services/api/entryService';

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
  realIndex: number;
  slidePrev: () => void;
  slideNext: () => void;
  slideTo: (index: number) => void;
  slideToLoop: (index: number) => void;
}

const entryApi = useEntryApi();

const props = defineProps<{
  title: string;
  byTag?: string;
}>();

const { data } = await entryApi.getAllEntry({
  limit: 10,
  include: 'preview',
  ...(props.byTag ? { tags: [props.byTag] } : {}),
});

const breakpoints = {
  0: { slidesPerView: 1.22, spaceBetween: 16 },
  640: { slidesPerView: 2, spaceBetween: 16 },
  768: { slidesPerView: 3, spaceBetween: 16 },
  1024: { slidesPerView: 4, spaceBetween: 16 },
};

// Цикл и стрелки включаем, только если карточек хватает, чтобы прокрутка была осмысленной
const loopEnabled = (data?.length ?? 0) > 4;
const showArrows = loopEnabled;
const showDots = (data?.length ?? 0) > 1;

const swiperElRef = ref<SwiperContainerEl | null>(null);
const activeIndex = ref(0);

onMounted(async () => {
  await customElements.whenDefined('swiper-container');
  const el = swiperElRef.value;
  if (!el) return;
  Object.assign(el, { loop: loopEnabled, breakpoints });
  el.initialize?.();
});

const handleSlideChange = () => {
  activeIndex.value = swiperElRef.value?.swiper?.realIndex ?? 0;
};

const goPrev = () => swiperElRef.value?.swiper?.slidePrev();
const goNext = () => swiperElRef.value?.swiper?.slideNext();
const goTo = (index: number) => {
  const swiper = swiperElRef.value?.swiper;
  if (!swiper) return;
  if (loopEnabled) swiper.slideToLoop(index);
  else swiper.slideTo(index);
};
</script>

<style scoped></style>
