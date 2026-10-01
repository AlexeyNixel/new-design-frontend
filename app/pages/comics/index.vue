<template>
  <CommonContentContainer>
    <h1 class="sr-only">Комиксы</h1>
    <CommonCatalogFilters
      v-model:search="searchText"
      search-placeholder="Поиск комикса..."
      :active-count="activeFiltersCount"
      @search="searchData"
      @reset="resetFilters"
    >
      <template #active>
        <button
          v-if="selectedSeries"
          type="button"
          class="filter-chip"
          :aria-label="`Убрать фильтр «${selectedSeries.title}»`"
          @click="toggleSeries(selectedSeries)"
        >
          {{ selectedSeries.title }}
          <Icon name="i-heroicons-x-mark" class="size-3.5" />
        </button>
        <span v-if="ageMax" class="filter-chip">До {{ ageMax }}+</span>
        <span v-if="yearFrom || yearTo" class="filter-chip"
          >Годы: {{ yearFrom || '…' }}–{{ yearTo || '…' }}</span
        >
      </template>

      <!-- Серий немного, поэтому всё в одну строку: серии тянутся, числовые поля — по контенту -->
      <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
        <section class="flex-1 min-w-0">
          <h2
            class="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-900"
          >
            <Icon
              name="i-heroicons-rectangle-stack"
              class="size-4 text-primary"
            />
            Серия
          </h2>

          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in series"
              :key="item.id"
              type="button"
              class="genre-pill"
              :class="{ 'genre-pill--active': item.id === activeSeriesId }"
              :aria-pressed="item.id === activeSeriesId"
              @click="toggleSeries(item)"
            >
              {{ item.title }}
            </button>
          </div>
        </section>

        <div
          class="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-4 sm:gap-6 lg:w-[380px] lg:shrink-0"
        >
          <section>
            <h2
              class="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-900"
            >
              <Icon name="i-heroicons-cake" class="size-4 text-primary" />
              Возраст, до
            </h2>
            <UInput
              v-model.number="ageMax"
              type="number"
              inputmode="numeric"
              placeholder="16"
              min="0"
              class="w-full"
              @change="applyFilters"
            />
          </section>

          <section>
            <h2
              class="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-900"
            >
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
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 3xl:grid-cols-5 gap-4 mb-8"
      >
        <ComicCard
          v-for="comic in comics.data"
          :key="comic.id"
          :comic="comic"
        />
      </div>
      <p v-else class="py-16 text-center text-gray-500">
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
import type { Comic, ComicSeries } from '~~/services/types/comic.type';
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

const series = (await comicApi.getAllSeries()) ?? [];

// API фильтрует только по одной серии (seriesId), поэтому выбор одиночный
const activeSeriesId = ref<string | undefined>(
  (route.query.series as string) || undefined
);

const selectedSeries = computed(() =>
  series.find((item) => item.id === activeSeriesId.value)
);

const updateUrl = () => {
  const query: Record<string, string | number> = {};
  if (page.value >= 1) query.page = page.value;
  if (searchText.value) query.search = searchText.value;
  if (activeSeriesId.value) query.series = activeSeriesId.value;
  if (ageMax.value) query.ageMax = ageMax.value;
  if (yearFrom.value) query.yearFrom = yearFrom.value;
  if (yearTo.value) query.yearTo = yearTo.value;

  navigateTo({ name: 'comics', query });
};

const fetchData = async () => {
  comics.value = await comicApi.getAllComics({
    limit: 15,
    page: page.value,
    search: searchText.value,
    seriesId: activeSeriesId.value,
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

const toggleSeries = async (item: ComicSeries) => {
  activeSeriesId.value = activeSeriesId.value === item.id ? undefined : item.id;

  await applyFilters();
};

const activeFiltersCount = computed(
  () =>
    (selectedSeries.value ? 1 : 0) +
    (ageMax.value ? 1 : 0) +
    (yearFrom.value || yearTo.value ? 1 : 0)
);

const resetFilters = async () => {
  activeSeriesId.value = undefined;
  ageMax.value = undefined;
  yearFrom.value = undefined;
  yearTo.value = undefined;
  page.value = 1;

  updateUrl();
  await fetchData();
};

await fetchData();
</script>
