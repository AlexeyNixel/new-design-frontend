<script setup lang="ts">
import type { PageContentBlock } from '~~/services/types/page.type';

defineProps<{
  blocks: PageContentBlock[];
}>();
</script>

<template>
  <template
    v-for="(block, index) in blocks"
    :key="index"
  >
    <PageBlocksStats
      v-if="block.type === 'stats'"
      :items="block.items"
    />
    <PageBlocksFeatures
      v-else-if="block.type === 'features'"
      :items="block.items"
    />
    <PageBlocksTags
      v-else-if="block.type === 'tags'"
      :title="block.title"
      :items="block.items"
    />
    <PageBlocksAdvantages
      v-else-if="block.type === 'advantages'"
      :title="block.title"
      :items="block.items"
    />
    <PageBlocksHighlight
      v-else-if="block.type === 'highlight'"
      :title="block.title"
      :description="block.description"
      :badge="block.badge"
    />
    <PageBlocksPerson
      v-else-if="block.type === 'person'"
      :name="block.name"
      :position="block.position"
      :icon="block.icon"
    />
    <PageBlocksBanner
      v-else-if="block.type === 'banner'"
      :text="block.text"
    />
    <PageBlocksRichText
      v-else-if="block.type === 'richText'"
      :html="block.html"
    />
  </template>
</template>
