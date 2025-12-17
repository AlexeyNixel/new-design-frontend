<template>
  <div>
    <UButton @mouseover="isOpen = true"></UButton>
    <div v-if="isOpen">Какой-то контент</div>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false);
</script>

<style scoped></style>
