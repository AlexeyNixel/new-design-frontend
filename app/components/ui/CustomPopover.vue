<template>
  <UPopover
    mode="hover"
    :content="{ side: side }"
    class="transition hover:cursor-pointer"
  >
    <UButton
      :label="label"
      :icon="icon"
      variant="soft"
      color="neutral"
      size="xl"
    />

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
