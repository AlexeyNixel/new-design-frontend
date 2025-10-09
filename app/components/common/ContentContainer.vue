<template>
  <div :class="bgGray ? 'bg-neutral-200' : 'bg-neutral-100'">
    <div class="max-w-[1710px] mx-auto mb-10">
      <div class="my-8">
        <h1>{{ title }}</h1>
      </div>
      <div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  bgGray?: boolean;
  title?: string;
}>();
</script>

<style scoped></style>
