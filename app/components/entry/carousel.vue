<script setup lang="ts">
import { useEntryApi } from '~~/services/api/entryService';

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

const carouselUi = {
  root: 'relative',
  viewport: 'overflow-hidden',
  container: '-ms-4 items-stretch',
  item: 'ps-4 basis-[82%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4',
  prev: `
    hidden md:flex -start-2 lg:-start-4
    rounded bg-primary text-white border-0 ring-0
    hover:bg-primary/60 hover:cursor-pointer
    disabled:opacity-40
  `,
  next: `
    hidden md:flex -end-2 lg:-end-4
    rounded bg-primary text-white border-0 ring-0
    hover:bg-primary/60 hover:cursor-pointer
    disabled:opacity-40
  `,
  dots: 'lg:hidden -bottom-7',
  dot: 'w-2 h-2 data-[state=active]:bg-primary mx-0.5',
};
</script>

<template>
  <div>
    <h3 class="mb-6 text-xl font-bold text-gray-900 md:mb-8 md:text-2xl lg:text-3xl">
      {{ title }}
    </h3>

    <UCarousel
      v-if="data && data.length"
      v-slot="{ item }"
      :items="data"
      :arrows="data.length > 4"
      :dots="data.length > 1"
      :loop="data.length > 4"
      align="start"
      :ui="carouselUi"
      class="pb-8 lg:pb-0"
    >
      <EntryCard
        :key="item.id"
        :post="item"
        class="h-full"
      />
    </UCarousel>
  </div>
</template>

<style scoped></style>
