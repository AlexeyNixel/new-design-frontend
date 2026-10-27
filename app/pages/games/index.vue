<template>
  <CommonContentContainer>
    <h1 class="mb-6 text-3xl font-bold text-gray-900 md:mb-8 md:text-4xl">
      Настольные игры
    </h1>
    <CommonCatalogFilters
      v-model:search="searchText"
      search-placeholder="Название игры"
      quick-label="Жанр"
      quick-icon="i-heroicons-tag"
      more-hint="возраст, число игроков"
      :active-count="activeFiltersCount"
      :panel-count="panelFiltersCount"
      :total="games?.meta?.total"
      :total-forms="['игра', 'игры', 'игр']"
      @search="searchData"
      @reset="resetFilters"
    >
      <template #quick>
        <button
          v-for="genre in visibleGenres"
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
        <button
          v-if="genres.length > GENRES_COLLAPSED"
          type="button"
          class="genre-pill genre-pill--more"
          :aria-expanded="showAllGenres"
          @click="showAllGenres = !showAllGenres"
        >
          {{ showAllGenres ? 'Свернуть' : `Ещё ${hiddenGenresCount}` }}
        </button>
      </template>

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
        <button
          v-if="ageMin || ageMax"
          type="button"
          class="filter-chip"
          aria-label="Убрать фильтр по возрасту"
          @click="clearAge"
        >
          Возраст: {{ ageMin || 0 }}–{{ ageMax || '∞' }}
          <Icon
            name="i-heroicons-x-mark"
            class="size-3.5"
          />
        </button>
        <button
          v-if="players"
          type="button"
          class="filter-chip"
          aria-label="Убрать фильтр по числу игроков"
          @click="setPlayers(undefined)"
        >
          Игроков: {{ players }}
          <Icon
            name="i-heroicons-x-mark"
            class="size-3.5"
          />
        </button>
      </template>

      <div class="grid gap-6 sm:grid-cols-2 lg:max-w-3xl">
        <section>
          <h2 class="filter-title">
            <Icon
              name="i-heroicons-user-group"
              class="size-4 text-primary"
            />
            Сколько вас будет
          </h2>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="option in PLAYER_OPTIONS"
              :key="option.value"
              type="button"
              class="genre-pill min-w-11 justify-center"
              :class="{ 'genre-pill--active': players === option.value }"
              :aria-pressed="players === option.value"
              @click="setPlayers(players === option.value ? undefined : option.value)"
            >
              {{ option.label }}
            </button>
          </div>
        </section>

        <section>
          <h2 class="filter-title">
            <Icon
              name="i-heroicons-cake"
              class="size-4 text-primary"
            />
            Возраст игроков
          </h2>
          <div class="flex items-center gap-2">
            <UInput
              v-model.number="ageMin"
              type="number"
              inputmode="numeric"
              placeholder="От"
              min="0"
              aria-label="Возраст от"
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
              aria-label="Возраст до"
              class="w-full"
              @change="applyFilters"
            />
          </div>
        </section>
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
          stretch
        />
      </div>
      <div
        v-else
        class="py-16 text-center"
      >
        <p class="mb-5 text-gray-500">
          Ничего не найдено. Попробуйте изменить запрос или фильтры.
        </p>
        <UButton
          v-if="activeFiltersCount"
          icon="i-heroicons-arrow-path"
          label="Сбросить фильтры"
          @click="resetFilters"
        />
      </div>
      <div
        v-if="(games.meta?.total ?? 0) > Number(games.meta?.limit)"
        class="flex items-center justify-center w-full"
      >
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
  title: 'Настольные игры в Новосибирске — игротека библиотеки',
  description:
    'Где поиграть в настольные игры в Новосибирске: каталог игротеки молодёжной библиотеки — жанры, число игроков, возраст и правила. Красный проспект, 26.',
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

// Жанров почти три десятка: сначала показываем часть, выбранные — всегда
const GENRES_COLLAPSED = 12;
const showAllGenres = ref(false);
const visibleGenres = computed(() =>
  showAllGenres.value
    ? genres
    : genres.filter((genre, index) => index < GENRES_COLLAPSED || isGenreSelected(genre)),
);
const hiddenGenresCount = computed(() => genres.length - visibleGenres.value.length);

const PLAYER_OPTIONS = [1, 2, 3, 4, 5, 6, 8].map(value => ({
  value,
  label: value === 8 ? '8+' : String(value),
}));

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

const panelFiltersCount = computed(
  () => (ageMin.value || ageMax.value ? 1 : 0) + (players.value ? 1 : 0),
);

const activeFiltersCount = computed(
  () => selectedGenres.value.length + panelFiltersCount.value,
);

const setPlayers = async (value: number | undefined) => {
  players.value = value;
  await applyFilters();
};

const clearAge = async () => {
  ageMin.value = undefined;
  ageMax.value = undefined;
  await applyFilters();
};

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
