<template>
  <!-- Спец-режим с несколькими изображениями и видео.
       Пока данные приходят только по одной игре (gm28) — остальное захардкожено.
       Когда API начнёт отдавать медиа для всех игр, заменить items на props. -->
  <div
    v-if="isSpecial"
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
            :allow="item.allow"
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

  <div
    v-else-if="coverFallback"
    v-image-gallery="{ modal }"
    class="items-center justify-center rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
    :class="heroCovered ? 'hidden lg:flex' : 'flex'"
  >
    <img
      :src="cover"
      :alt="alt"
      class="max-h-[460px] w-auto cursor-zoom-in object-contain"
      @error="onError"
    >
  </div>
</template>

<script setup lang="ts">
import type { Game } from '~~/services/types/game.type';
import { useStringCleaner } from '~/composables/useStringCleaner';

const props = withDefaults(
  defineProps<{
    game: Game;
    modal: unknown;
    coverFallback?: boolean;
    heroCovered?: boolean;
  }>(),
  { coverFallback: true, heroCovered: false },
);

const BASE_URL_IMAGE = 'http://infomania.ru/gamelibrary/img/game-cover/';

const { removeHtmlEntities } = useStringCleaner();

const isSpecial = computed(() => props.game.id === 'gm28');
const cover = computed(() => BASE_URL_IMAGE + props.game.cover_file);
const alt = computed(() => removeHtmlEntities(props.game.name));

const onError = (event: Event) => {
  (event.target as HTMLImageElement).src = '/placeholder.jpg';
};

const activeIndex = ref(0);
const carousel = useTemplateRef<{ emblaApi?: { scrollTo: (i: number) => void } }>(
  'carousel',
);

function select(index: number) {
  activeIndex.value = index;
  carousel.value?.emblaApi?.scrollTo(index);
}

const items = [
  {
    type: 'image',
    src: 'https://hobbygames.ru/image/cache/hobbygames_beta/data/HobbyWorld/Civilization_Noviy_Rassvet/Civilization_Newdawn-1980x1980-wm.webp',
  },
  {
    type: 'image',
    src: 'https://hobbygames.ru/image/cache/hobbygames_beta/data/HobbyWorld/Civilization_Noviy_Rassvet/Civilization_Noviy_Rassvet_02-1980x1980-wm.webp',
  },
  {
    type: 'image',
    src: 'https://hobbygames.ru/image/cache/hobbygames_beta/data/HobbyWorld/Civilization_Noviy_Rassvet/Civilization_Noviy_Rassvet_03-1980x1980-wm.webp',
  },
  {
    type: 'video',
    src: 'https://vkvideo.ru/video_ext.php?oid=-187250026&id=456239123&hash=ed3aa8ee4fcd9257&hd=4',
    allow:
      'autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;',
  },
];
</script>
