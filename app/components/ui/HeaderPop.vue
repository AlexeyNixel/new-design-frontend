<template>
  <UPopover mode="hover">
    <div
      class="grid grid-cols-[auto_minmax(120px,_180px)] gap-2 p-1 items-center justify-center rounded-xl transition hover:ring-2 ring-primary hover:cursor-pointer"
    >
      <Icon :name="icon" :class="`text-${size}`" />
      <div>
        <span class="text-sm">{{ label }}</span>
      </div>
    </div>

    <template #content v-if="isPopover">
      <div class="rounded-xl overflow-hidden">
        <component :is="modal" />
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    icon: string;
    label: string;
    size?: '5xl' | '2xl';
    isPopover?: boolean;
    modal?: Component;
  }>(),
  {
    size: '5xl',
    isPopover: true,
  }
);
</script>

<style scoped></style>
