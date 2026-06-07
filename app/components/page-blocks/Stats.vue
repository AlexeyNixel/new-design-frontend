<script setup lang="ts">
import type { PageStatsBlockItem } from '~~/services/types/page.type';

defineProps<{
  items: PageStatsBlockItem[];
}>();
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
    <div
      v-for="item in items"
      :key="item.label"
      class="bg-white border border-gray-100 rounded-xl p-6 text-center shadow-sm"
    >
      <div class="text-3xl font-bold text-primary mb-2">
        {{ item.value }}
      </div>
      <div class="text-sm text-gray-600">
        {{ item.label }}
      </div>
    </div>
  </div>
</template>
