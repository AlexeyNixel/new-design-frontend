<script setup lang="ts">
import type { PageArchiveBlockItem } from '~~/services/types/page.type';

defineProps<{
  title: string;
  note?: string;
  items: PageArchiveBlockItem[];
}>();
</script>

<template>
  <details class="group bg-neutral-100 border border-gray-100 rounded-xl my-8">
    <summary
      class="flex items-center gap-3 p-5 cursor-pointer list-none select-none [&::-webkit-details-marker]:hidden"
    >
      <div class="bg-primary/10 rounded-lg p-2 shrink-0">
        <UIcon
          name="i-heroicons-folder-open"
          class="w-5 h-5 text-primary"
        />
      </div>

      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-gray-900">
          {{ title }}
        </h3>
        <p
          v-if="note"
          class="text-sm text-gray-500 mt-0.5"
        >
          {{ note }}
        </p>
      </div>

      <span
        class="shrink-0 text-xs font-bold text-primary bg-primary/10 rounded-full px-2.5 py-1"
      >
        {{ items.length }}
      </span>
      <UIcon
        name="i-heroicons-chevron-down"
        class="w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 group-open:rotate-180"
      />
    </summary>

    <ul
      class="max-h-96 overflow-y-auto px-5 pb-5 pt-1 space-y-1 border-t border-gray-100"
    >
      <li
        v-for="(item, index) in items"
        :key="index"
      >
        <a
          :href="item.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-baseline gap-2.5 rounded-lg px-3 py-2 -mx-3 hover:bg-primary/5 transition-colors"
        >
          <span
            v-if="item.date"
            class="shrink-0 text-xs font-bold text-primary tabular-nums"
          >
            {{ item.date }}
          </span>
          <span class="text-sm text-gray-700">
            {{ item.text }}
          </span>
        </a>
      </li>
    </ul>
  </details>
</template>
