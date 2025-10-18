<template>
  <UCarousel
    arrows
    loop
    :ui="ui"
    :items="notifications"
    v-slot="{ item }"
    class="h-full"
  >
    <div class="flex flex-col justify-between h-full">
      <div>
        <h3 class="font-bold text-xl mb-2">{{ item.title }}</h3>
        <p>{{ item.message }}</p>
      </div>
      <NuxtLink>Подробнее</NuxtLink>
    </div>
  </UCarousel>
</template>

<script setup lang="ts">
const notifications = [
  {
    title: 'Время работы библиотеки изменилось!',
    message: 'Время работы библиотеки изменилось!',
    link: '/',
  },
  {
    title: 'Время работы библиотеки не изменилось!',
    message: 'Время работы библиотеки не изменилось!',
    link: '/',
  },
];

const ui = {
  viewport: 'h-full rounded',
  item: 'h-full',
  container: 'h-full',
  arrows: 'absolute right-15 bottom-5',
  prev: ' rounded  bg-primary text-white border-0 ring-0 hover:bg-primary-100 hover:cursor-pointer',
  next: ' rounded  bg-primary text-white border-0 ring-0 hover:bg-primary-100 hover:cursor-pointer',
  dots: 'absolute bottom-5',
  dot: 'w-6 h-1',
};
</script>

<style scoped></style>
