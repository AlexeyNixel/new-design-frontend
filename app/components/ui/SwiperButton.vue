<template>
  <UButton
    color="warning"
    :icon="
      direction === 'left'
        ? 'i-heroicons-arrow-left-20-solid'
        : 'i-heroicons-arrow-right-20-solid'
    "
  ></UButton>
</template>

<script setup lang="ts">
defineProps<{
  direction: 'left' | 'right';
}>();
</script>
<style scoped></style>
