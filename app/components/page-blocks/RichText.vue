<script setup lang="ts">
defineProps<{
  html: string;
}>();
</script>

<template>
  <div
    class="prose prose-lg max-w-none text-gray-700 leading-relaxed [&_p]:mb-6 [&_p:last-child]:mb-0"
    v-html="html"
  />
</template>
