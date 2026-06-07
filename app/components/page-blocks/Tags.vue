<script setup lang="ts">
defineProps<{
  title?: string;
  items: string[];
}>();
</script>

<template>
  <div class="my-8">
    <h3
      v-if="title"
      class="text-xl font-semibold text-gray-900 mb-4"
    >
      {{ title }}
    </h3>
    <div class="flex flex-wrap gap-3">
      <span
        v-for="tag in items"
        :key="tag"
        class="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm"
      >{{ tag }}</span>
    </div>
  </div>
</template>
