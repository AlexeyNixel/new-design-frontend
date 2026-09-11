<template>
  <CommonContentContainer>
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
              :icon="GenresIcons[genre.tag]"
              :class="isGenreSelected(genre) ? 'border border-primary' : ''"
              @click="toggleGenre(genre)"
            />
          </div>
        </div>

        <!-- Фильтр по возрасту -->
        <div class="mb-6">
          <header class="flex items-center justify-between mb-3">
            <h3 class="flex items-center gap-2 text-sm font-medium">
              <Icon
                name="i-heroicons-cake"
                class="w-4 h-4"
              />
              Возраст
            </h3>
          </header>

          <div class="flex items-center gap-2">
            <UInput
              v-model.number="ageMin"
              type="number"
              placeholder="От"
              size="sm"
              min="0"
              class="w-full"
              @change="applyFilters"
            />
            <span class="text-gray-400">—</span>
            <UInput
              v-model.number="ageMax"
              type="number"
              placeholder="До"
              size="sm"
              min="0"
              class="w-full"
              @change="applyFilters"
            />
          </div>
        </div>

        <!-- Фильтр по количеству игроков -->
        <div class="mb-6">
          <header class="flex items-center justify-between mb-3">
            <h3 class="flex items-center gap-2 text-sm font-medium">
              <Icon
                name="i-heroicons-user-group"
                class="w-4 h-4"
              />
              Игроков в компании
            </h3>
          </header>

          <UInput
            v-model.number="players"
            type="number"
            placeholder="Например, 4"
            size="sm"
            min="1"
            class="w-full"
            @change="applyFilters"
          />
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
            placeholder="Поиск игры..."
            size="xl"
            @keydown.enter="searchData"
          />
        </div>
        <div v-if="games">
          <div class="grid grid-cols-4 gap-4 mb-6">
            <GameCard
              v-for="game in games.data"
              :key="game.id"
              :game="game"
            />
          </div>
          <div class="flex items-center justify-center w-full">
            <UPagination
              v-model:page="page"
              show-edges
              :total="games.meta?.total"
              :items-per-page="Number(games.meta?.limit)"
              @update:page="handleNavigate"
            />
          </div>
        </div>
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

const isGenreSelected = (genre: GameGenre) => {
  return activeGenreIds.value.includes(genre.id);
};

const resetFilters = async () => {
  activeGenreIds.value = [];
  ageMin.value = undefined;
  ageMax.value = undefined;
  players.value = undefined;
  searchText.value = '';
  page.value = 1;

  updateUrl();
  await fetchData();
};

await fetchData();
</script>
