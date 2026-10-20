<template>
  <component
    :is="item.to ? NuxtLink : 'span'"
    v-bind="linkAttrs"
    class="inline-flex max-w-full items-start gap-2 align-top transition-colors focus-visible:outline-3 focus-visible:outline-primary-500"
  >
    <UiNavIcon
      v-if="withIcon"
      :icon="item.icon"
      :to="item.to"
      fallback="i-heroicons-document-text"
      class="mt-0.5 size-[18px] shrink-0 text-primary-700"
    />
    <span class="min-w-0">
      <template
        v-for="(part, i) in parts"
        :key="i"
      >
        <mark
          v-if="part.match"
          class="rounded bg-primary-700/10 font-semibold text-primary-800"
        >{{ part.text }}</mark>
        <template v-else>{{ part.text }}</template>
      </template>
      <Icon
        v-if="item.external"
        name="i-heroicons-arrow-up-right-20-solid"
        class="ml-1 inline-block size-3.5 align-[-0.1em] opacity-50"
        aria-label="откроется на другом сайте"
      />
      <span
        v-if="isCurrent"
        class="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500"
      >вы здесь</span>
    </span>
  </component>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components';

export interface SitemapItem {
  id: string;
  title: string;
  icon?: string;
  to?: string;
  external: boolean;
}

// Ссылка карты сайта: внутренняя — NuxtLink, внешняя — в новой вкладке,
// без адреса — просто текст. parts — заголовок, разбитый для подсветки поиска.
const props = defineProps<{
  item: SitemapItem;
  parts: { text: string; match: boolean }[];
  withIcon?: boolean;
}>();

const route = useRoute();
const isCurrent = computed(() => !props.item.external && props.item.to === route.path);

const linkAttrs = computed(() => {
  if (!props.item.to) return {};
  if (props.item.external) {
    return { to: props.item.to, target: '_blank', rel: 'noopener', external: true };
  }
  return { 'to': props.item.to, 'aria-current': isCurrent.value ? 'page' : undefined };
});
</script>
