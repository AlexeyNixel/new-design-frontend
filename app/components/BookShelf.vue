<template>
  <UTabs
    v-model="tab"
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
import { BookList, ComicList } from '#components';

/** Активная вкладка — снаружи по ней меняется ссылка «Полный список» */
const tab = defineModel<'books' | 'comics'>({ default: 'books' });

const items: TabsItem[] = [
  {
    label: 'Книги',
    icon: 'i-heroicons-book-open',
    value: 'books',
    component: BookList,
  },
  // {
  //   label: 'Подборки',
  //   icon: 'i-heroicons-rectangle-stack',
  //   component: BookCollections,
  // },
  {
    label: 'Комиксы / Манга',
    icon: 'i-heroicons-paint-brush',
    value: 'comics',
    component: ComicList,
  },
  // {
  //   label: 'Видеообзоры',
  //   icon: 'i-heroicons-video-camera',
  //   component: '',
  // },
];
</script>

<style scoped></style>
