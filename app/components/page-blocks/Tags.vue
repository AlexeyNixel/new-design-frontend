<script setup lang="ts">
import type { PageTagsBlockItem } from '~~/services/types/page.type';

const props = defineProps<{
  title?: string;
  items: PageTagsBlockItem[];
}>();

// Тег может прийти строкой (старый формат) или объектом { text, url? }
const tags = computed(() =>
  props.items
    .map(item =>
      typeof item === 'string'
        ? { text: item, url: '' }
        : { text: item.text, url: item.url?.trim() ?? '' },
    )
    .filter(tag => tag.text),
);

const isExternal = (url: string) => /^https?:\/\//.test(url);
</script>

<template>
  <div class="my-8">
    <h3
      v-if="title"
      class="text-xl font-semibold text-gray-900 mb-4"
    >
      {{ title }}
    </h3>
    <div class="flex flex-wrap gap-3">
      <template
        v-for="(tag, index) in tags"
        :key="index"
      >
        <NuxtLink
          v-if="tag.url"
          :to="tag.url"
          :target="isExternal(tag.url) ? '_blank' : undefined"
          :rel="isExternal(tag.url) ? 'noopener noreferrer' : undefined"
          class="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm hover:bg-primary hover:text-white transition-colors"
        >
          {{ tag.text }}
          <UIcon
            :name="isExternal(tag.url) ? 'i-heroicons-arrow-top-right-on-square' : 'i-heroicons-arrow-right'"
            class="w-3.5 h-3.5"
          />
        </NuxtLink>
        <span
          v-else
          class="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm"
        >{{ tag.text }}</span>
      </template>
    </div>
  </div>
</template>
