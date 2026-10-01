<!-- Блок «Анонсы и события» на главной.
     Слева — закреплённая новость, в центре — анонсы (что будет), справа — события
     (что было + всё «Актуальное»). Партнёрские новости сюда не попадают —
     у них свой блок внизу страницы. -->
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6">
    <!-- Закреплённая новость -->
    <div
      v-if="pinned"
      class="md:col-span-2 xl:col-span-4"
    >
      <EntryCardHero :post="pinned" />
    </div>

    <!-- Анонсы -->
    <div
      v-if="announcements.length"
      class="flex flex-col xl:col-span-4"
    >
      <div class="flex items-center justify-between gap-3 mb-3">
        <h3 class="flex items-center gap-2 text-lg font-bold text-gray-900">
          <Icon
            name="i-heroicons-megaphone-20-solid"
            class="w-5 h-5 text-secondary"
          />
          Анонсы
        </h3>
        <NuxtLink
          :to="{ path: '/post', query: { tags: POST_TAG.announcement } }"
          class="group flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Все анонсы
          <Icon
            name="mingcute:arrow-right-line"
            class="group-hover:translate-x-1 transition-transform"
          />
        </NuxtLink>
      </div>

      <div class="flex flex-col gap-2 flex-1">
        <EntryCompactCard
          v-for="post in announcements"
          :key="post.id"
          :post="post"
          class="flex-1"
        />
      </div>
    </div>

    <!-- События -->
    <div
      v-if="events.length"
      class="flex flex-col xl:col-span-4"
    >
      <div class="flex items-center justify-between gap-3 mb-3">
        <h3 class="flex items-center gap-2 text-lg font-bold text-gray-900">
          <Icon
            name="i-heroicons-sparkles-20-solid"
            class="w-5 h-5 text-primary"
          />
          События
        </h3>
        <NuxtLink
          :to="{ path: '/post', query: { tags: POST_TAG.event } }"
          class="group flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Все события
          <Icon
            name="mingcute:arrow-right-line"
            class="group-hover:translate-x-1 transition-transform"
          />
        </NuxtLink>
      </div>

      <!-- Плитки тянутся на высоту соседних колонок -->
      <div class="grid grid-cols-2 auto-rows-fr gap-3 flex-1">
        <div
          v-for="post in events"
          :key="post.id"
          class="min-h-40"
        >
          <EntryOverlayTile
            :post="post"
            sizes="(max-width: 768px) 50vw, 280px"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEntryApi } from '~~/services/api/entryService';
import type { Post } from '~~/services/types/post.type';
import dayjs from 'dayjs';

const ANNOUNCEMENTS_LIMIT = 4;
const EVENTS_LIMIT = 4;

const entryApi = useEntryApi();
const include = 'preview, department, tags';

// API фильтрует по нескольким тегам через «И», а исключать теги не умеет —
// поэтому тянем каждую категорию отдельно и раскладываем по getPostKind().
// Запас в limit — на случай, если часть окажется партнёрской, «Актуальным» или закреплённой.
const [announcementRes, eventRes, actualRes, pinnedRes] = await Promise.all([
  entryApi.getAllEntry({ limit: ANNOUNCEMENTS_LIMIT + 4, include, tags: [POST_TAG.announcement] }),
  entryApi.getAllEntry({ limit: EVENTS_LIMIT + 3, include, tags: [POST_TAG.event] }),
  entryApi.getAllEntry({ limit: EVENTS_LIMIT, include, tags: [POST_TAG.actual] }),
  entryApi.getPinnedPost(),
]);

const pinned = pinnedRes.data?.id ? pinnedRes.data : null;

const byDateDesc = (a: Post, b: Post) =>
  dayjs(b.publishedAt).valueOf() - dayjs(a.publishedAt).valueOf();

// Все посты без дублей (одна новость может прийти из нескольких запросов)
// и без закреплённой — она показана отдельно
const allPosts = [
  ...(announcementRes.data ?? []),
  ...(eventRes.data ?? []),
  ...(actualRes.data ?? []),
]
  .filter((post, index, list) => list.findIndex(p => p.id === post.id) === index)
  .filter(post => post.id !== pinned?.id)
  .sort(byDateDesc);

const collect = (kind: PostKind, limit: number): Post[] =>
  allPosts.filter(post => getPostKind(post) === kind).slice(0, limit);

const announcements = collect('announcement', ANNOUNCEMENTS_LIMIT);
const events = collect('event', EVENTS_LIMIT);
</script>
