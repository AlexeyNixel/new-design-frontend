<template>
  <CommonContentContainer>
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <NuxtLink
        to="/comics"
        class="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition-colors hover:text-primary-700"
      >
        <Icon
          name="i-heroicons-arrow-left-20-solid"
          class="h-4 w-4"
        />
        Каталог комиксов
      </NuxtLink>
    </div>

    <template v-if="comic">
      <ComicDetail
        :comic="comic"
        :other-comics="otherComics"
        :modal="modal"
      />
    </template>

    <div
      v-else
      class="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-gray-100"
    >
      <p class="text-lg font-semibold text-gray-900">
        Комикс не найден
      </p>
      <p class="mt-1 text-sm text-gray-500">
        Возможно, его убрали из каталога или ссылка устарела.
      </p>
      <NuxtLink
        to="/comics"
        class="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary-700 px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-800"
      >
        Вернуться в каталог
      </NuxtLink>
    </div>
  </CommonContentContainer>
</template>

<script setup lang="ts">
import { useComicApi } from '~~/services/api/comic.api';
import { ModalsCommon } from '#components';

const route = useRoute();
const overlay = useOverlay();
const comicApi = useComicApi();

const { data: comic } = await comicApi.getOneComic(route.params.slug as string);

// Если комикс — часть серии, показываем другие тома по порядку,
// иначе — произвольную подборку из каталога.
const { data: otherComics } = await comicApi.getAllComics(
  comic?.seriesId
    ? { seriesId: comic.seriesId, sortBy: 'volumeNumber', sortOrder: 'asc', limit: 12 }
    : { limit: 6 },
);

const modal = overlay.create(ModalsCommon);

if (comic) {
  const title = comic.title;
  const description
    = comic.description
      || `Комикс «${title}» — параметры, описание и где почитать.`;

  usePageSeo({
    title,
    description,
    image: comic.images[0]?.file.path,
    type: 'article',
  });

  const toAbsolute = useAbsoluteUrl();
  useJsonLd('content', {
    '@type': 'Book',
    'bookFormat': 'https://schema.org/GraphicNovel',
    'name': comic.title,
    'description': description,
    'image': comic.images.map(image => toAbsolute(image.file.path)),
    'url': toAbsolute(`/comics/${comic.slug}`),
    'author': comic.author ? { '@type': 'Person', 'name': comic.author } : undefined,
    'illustrator': comic.illustrator
      ? { '@type': 'Person', 'name': comic.illustrator }
      : undefined,
    'volumeNumber': comic.volumeNumber ?? undefined,
    'datePublished': comic.year ? String(comic.year) : undefined,
    'typicalAgeRange': comic.ageRating ? `${comic.ageRating}-` : undefined,
    'genre': comic.genres.map(({ genre }) => genre.title),
    'inLanguage': 'ru',
  });
}
</script>

<style scoped></style>
