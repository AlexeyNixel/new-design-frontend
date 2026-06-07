<script setup lang="ts">
defineProps<{
  name: string;
  position: string;
  icon?: string;
}>();
</script>

<template>
  <div class="flex items-center gap-4 p-4 bg-neutral-100 border border-gray-100 rounded-xl mt-8">
    <div class="bg-primary/10 rounded-full p-3">
      <UIcon
        :name="icon || 'i-heroicons-user-circle'"
        class="w-8 h-8 text-primary"
      />
    </div>
    <div>
      <p class="text-sm text-gray-500">
        Руководитель отдела
      </p>
      <p class="font-semibold text-gray-900">
        {{ name }}
      </p>
      <p class="text-sm text-gray-600">
        {{ position }}
      </p>
    </div>
  </div>
</template>
