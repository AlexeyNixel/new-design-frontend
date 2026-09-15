<template>
  <UTabs
    color="primary"
    :items="items"
  >
    <template #content="{ item }">
      <component :is="item.component" />
    </template>
  </UTabs>
</template>

<script setup lang="ts">
import type { TabsItem } from '#ui/components/Tabs.vue';
import { BookCollections, BookList, ComicList } from '#components';

const items: TabsItem[] = [
  {
    label: 'Книги',
    icon: 'i-heroicons-book-open',
    component: BookList,
  },
  {
    label: 'Подборки',
    icon: 'i-heroicons-rectangle-stack',
    component: BookCollections,
  },
  {
    label: 'Комиксы',
    icon: 'i-heroicons-paint-brush',
    component: ComicList,
  },
  {
    label: 'Видеообзоры',
    icon: 'i-heroicons-video-camera',
    component: '',
  },
];
</script>

<style scoped></style>
