<script setup lang="ts">
import { useEntryApi } from '~~/services/api/entryService';

const entryApi = useEntryApi();

const { data: competitions } = await entryApi.getAllEntry({
  tags: '0ad82318-87f3-4c0c-a0b2-a0d765f9d7e3',
  include: 'preview',
});
</script>

<template>
  <CommonContentContainer>
    <h1 class="mb-6">Архив конкурсов</h1>
    <div class="flex flex-col gap-4">
      <entry-tile v-for="item in competitions" :key="item.id" :entry="item" />
    </div>
  </CommonContentContainer>
</template>

<style scoped></style>
