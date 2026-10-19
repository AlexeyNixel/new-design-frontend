<script setup lang="ts">
import { useEntryApi } from '~~/services/api/entryService';
import type { Post } from '~~/services/types/post.type';
import { isInSeries, seriesFromTitle } from '~/utils/postSeries';

// «Конкурс в другие годы»: публикации той же серии (одно название в кавычках),
// сгруппированные по годам. Анонс этого года ведёт к итогам прошлых — и наоборот.
const props = defineProps<{
  post: Pick<Post, 'id' | 'title'>;
}>();

/** Сколько лет показывать сразу — остальное по ссылке на поиск */
const YEARS_SHOWN = 5;
/** Меньше двух других публикаций — это не серия */
const MIN_POSTS = 2;

const series = seriesFromTitle(props.post.title);
let related: Post[] = [];

if (series) {
  const entryApi = useEntryApi();
  // Поиск API ищет и по тексту — оставляем только посты, где серия в заголовке
  const { data } = await entryApi.getAllEntry({ search: series.name, limit: 60 });
  related = (data ?? []).filter(item => item.id !== props.post.id && isInSeries(item.title, series));
}

const years = computed(() => {
  const groups = new Map<string, Post[]>();
  for (const item of related) {
    const year = (item.publishedAt ?? item.createdAt ?? '').slice(0, 4) || 'Ранее';
    groups.set(year, [...(groups.get(year) ?? []), item]);
  }
  return [...groups]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, items]) => ({ year, items }));
});

const shownYears = computed(() => years.value.slice(0, YEARS_SHOWN));
const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }) : '';
</script>

<template>
  <section
    v-if="series && related.length >= MIN_POSTS"
    class="my-10 rounded-2xl bg-[#0d4954] p-6 text-white sm:p-8"
    aria-labelledby="series-title"
  >
    <h2
      id="series-title"
      class="text-xl font-bold sm:text-2xl"
    >
      «{{ series.name }}» в другие годы
    </h2>

    <ol class="mt-6 space-y-6">
      <li
        v-for="group in shownYears"
        :key="group.year"
        class="grid gap-3 sm:grid-cols-[5rem_1fr]"
      >
        <span class="text-2xl font-bold tabular-nums text-[#F2B632]">{{ group.year }}</span>
        <ul class="space-y-2">
          <li
            v-for="item in group.items"
            :key="item.id"
          >
            <NuxtLink
              :to="`/post/${item.slug}`"
              class="group flex flex-col gap-0.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span class="font-medium leading-snug group-hover:underline group-hover:underline-offset-4">
                {{ item.title }}
              </span>
              <span class="text-sm text-white/60">{{ formatDate(item.publishedAt) }}</span>
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ol>

    <NuxtLink
      :to="{ path: '/post', query: { search: series.name } }"
      class="mt-6 inline-flex items-center gap-1 font-semibold text-[#F2B632] hover:underline"
    >
      Все публикации про «{{ series.name }}»
    </NuxtLink>
  </section>
</template>
