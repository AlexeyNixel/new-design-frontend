<template>
  <CommonContentContainer>
    <h1 class="sr-only">
      Настольные игры
    </h1>
    <CommonCatalogFilters
      v-model:search="searchText"
      search-placeholder="Поиск игры..."
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
          v-if="ageMin || ageMax"
          class="filter-chip"
        >Возраст: {{ ageMin || 0 }}–{{ ageMax || '∞' }}</span>
        <span
          v-if="players"
          class="filter-chip"
        >Игроков: {{ players }}</span>
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
              <Icon
                v-if="GenresIcons[genre.tag]"
                :name="GenresIcons[genre.tag]!"
                class="size-4 shrink-0"
              />
              {{ genre.title }}
            </button>
          </div>
        </section>

        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 content-start">
          <section>
            <h2 class="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-900">
              <Icon
                name="i-heroicons-cake"
                class="size-4 text-primary"
              />
              Возраст
            </h2>
            <div class="flex items-center gap-2">
              <UInput
                v-model.number="ageMin"
                type="number"
                inputmode="numeric"
                placeholder="От"
                min="0"
                class="w-full"
                @change="applyFilters"
              />
              <span class="text-gray-400">—</span>
              <UInput
                v-model.number="ageMax"
                type="number"
                inputmode="numeric"
                placeholder="До"
                min="0"
                class="w-full"
                @change="applyFilters"
              />
            </div>
          </section>

          <section>
            <h2 class="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-900">
              <Icon
                name="i-heroicons-user-group"
                class="size-4 text-primary"
              />
              Игроков в компании
            </h2>
            <UInput
              v-model.number="players"
              type="number"
              inputmode="numeric"
              placeholder="Например, 4"
              min="1"
              class="w-full"
              @change="applyFilters"
            />
          </section>
        </div>
      </div>
    </CommonCatalogFilters>

    <div v-if="games">
      <div
        v-if="games.data?.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-4 justify-items-center mb-8"
      >
        <GameCard
          v-for="game in games.data"
          :key="game.id"
          :game="game"
        />
      </div>
      <p
        v-else
        class="py-16 text-center text-gray-500"
      >
        Ничего не найдено. Попробуйте изменить запрос или фильтры.
      </p>
      <div class="flex items-center justify-center w-full">
        <UPagination
          v-model:page="page"
          show-edges
          :sibling-count="1"
          :total="games.meta?.total"
          :items-per-page="Number(games.meta?.limit)"
          @update:page="handleNavigate"
        />
      </div>
    </div>
  </CommonContentContainer>
</template>

<script lang="ts" setup>
import { useGameApi } from '~~/services/api/game.api';
import type { Game, GameGenre } from '~~/services/types/game.type';
import type { ApiResponse } from '~~/services/api/base';
import { GenresIcons } from '~/constants/gameGenres';

const gameApi = useGameApi();

const route = useRoute();

usePageSeo({
  title: 'Настольные игры',
  description:
    'Каталог настольных игр Новосибирской областной молодёжной библиотеки: жанры, количество игроков, возраст и правила.',
});

const games = ref<ApiResponse<Game[]>>();

const toNumber = (value: unknown): number | undefined => {
  const num = Number(value);
  return value && !Number.isNaN(num) ? num : undefined;
};

const page = ref(Number(route.query.page) || 1);
const searchText = ref<string>((route.query.search as string) || '');
const ageMin = ref<number | undefined>(toNumber(route.query.ageMin));
const ageMax = ref<number | undefined>(toNumber(route.query.ageMax));
const players = ref<number | undefined>(toNumber(route.query.players));

const genres = await gameApi.getAllGenres();

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
  if (ageMin.value) query.ageMin = ageMin.value;
  if (ageMax.value) query.ageMax = ageMax.value;
  if (players.value) query.players = players.value;

  navigateTo({ name: 'games', query });
};

const fetchData = async () => {
  games.value = await gameApi.getAllGames({
    limit: 12,
    page: page.value,
    search: searchText.value,
    genres: activeGenreIds.value,
    ageMin: ageMin.value,
    ageMax: ageMax.value,
    players: players.value,
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

const toggleGenre = async (genre: GameGenre) => {
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
    + (ageMin.value || ageMax.value ? 1 : 0)
    + (players.value ? 1 : 0),
);

const isGenreSelected = (genre: GameGenre) => {
  return activeGenreIds.value.includes(genre.id);
};

const resetFilters = async () => {
  activeGenreIds.value = [];
  ageMin.value = undefined;
  ageMax.value = undefined;
  players.value = undefined;
  page.value = 1;

  updateUrl();
  await fetchData();
};

await fetchData();
</script>

<style scoped>
.genre-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  min-height: 2.5rem;
  padding: 0.375rem 0.875rem;
  border: 1px solid var(--color-neutral-200);
  border-radius: 9999px;
  background: white;
  font-size: 0.875rem;
  color: var(--color-gray-700);
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

@media (hover: hover) {
  .genre-pill:hover {
    border-color: var(--ui-primary);
    color: var(--ui-primary);
  }
}

.genre-pill--active,
.genre-pill--active:hover {
  border-color: var(--ui-primary);
  background: var(--ui-primary);
  color: white;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background: color-mix(in oklab, var(--ui-primary) 12%, white);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--ui-primary);
}
</style>
