<template>
  <div :class="bgGray ? 'bg-neutral-200' : 'bg-neutral-100'">
    <div
      class="xl:max-w-5xl 2xl:max-w-[1560px] 3xl:max-w-[1710px] mx-auto mb-10"
    >
      <div v-if="title" class="flex justify-between items-center my-8">
        <h2>{{ title }}</h2>
        <div v-if="link" class="flex items-center">
          <NuxtLink :to="link" class="mr-2"> {{ linkLabel }} </NuxtLink>
          <Icon name="mingcute:arrow-right-line"></Icon>
        </div>
      </div>
      <div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  bgGray?: boolean;
  title?: string;
  link?: string;
  linkLabel?: string;
}>();
</script>

<style scoped></style>
