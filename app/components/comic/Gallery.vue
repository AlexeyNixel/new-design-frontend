<template>
  <!-- Несколько изображений — карусель с миниатюрами. -->
  <div
    v-if="hasMultipleItems"
    class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 lg:p-6"
  >
    <div class="flex flex-col gap-4 sm:flex-row-reverse">
      <UCarousel
        ref="carousel"
        v-slot="{ item }"
        v-image-gallery="{ modal }"
        class="w-full sm:w-4/5"
        :items="items"
        :ui="{ item: 'basis-full flex items-center justify-center' }"
      >
        <img
          class="max-h-[440px] w-auto cursor-zoom-in rounded-xl object-contain"
          :src="item.src"
          alt=""
        >
      </UCarousel>

      <div
        class="flex gap-3 overflow-x-auto sm:w-1/5 sm:flex-col sm:overflow-visible"
      >
        <button
          v-for="(item, index) in items"
          :key="index"
          type="button"
          class="relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl ring-2 transition sm:w-full"
          :class="
            activeIndex === index
              ? 'ring-primary-700 opacity-100'
              : 'ring-transparent opacity-60 hover:opacity-100'
          "
          @click="select(index)"
        >
          <img
            :src="item.src"
            class="h-full w-full object-cover"
            loading="lazy"
            alt=""
          >
        </button>
      </div>
    </div>
  </div>

  <!-- Только обложка (или её нет вовсе) — просто картинка. -->
  <div
    v-else-if="coverFallback"
    v-image-gallery="{ modal }"
    class="items-center justify-center rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
    :class="heroCovered ? 'hidden lg:flex' : 'flex'"
  >
    <img
      :src="cover"
      :alt="comic.title"
      class="max-h-[460px] w-auto cursor-zoom-in object-contain"
      @error="onError"
    >
  </div>
</template>

<script setup lang="ts">
import type { Comic } from '~~/services/types/comic.type';

const props = withDefaults(
  defineProps<{
    comic: Comic;
    modal: unknown;
    coverFallback?: boolean;
    heroCovered?: boolean;
  }>(),
  { coverFallback: true, heroCovered: false },
);

const cover = computed(() => props.comic.images[0]?.file.path || '/placeholder.jpg');

const onError = (event: Event) => {
  (event.target as HTMLImageElement).src = '/placeholder.jpg';
};

type GalleryItem = { src: string };

const items = computed<GalleryItem[]>(() =>
  props.comic.images.map((image): GalleryItem => ({ src: image.file.path })),
);

const hasMultipleItems = computed(() => items.value.length > 1);

const activeIndex = ref(0);
const carousel = useTemplateRef<{ emblaApi?: { scrollTo: (i: number) => void } }>(
  'carousel',
);

function select(index: number) {
  activeIndex.value = index;
  carousel.value?.emblaApi?.scrollTo(index);
}
</script>
