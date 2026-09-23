<template>
  <CommonContentContainer>
    <h1 class="sr-only">
      Комиксы
    </h1>
    <div class="flex gap-4">
      <div class="flex flex-col bg-white p-5 shadow rounded-xl w-1/4 h-max">
        <div class="border-b border-gray-100 pb-2 mb-4">
          <h2>
            <Icon
              name="i-heroicons-funnel"
              class="w-5 h-5 text-primary"
            />
            Фильтры
          </h2>
        </div>

        <div class="mb-6">
          <header class="flex items-center justify-between mb-3">
            <h3 class="flex items-center gap-2 text-sm font-medium">
              <Icon
                name="i-heroicons-tag"
                class="w-4 h-4"
              />
              Жанры
            </h3>

            <div class="text-sm text-gray-500">
              {{ selectedGenres.length }} / {{ genres.length }}
            </div>
          </header>

          <div
            v-if="selectedGenres.length > 0"
            class="flex gap-2 flex-wrap mb-3"
          >
            <UBadge
              v-for="genre in selectedGenres"
              :key="genre.id"
              :label="genre.title"
              class="rounded-xl flex items-center"
            >
              <template #trailing>
                <button
                  class="flex items-center ml-1 hover:scale-125 transition-transform"
                  @click="toggleGenre(genre)"
                >
                  <Icon
                    name="i-heroicons-x-mark"
                    class="w-3 h-3"
                  />
                </button>
              </template>
            </UBadge>
          </div>

          <div class="flex flex-col h-64 overflow-y-auto">
            <UButton
              v-for="genre in genres"
              :key="genre.id"
              class="mb-2"
              variant="ghost"
              :label="genre.title"
              :class="isGenreSelected(genre) ? 'border border-primary' : ''"
              @click="toggleGenre(genre)"
            />
          </div>
        </div>

        <!-- Возрастной рейтинг -->
        <div class="mb-6">
          <header class="flex items-center justify-between mb-3">
            <h3 class="flex items-center gap-2 text-sm font-medium">
              <Icon
                name="i-heroicons-cake"
                class="w-4 h-4"
              />
              Возрастной рейтинг, не выше
            </h3>
          </header>

          <UInput
            v-model.number="ageMax"
            type="number"
            placeholder="Например, 16"
            size="sm"
            min="0"
            class="w-full"
            @change="applyFilters"
          />
        </div>

        <!-- Год издания -->
        <div class="mb-6">
          <header class="flex items-center justify-between mb-3">
            <h3 class="flex items-center gap-2 text-sm font-medium">
              <Icon
                name="i-heroicons-calendar-days"
                class="w-4 h-4"
              />
              Год издания
            </h3>
          </header>

          <div class="flex items-center gap-2">
            <UInput
              v-model.number="yearFrom"
              type="number"
              placeholder="От"
              size="sm"
              min="0"
              class="w-full"
              @change="applyFilters"
            />
            <span class="text-gray-400">—</span>
            <UInput
              v-model.number="yearTo"
              type="number"
              placeholder="До"
              size="sm"
              min="0"
              class="w-full"
              @change="applyFilters"
            />
          </div>
        </div>

        <!-- Кнопка сброса фильтров -->
        <div class="mt-6 pt-4 border-t border-gray-100">
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            class="w-full"
            @click="resetFilters"
          >
            <Icon
              name="i-heroicons-arrow-path"
              class="w-4 h-4 mr-2"
            />
            Сбросить все фильтры
          </UButton>
        </div>
      </div>

      <div class="flex flex-col rounded-xl w-full">
        <div class="mb-4 bg-white border border-neutral-200 rounded-xl shadow">
          <UInput
            v-model="searchText"
            variant="none"
            class="w-full rounded-xl bg-white"
            placeholder="Поиск комикса..."
            size="xl"
            @keydown.enter="searchData"
          />
        </div>
        <div v-if="comics">
          <div class="grid grid-cols-4 gap-4 mb-6">
            <ComicCard
              v-for="comic in comics.data"
              :key="comic.id"
              :comic="comic"
            />
          </div>
          <div class="flex items-center justify-center w-full">
            <UPagination
              v-model:page="page"
              show-edges
              :total="comics.meta?.total"
              :items-per-page="Number(comics.meta?.limit)"
              @update:page="handleNavigate"
            />
          </div>
        </div>
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

const isGenreSelected = (genre: ComicGenre) => {
  return activeGenreIds.value.includes(genre.id);
};

const resetFilters = async () => {
  activeGenreIds.value = [];
  ageMax.value = undefined;
  yearFrom.value = undefined;
  yearTo.value = undefined;
  searchText.value = '';
  page.value = 1;

  updateUrl();
  await fetchData();
};

await fetchData();
</script>
