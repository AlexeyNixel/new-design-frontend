<template>
  <NuxtLink :to="{ name: 'entry-slug', params: { slug: entry.slug } }">
    <div class="relative flex flex-col h-full bg-white w-full">
      <div class="w-full h-full">
        <img class="object-cover h-[300px]" :src="entry.preview.path" alt="" />
      </div>

      <div class="absolute top-5 right-0 bg-gray-200 text-black font-bold p-2">
        {{ dayjs(entry.publishedAt).format('YYYY-MM-DD') }}
      </div>

      <div class="h-full">
        <h3 class="h-full text-wrap wrap-anywhere p-2 shadow">
          {{ entry.title }}
        </h3>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { type Entry } from '~~/services/types/entry.type';
import dayjs from 'dayjs';

interface Props {
  entry: Entry;
}

defineProps<Props>();
</script>

<style scoped></style>
