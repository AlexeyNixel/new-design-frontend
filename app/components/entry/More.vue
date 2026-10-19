<script setup lang="ts">
import { useEntryApi } from '~~/services/api/entryService';
import type { Post } from '~~/services/types/post.type';
import { BROAD_POST_TAGS } from '~/utils/postTags';

// «Читайте также»: публикации с теми же узкими тегами (Библионочь,
// День игр...), затем того же отдела, и одна самая свежая новость.
// API при нескольких тегах ищет пересечение, поэтому запрос — на каждый тег.
const props = defineProps<{
  post: Pick<Post, 'id' | 'departmentId' | 'tags'>;
}>();

/** На странице поста теги приходят плоско ({ id, label }), в списках — как { tag } */
type TagLink = { id?: string; tag?: { id: string } };

const SHOWN = 3;
/** Сколько узких тегов учитывать — дальше запросы почти ничего не добавляют */
const MAX_TAGS = 2;
/** С запасом: среди результатов может оказаться сам пост */
const LIMIT = SHOWN + 1;

const entryApi = useEntryApi();
const include = 'preview, department';

const tagIds = ((props.post.tags ?? []) as TagLink[])
  .map(link => link.id ?? link.tag?.id)
  .filter((id): id is string => !!id && !BROAD_POST_TAGS.includes(id))
  .slice(0, MAX_TAGS);

const [latest, ...similarSources] = await Promise.all([
  entryApi.getAllEntry({ limit: LIMIT, include }),
  ...tagIds.map(tag =>
    entryApi.getAllEntry({ limit: LIMIT, include, tags: [tag] }),
  ),
  props.post.departmentId
    ? entryApi.getAllEntry({
        limit: LIMIT,
        include,
        department: props.post.departmentId,
      })
    : null,
]);

// Последнее место всегда за свежей новостью: похожие часто оказываются
// архивом прошлых лет, а так блок ведёт и к актуальному
const related = computed(() => {
  const seen = new Set([props.post.id]);
  const unseen = (items: Post[]) =>
    items.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });

  const fresh = unseen(latest?.data ?? []).slice(0, 1);
  const similar = unseen(
    similarSources.flatMap(source => source?.data ?? []),
  ).slice(0, SHOWN - fresh.length);
  // Похожих не хватило — добираем свежими
  const filler = unseen(latest?.data ?? []).slice(
    0,
    SHOWN - fresh.length - similar.length,
  );
  return [...similar, ...filler, ...fresh];
});
</script>

<template>
  <section
    v-if="related.length"
    aria-labelledby="more-title"
  >
    <h2
      id="more-title"
      class="text-2xl font-bold text-gray-900 dark:text-white mb-4"
    >
      Читайте также
    </h2>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <EntryCard
        v-for="item in related"
        :key="item.id"
        :post="item"
      />
    </div>
  </section>
</template>
