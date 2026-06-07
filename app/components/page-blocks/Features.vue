<script setup lang="ts">
import type { PageFeaturesBlockItem } from '~~/services/types/page.type';

defineProps<{
  items: PageFeaturesBlockItem[];
}>();
</script>

<template>
  <div class="grid md:grid-cols-2 gap-4 my-8">
    <div
      v-for="item in items"
      :key="item.title"
      class="bg-white border border-gray-100 rounded-xl p-6 shadow-sm"
    >
      <div class="flex items-center gap-3 mb-3">
        <div class="bg-primary/10 rounded-lg p-2">
          <UIcon
            v-if="item.icon"
            :name="item.icon"
            class="w-6 h-6 text-primary"
          />
        </div>
        <h3 class="font-semibold text-gray-900">
          {{ item.title }}
        </h3>
      </div>
      <p class="text-gray-600 text-sm">
        {{ item.description }}
      </p>
    </div>
  </div>
</template>
