<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>

<template>
  <div class="text-center mt-12">
    <div class="inline-block bg-primary text-white text-xl font-semibold py-3 px-8 rounded-full shadow-sm">
      {{ text }}
    </div>
  </div>
</template>
