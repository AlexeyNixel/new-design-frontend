<template>
  <CommonContentContainer>
    <h1 class="sr-only">
      Комиксы
    </h1>
    <CommonCatalogFilters
      v-model:search="searchText"
      search-placeholder="Поиск комикса..."
      :active-count="activeFiltersCount"
      @search="searchData"
      @reset="resetFilters"
    >
      <template #active>
        <button
          v-for="genre in selectedGenres"
          :key="genre.id"
          type="button"
          class="filter-chip"
          :aria-label="`Убрать фильтр «${genre.title}»`"
          @click="toggleGenre(genre)"
        >
          {{ genre.title }}
          <Icon
            name="i-heroicons-x-mark"
            class="size-3.5"
          />
        </button>
        <span
          v-if="ageMax"
          class="filter-chip"
        >До {{ ageMax }}+</span>
        <span
          v-if="yearFrom || yearTo"
          class="filter-chip"
        >Годы: {{ yearFrom || '…' }}–{{ yearTo || '…' }}</span>
      </template>

      <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
        <section>
          <header class="flex items-center justify-between mb-3">
            <h2 class="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Icon
                name="i-heroicons-tag"
                class="size-4 text-primary"
              />
              Жанры
            </h2>
            <span class="text-xs text-gray-500">
              выбрано {{ selectedGenres.length }} из {{ genres.length }}
            </span>
          </header>

          <div class="flex flex-wrap gap-2">
            <button
              v-for="genre in genres"
              :key="genre.id"
              type="button"
              class="genre-pill"
              :class="{ 'genre-pill--active': isGenreSelected(genre) }"
              :aria-pressed="isGenreSelected(genre)"
              @click="toggleGenre(genre)"
            >
              {{ genre.title }}
            </button>
          </div>
        </section>

        <div class="order-first lg:order-none grid gap-5 grid-cols-2 lg:grid-cols-1 content-start">
          <section>
            <h2 class="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-900">
              <Icon
                name="i-heroicons-cake"
                class="size-4 text-primary"
              />
              Возраст, до
            </h2>
            <UInput
              v-model.number="ageMax"
              type="number"
              inputmode="numeric"
              placeholder="Например, 16"
              min="0"
              class="w-full"
              @change="applyFilters"
            />
          </section>

          <section>
            <h2 class="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-900">
              <Icon
                name="i-heroicons-calendar-days"
                class="size-4 text-primary"
              />
              Год издания
            </h2>
            <div class="flex items-center gap-2">
              <UInput
                v-model.number="yearFrom"
                type="number"
                inputmode="numeric"
                placeholder="От"
                min="0"
                class="w-full"
                @change="applyFilters"
              />
              <span class="text-gray-400">—</span>
              <UInput
                v-model.number="yearTo"
                type="number"
                inputmode="numeric"
                placeholder="До"
                min="0"
                class="w-full"
                @change="applyFilters"
              />
            </div>
          </section>
        </div>
      </div>
    </CommonCatalogFilters>

    <div v-if="comics">
      <div
        v-if="comics.data?.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-4 justify-items-center mb-8"
      >
        <ComicCard
          v-for="comic in comics.data"
          :key="comic.id"
          :comic="comic"
          stretch
        />
      </div>
      <p
        v-else
        class="py-16 text-center text-gray-500"
      >
        Ничего не найдено. Попробуйте изменить запрос или фильтры.
      </p>
      <div
        v-if="(comics.meta?.total ?? 0) > Number(comics.meta?.limit)"
        class="flex items-center justify-center w-full"
      >
        <UPagination
          v-model:page="page"
          show-edges
          :sibling-count="1"
          :total="comics.meta?.total"
          :items-per-page="Number(comics.meta?.limit)"
          @update:page="handleNavigate"
        />
      </div>
    </div>
  </CommonContentContainer>
</template>

<script lang="ts" setup>
import { useComicApi } from '~~/services/api/comic.api';
import type { Comic, ComicGenre } from '~~/services/types/comic.type';
import type { ApiResponse } from '~~/services/api/base';

const comicApi = useComicApi();

const route = useRoute();

usePageSeo({
  title: 'Комиксы',
  description:
    'Каталог комиксов и манги Новосибирской областной молодёжной библиотеки: серии, жанры и возрастные рейтинги.',
});

const comics = ref<ApiResponse<Comic[]>>();

const toNumber = (value: unknown): number | undefined => {
  const num = Number(value);
  return value && !Number.isNaN(num) ? num : undefined;
};

const page = ref(Number(route.query.page) || 1);
const searchText = ref<string>((route.query.search as string) || '');
const ageMax = ref<number | undefined>(toNumber(route.query.ageMax));
const yearFrom = ref<number | undefined>(toNumber(route.query.yearFrom));
const yearTo = ref<number | undefined>(toNumber(route.query.yearTo));

const genres = await comicApi.getAllGenres();

const activeGenreIds = ref<string[]>(
  (route.query.genres as string)?.split(',').filter(Boolean) || [],
);

const selectedGenres = computed(() => {
  return genres.filter(genre => activeGenreIds.value.includes(genre.id));
});

const updateUrl = () => {
  const query: Record<string, string | number> = {};
  if (page.value >= 1) query.page = page.value;
  if (searchText.value) query.search = searchText.value;
  if (activeGenreIds.value.length) query.genres = activeGenreIds.value.join(',');
  if (ageMax.value) query.ageMax = ageMax.value;
  if (yearFrom.value) query.yearFrom = yearFrom.value;
  if (yearTo.value) query.yearTo = yearTo.value;

  navigateTo({ name: 'comics', query });
};

const fetchData = async () => {
  comics.value = await comicApi.getAllComics({
    limit: 12,
    page: page.value,
    search: searchText.value,
    genres: activeGenreIds.value,
    ageMax: ageMax.value,
    yearFrom: yearFrom.value,
    yearTo: yearTo.value,
  });
};

const searchData = async () => {
  page.value = 1;
  updateUrl();
  await fetchData();
};

const applyFilters = async () => {
  page.value = 1;
  updateUrl();
  await fetchData();
};

const handleNavigate = async () => {
  updateUrl();

  await fetchData();

  if (import.meta.client) {
    window.scrollTo(0, 0);
  }
};

const toggleGenre = async (genre: ComicGenre) => {
  const index = activeGenreIds.value.indexOf(genre.id);

  if (index > -1) {
    activeGenreIds.value.splice(index, 1);
  }
  else {
    activeGenreIds.value.push(genre.id);
  }

  await applyFilters();
};

const activeFiltersCount = computed(
  () =>
    selectedGenres.value.length
    + (ageMax.value ? 1 : 0)
    + (yearFrom.value || yearTo.value ? 1 : 0),
);

const isGenreSelected = (genre: ComicGenre) => {
  return activeGenreIds.value.includes(genre.id);
};

const resetFilters = async () => {
  activeGenreIds.value = [];
  ageMax.value = undefined;
  yearFrom.value = undefined;
  yearTo.value = undefined;
  page.value = 1;

  updateUrl();
  await fetchData();
};

await fetchData();
</script>
