<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  badge?: string;
}>();
</script>

<template>
  <div class="bg-primary rounded-xl p-8 text-center text-white my-8">
    <h3 class="text-2xl font-bold mb-3">
      {{ title }}
    </h3>
    <p class="text-white/80 mb-4">
      {{ description }}
    </p>
    <div
      v-if="badge"
      class="inline-flex bg-white/15 backdrop-blur-sm rounded-full px-6 py-2"
    >
      <span class="text-sm">{{ badge }}</span>
    </div>
  </div>
</template>
