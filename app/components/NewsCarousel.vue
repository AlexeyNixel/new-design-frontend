<template>
  <div class="news-asymmetric">
    <div
      v-if="posts?.length"
      class="grid grid-cols-1 lg:grid-cols-5 gap-6"
    >
      <div class="lg:col-span-2">
        <EntryCardHero :post="pinnedPost" />
      </div>

      <div class="lg:col-span-3">
        <div class="grid grid-cols-1 items-stretch md:grid-cols-2 h-full gap-4">
          <EntryCompactCard
            v-for="post in posts"
            :key="post.id"
            :post="post"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEntryApi } from '~~/services/api/entryService';

const entryApi = useEntryApi();

const { data: posts } = await entryApi.getAllEntry({
  limit: 8,
  include: 'preview, department, tags',
});

const { data: pinnedPost } = await entryApi.getPinnedPost();
</script>
