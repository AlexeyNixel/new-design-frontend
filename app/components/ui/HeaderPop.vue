<template>
  <UPopover mode="hover">
    <div
      class="flex flex-row items-center justify-start gap-2 p-2 rounded-xl transition hover:ring-2 ring-primary hover:cursor-pointer w-full"
    >
      <Icon :name="icon" class="text-xl lg:text-4xl" />
      <div class="min-w-max flex-1">
        <span class="text-xs lg:text-sm break-words leading-0">
          {{ label }}
          <slot />
        </span>
      </div>
    </div>

    <template #content v-if="isPopover">
      <div class="rounded-xl overflow-hidden max-w-[90vw] lg:max-w-none">
        <component :is="modal" />
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    icon: string;
    label?: string;
    size?: string;
    isPopover?: boolean;
    modal?: Component;
  }>(),
  {
    size: '2xl lg:5xl',
    isPopover: true,
  }
);
</script>
