<!-- Блок «Новости партнёров» на главной: 5 последних новостей с тегом «Партнёр»
     в компактных карточках, как в «Анонсах». -->
<template>
  <div
    v-if="posts.length"
    class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3"
  >
    <EntryCompactCard
      v-for="post in posts"
      :key="post.id"
      :post="post"
      stack-on-xl
      class="md:last:odd:col-span-2 xl:last:odd:col-span-1"
    />
  </div>
</template>

<script setup lang="ts">
import { useEntryApi } from '~~/services/api/entryService';

const LIMIT = 5;

const entryApi = useEntryApi();

const { data } = await entryApi.getAllEntry({
  limit: LIMIT,
  include: 'preview',
  tags: [POST_TAG.partner],
});

const posts = data ?? [];
</script>
