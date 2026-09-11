<template>
  <!-- Несколько изображений и/или видео — карусель с миниатюрами. -->
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
          v-if="item.type === 'image'"
          class="max-h-[440px] w-auto cursor-zoom-in rounded-xl object-contain"
          :src="item.src"
          alt=""
        >
        <div
          v-else
          class="relative w-full"
          style="padding-bottom: 56.25%"
        >
          <iframe
            :src="item.src"
            class="absolute left-0 top-0 h-full w-full rounded-xl"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
            frameborder="0"
            allowfullscreen
          />
        </div>
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
            v-if="item.type === 'image'"
            :src="item.src"
            class="h-full w-full object-cover"
            loading="lazy"
            alt=""
          >
          <span
            v-else
            class="flex h-full w-full items-center justify-center bg-gray-900"
          >
            <Icon
              name="i-heroicons-play-circle"
              class="h-8 w-8 text-white/90"
            />
          </span>
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
      :alt="game.title"
      class="max-h-[460px] w-auto cursor-zoom-in object-contain"
      @error="onError"
    >
  </div>
</template>

<script setup lang="ts">
import type { Game } from '~~/services/types/game.type';

const props = withDefaults(
  defineProps<{
    game: Game;
    modal: unknown;
    coverFallback?: boolean;
    heroCovered?: boolean;
  }>(),
  { coverFallback: true, heroCovered: false },
);

const cover = computed(() => props.game.images[0]?.file.path || '/placeholder.jpg');

const onError = (event: Event) => {
  (event.target as HTMLImageElement).src = '/placeholder.jpg';
};

type GalleryItem = { type: 'image' | 'video'; src: string };

const items = computed<GalleryItem[]>(() => {
  const images = props.game.images.map(
    (image): GalleryItem => ({ type: 'image', src: image.file.path }),
  );
  const video = props.game.videoUrl
    ? [{ type: 'video' as const, src: props.game.videoUrl }]
    : [];
  return [...images, ...video];
});

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
