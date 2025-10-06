<template>
  <UPopover
    :mode="mode"
    :content="{ side: side }"
    class="transition hover:cursor-pointer hover:bg-red-600"
  >
    <UButton
      :label="label"
      :icon="icon"
      variant="link"
      color="neutral"
    ></UButton>

    <template #content>
      <div class="flex flex-col p-2 gap-2">
        <slot />
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  icon: string;
  mode: 'hover' | 'click';
  side: 'bottom' | 'right';
}
defineProps<Props>();
</script>

<style scoped></style>
