<template>
  <div>
    <h1>События</h1>

    <div class="flex gap-5">
      <NuxtLink
        class="flex py-5 flip items-center bg-red-500 p-2 text-white hover:bg-red-600 hover:cursor-pointer font-bold text-lg"
      >
        <span> Все события </span>
        <Icon name="i-heroicons-arrow-up-16-solid" />
      </NuxtLink>

      <div class="w-full">
        <UCarousel arrows loop :items="entry" :ui="ui" v-slot="{ item }">
          <EntryCard :entry="item" />
        </UCarousel>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEntryApi } from '~~/services/api/entryService';

const ui = {
  root: 'h-full flex',
  viewport: 'h-full ',
  item: 'h-full w-full basis-1/5 transition-opacity ',
  container: 'h-full',
  arrows: 'absolute right-15 bottom-5',
  prev: ' rounded  bg-primary text-white border-0 ring-0 hover:bg-primary-100 hover:cursor-pointer',
  next: ' rounded  bg-primary text-white border-0 ring-0 hover:bg-primary-100 hover:cursor-pointer',
};

const entryApi = useEntryApi();

const { data: entry } = await entryApi.getAllEntry({
  pageSize: 12,
  include: 'preview',
  orderBy: '-createdAt',
});
</script>

<style scoped>
.flip {
  writing-mode: sideways-lr;
}
</style>
