<script setup lang="ts">
const items = ref([
  {
    label: 'Главная',
    icon: 'i-heroicons-home',
    to: '/',
  },
  {
    label: 'Новости',
    icon: 'i-heroicons-newspaper',
    to: '/entry',
  },
]);
</script>

<template>
  <div>
    <UBreadcrumb class="text-black" :items="items" />

    <div>
      <slot />
    </div>
  </div>
</template>

<style scoped></style>
