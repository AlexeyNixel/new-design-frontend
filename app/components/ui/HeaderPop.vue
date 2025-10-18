<template>
  <UPopover mode="hover">
    <div
      class="flex flex-row items-center justify-start gap-2 p-2 rounded-xl transition hover:ring-2 ring-primary hover:cursor-pointer w-full"
    >
      <Icon
        :name="icon"
        :class="`text-${size.split(' ')[0]} lg:text-${size.split(' ')[1] || size.split(' ')[0]}`"
      />
      <div class="min-w-0 flex-1">
        <span class="text-xs lg:text-sm leading-tight break-words">
          {{ label }}
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
    label: string;
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
