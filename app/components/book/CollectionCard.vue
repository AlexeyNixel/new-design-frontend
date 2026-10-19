<script setup lang="ts">
import type { BookCollections } from '~~/services/types/book.type';

// Карточка подборки: цветное поле с веером обложек, название, описание и число книг.
// Цвета — те же, что у плакатов афиши: раздел книг и афиша выглядят одной семьёй.
const props = withDefaults(
  defineProps<{
    collection: BookCollections;
    /** Порядковый номер — от него цвет карточки */
    index?: number;
    eager?: boolean;
  }>(),
  { index: 0, eager: false },
);

const TONES = [
  'bg-[#157486] text-white',
  'bg-[#F2B632] text-[#0d2a30]',
  'bg-[#7B3F8C] text-white',
  'bg-[#0d4954] text-white',
];

const tone = computed(() => TONES[props.index % TONES.length]);
const count = computed(() => props.collection.bookCount ?? props.collection.books?.length ?? 0);
const covers = computed(() => props.collection.covers ?? props.collection.books ?? []);
</script>

<template>
  <NuxtLink
    :to="`/books/collections/${collection.slug || collection.id}`"
    class="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-lg focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#0d4954]"
  >
    <div
      class="px-6 pb-2 pt-8"
      :class="tone"
    >
      <BookCoverFan
        :covers="covers"
        :height="150"
        :eager="eager"
      />
    </div>

    <div class="flex flex-1 flex-col p-5">
      <h3 class="text-lg font-bold leading-snug text-gray-900 group-hover:underline group-hover:underline-offset-4">
        {{ collection.label }}
      </h3>
      <p
        v-if="collection.description"
        class="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600"
      >
        {{ collection.description }}
      </p>
      <p class="mt-auto pt-4 text-sm font-semibold text-[#157486]">
        {{ count }} {{ pluralBooks(count) }} в подборке
      </p>
    </div>
  </NuxtLink>
</template>
