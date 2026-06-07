<script setup lang="ts">
defineProps<{
  title: string;
  items: string[];
}>();
</script>

<template>
  <div class="bg-neutral-100 border border-gray-100 rounded-xl p-6 my-8">
    <h3 class="text-lg font-semibold text-gray-900 mb-3">
      {{ title }}
    </h3>
    <ul class="space-y-2 text-gray-700">
      <li
        v-for="item in items"
        :key="item"
        class="flex items-start gap-2"
      >
        <UIcon
          name="i-heroicons-check-circle"
          class="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
        />
        <span>{{ item }}</span>
      </li>
    </ul>
  </div>
</template>
