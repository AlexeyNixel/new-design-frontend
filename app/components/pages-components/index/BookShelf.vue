<template>
  <div>
    <header class="flex justify-between items-center">
      <h1 class="text-3xl font-bold mb-4">Книги</h1>
      <NuxtLink
        to="/public"
        class="flex items-center font-bold text-xl hover:underline"
      >
        <span> Полный список книг </span>
        <icon name="i-heroicons-arrow-long-right-16-solid"></icon>
      </NuxtLink>
    </header>
    <UTabs color="primary" :items="items">
      <template #content="{ item }">
        <component :is="item.component" />
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
import type { TabsItem } from '#ui/components/Tabs.vue';
import { BookList } from '#components';

const items: TabsItem[] = [
  {
    label: 'Книги',
    icon: 'i-heroicons-book-open',
    component: BookList,
  },
  {
    label: 'Подборки',
    icon: 'i-heroicons-rectangle-stack',
    component: '',
  },
  {
    label: 'Видеообзоры',
    icon: 'i-heroicons-video-camera',
    component: '',
  },
];
</script>

<style scoped></style>
