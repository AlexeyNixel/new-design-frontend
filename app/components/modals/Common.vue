<script setup lang="ts">
const props = defineProps<{
  imgLinks: string[];
  startIndex: number;
}>();

// Нативный веб-компонент из nuxt-swiper (swiper/element), см. app/components/MainCarousel.vue.
type SwiperContainerEl = HTMLElement & { swiper?: SwiperInstance };
interface SwiperInstance {
  activeIndex: number;
  slideTo: (index: number) => void;
  slidePrev: () => void;
  slideNext: () => void;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

const swiperElRef = ref<SwiperContainerEl | null>(null);
const activeIndex = ref(props.startIndex || 0);
const zoom = ref(MIN_ZOOM);
const baseRect = ref<{ width: number; height: number } | null>(null);

// Пока зум не тронут — картинка сидит на чистом CSS (object-contain),
// без него нет ни белых полей, ни лишних пересчётов.
const zoomStyle = computed(() => {
  if (zoom.value === MIN_ZOOM || !baseRect.value) return undefined;
  return {
    width: `${baseRect.value.width * zoom.value}px`,
    height: `${baseRect.value.height * zoom.value}px`,
    maxWidth: 'none',
    maxHeight: 'none',
  };
});

const resetZoom = () => {
  zoom.value = MIN_ZOOM;
  baseRect.value = null;
};

const handleSlideChange = () => {
  activeIndex.value = swiperElRef.value?.swiper?.activeIndex ?? 0;
  resetZoom();
};

const selectSlide = (index: number) => {
  swiperElRef.value?.swiper?.slideTo(index);
};

const goPrev = () => swiperElRef.value?.swiper?.slidePrev();
const goNext = () => swiperElRef.value?.swiper?.slideNext();

const handleWheelZoom = (event: WheelEvent) => {
  const img = (event.currentTarget as HTMLElement).querySelector('img');
  if (!img) return;

  event.preventDefault();

  if (!baseRect.value) {
    const rect = img.getBoundingClientRect();
    baseRect.value = { width: rect.width, height: rect.height };
  }

  const direction = event.deltaY < 0 ? 1 : -1;
  zoom.value = Math.min(
    MAX_ZOOM,
    Math.max(MIN_ZOOM, +(zoom.value + direction * ZOOM_STEP).toFixed(2)),
  );
};
</script>

<template>
  <UModal
    fullscreen
    :ui="{
      overlay: 'bg-black/90',
      content: 'bg-black border-0 shadow-none ring-0 rounded-none divide-y-0',
    }"
    title="Расширенное отображение"
    description="Просмотр изображений"
  >
    <template #content="{ close }">
      <div class="relative flex h-full w-full flex-col">
        <UButton
          icon="i-heroicons-x-mark"
          variant="solid"
          size="xl"
          class="absolute right-3 top-3 z-20 rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6 sm:top-6"
          aria-label="Закрыть"
          @click="close"
        />

        <div class="relative min-h-0 flex-1">
          <swiper-container
            ref="swiperElRef"
            class="block h-full w-full"
            :initial-slide="startIndex || 0"
            @swiperslidechange="handleSlideChange"
          >
            <swiper-slide
              v-for="(item, index) in imgLinks"
              :key="index"
            >
              <div
                class="flex h-full w-full items-center justify-center overflow-auto"
                @wheel="handleWheelZoom"
              >
                <img
                  :src="item"
                  alt=""
                  class="max-h-full max-w-full cursor-zoom-in select-none object-contain"
                  :style="index === activeIndex ? zoomStyle : undefined"
                >
              </div>
            </swiper-slide>
          </swiper-container>

          <!-- Стрелки -->
          <button
            v-if="imgLinks.length > 1"
            type="button"
            aria-label="Предыдущее изображение"
            class="absolute z-10 top-1/2 -translate-y-1/2 left-2 sm:left-6 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 hover:cursor-pointer transition-colors"
            @click="goPrev"
          >
            <Icon
              name="i-heroicons-chevron-left-20-solid"
              class="w-6 h-6"
            />
          </button>
          <button
            v-if="imgLinks.length > 1"
            type="button"
            aria-label="Следующее изображение"
            class="absolute z-10 top-1/2 -translate-y-1/2 right-2 sm:right-6 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 hover:cursor-pointer transition-colors"
            @click="goNext"
          >
            <Icon
              name="i-heroicons-chevron-right-20-solid"
              class="w-6 h-6"
            />
          </button>
        </div>

        <div
          v-if="imgLinks.length > 1"
          class="flex shrink-0 justify-center gap-2 overflow-x-auto px-4 py-3"
        >
          <button
            v-for="(item, index) in imgLinks"
            :key="index"
            type="button"
            class="size-12 shrink-0 overflow-hidden rounded-lg opacity-40 ring-2 transition sm:size-14"
            :class="
              activeIndex === index
                ? 'opacity-100 ring-white'
                : 'ring-transparent hover:opacity-80'
            "
            @click="selectSlide(index)"
          >
            <img
              :src="item"
              class="h-full w-full object-cover"
              loading="lazy"
              alt=""
            >
          </button>
        </div>
      </div>
    </template>
  </UModal>
</template>
