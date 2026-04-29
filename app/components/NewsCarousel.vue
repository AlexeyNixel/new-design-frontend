<template>
  <div class="news-asymmetric">
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6" v-if="entry?.length">
      <div class="lg:col-span-2">
        <EntryCardHero :post="entry[0]" />
      </div>

      <div class="lg:col-span-3">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EntryCompactCard
            v-for="item in entry.slice(1, 9)"
            :key="item.id"
            :entry="item"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEntryApi } from '~~/services/api/entryService';

const entryApi = useEntryApi();

const { data: entry } = await entryApi.getAllEntry({
  limit: 9,
  include: 'preview, department',
});
</script>
