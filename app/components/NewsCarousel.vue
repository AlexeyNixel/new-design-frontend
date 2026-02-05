<template>
  <div class="flex w-full">
    <div class="w-full">
      <UCarousel
        arrows
        :items="entry"
        :ui="ui"
        v-slot="{ item, index }"
        @select="handleSelect"
      >
        <EntryCard :class="`index-${index}`" :entry="item" />
      </UCarousel>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEntryApi } from '~~/services/api/entryService';

const currentIndex = ref();

const ui = {
  root: 'h-full flex',
  viewport: 'h-full ',
  item: 'h-full w-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 transition-opacity ',
  container: 'h-full',
  arrows: 'absolute right-15 bottom-5',
  prev: ' rounded  bg-primary text-white border-0 ring-0 hover:bg-primary-100 hover:cursor-pointer',
  next: ' rounded  bg-primary text-white border-0 ring-0 hover:bg-primary-100 hover:cursor-pointer',
};

const entryApi = useEntryApi();

const { data: entry } = await entryApi.getAllEntry({
  limit: 12,
  include: 'preview, department',
});

const handleSelect = (index: number) => {
  currentIndex.value = index;
};
</script>

<style scoped>
.flip {
  writing-mode: sideways-lr;
}
</style>
