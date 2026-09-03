<script setup lang="ts">
import { useEntryApi } from '~~/services/api/entryService';

const entryApi = useEntryApi();

const { data } = await entryApi.getAllEntry({
  limit: 3,
  include: 'preview',
});
console.log(data);
</script>

<template>
  <div>
    <h3>Читайте также</h3>

    <div class="flex gap-3">
      <EntryCard
        v-for="item in data"
        :key="item.id"
        :post="item"
      />
    </div>
  </div>
</template>

<style scoped></style>
