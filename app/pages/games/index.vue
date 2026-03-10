<template>
  <CommonContentContainer>
    <div class="flex gap-4">
      <div class="flex flex-col bg-white p-5 shadow rounded-xl w-1/4 h-max">
        <div class="border-b border-gray-100 pb-2 mb-4">
          <h2>
            <Icon name="i-heroicons-funnel" class="w-5 h-5 text-primary" />
            Фильтры
          </h2>
        </div>

        <div class="mb-6">
          <header class="flex items-center justify-between mb-3">
            <h3 class="flex items-center gap-2 text-sm font-medium">
              <Icon name="i-heroicons-tag" class="w-4 h-4" />
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
              :key="genre.tag"
              :label="genre.desc"
              class="rounded-xl flex items-center"
            >
              <template #trailing>
                <button
                  @click="selectGenres(genre)"
                  class="flex items-center ml-1 hover:scale-125 transition-transform"
                >
                  <Icon name="i-heroicons-x-mark" class="w-3 h-3" />
                </button>
              </template>
            </UBadge>
          </div>

          <div class="flex flex-col h-64 overflow-y-auto">
            <UButton
              class="mb-2"
              variant="ghost"
              v-for="genre in genres"
              :label="genre.desc"
              @click="selectGenres(genre)"
              :icon="GenresIcons[genre.tag]"
              :class="isGenreSelected(genre) ? 'border border-primary' : ''"
            />
          </div>
        </div>

        <!-- Фильтр по возрасту -->
        <div class="mb-6">
          <header class="flex items-center justify-between mb-3">
            <h3 class="flex items-center gap-2 text-sm font-medium">
              <Icon name="i-heroicons-cake" class="w-4 h-4" />
              Возраст
            </h3>
          </header>

          <div class="flex items-center gap-2">
            <UInput
              type="number"
              placeholder="От"
              size="sm"
              min="0"
              class="w-full"
            />
            <span class="text-gray-400">—</span>
            <UInput
              type="number"
              placeholder="До"
              size="sm"
              min="0"
              class="w-full"
            />
          </div>
        </div>

        <!-- Фильтр по количеству игроков -->
        <div class="mb-6">
          <header class="flex items-center justify-between mb-3">
            <h3 class="flex items-center gap-2 text-sm font-medium">
              <Icon name="i-heroicons-user-group" class="w-4 h-4" />
              Игроки
            </h3>
          </header>

          <div class="flex items-center gap-2">
            <UInput
              type="number"
              placeholder="От"
              size="sm"
              min="1"
              class="w-full"
            />
            <span class="text-gray-400">—</span>
            <UInput
              type="number"
              placeholder="До"
              size="sm"
              min="1"
              class="w-full"
            />
          </div>
        </div>

        <!-- Кнопка сброса фильтров -->
        <div class="mt-6 pt-4 border-t border-gray-100">
          <UButton color="neutral" variant="ghost" size="sm" class="w-full">
            <Icon name="i-heroicons-arrow-path" class="w-4 h-4 mr-2" />
            Сбросить все фильтры
          </UButton>
        </div>
      </div>

      <div class="flex flex-col rounded-xl w-full">
        <div class="mb-4 bg-white border border-neutral-200 rounded-xl shadow">
          <UInput
            variant="none"
            class="w-full rounded-xl bg-white"
            placeholder="Поиск игры..."
            v-model="searchText"
            @keydown.enter="searchData"
            size="xl"
          />
        </div>
        <div v-if="games">
          <div class="grid grid-cols-4 gap-4 mb-6">
            <GameCard v-for="game in games.data" :game="game" />
          </div>
          <div class="flex items-center justify-center w-full">
            <UPagination
              v-model:page="page"
              show-edges
              @update:page="handleNavigate"
              :total="games.meta?.total"
              :items-per-page="Number(games.meta?.limit)"
            />
          </div>
        </div>
      </div>
    </div>
  </CommonContentContainer>
</template>

<script lang="ts" setup>
import { useGameApi } from '~~/services/api/game.api';
import type { Game, Genres } from '~~/services/types/game.type';
import type { ApiResponse } from '~~/services/api/base';
import { GenresIcons } from '~/constants/gameGenres';

const gameApi = useGameApi();

const route = useRoute();

const games = ref<ApiResponse<Game[]>>();

const page = ref(Number(route.query.page) || 1);
const searchText = ref<string>((route.query.search as string) || '');

const genres = await gameApi.getAllGenres();

const activeGenres = ref<string[]>(
  (route.query.genres as string)?.split(',') || []
);

const selectedGenres = computed(() => {
  return genres.filter((genre) => activeGenres.value.includes(genre.tag));
});

const updateUrl = () => {
  const query: any = {};
  if (page.value >= 1) query.page = page.value;
  if (searchText.value) query.search = searchText.value;
  if (activeGenres.value) query.genres = activeGenres.value.join(',');

  navigateTo({ name: 'games', query });
};

const searchData = async () => {
  page.value = 1;
  updateUrl();

  await fetchData();
};

const fetchData = async () => {
  const params = {
    limit: 12,
    search: searchText.value,
    genres: activeGenres.value,
    page: page.value,
  };

  games.value = await gameApi.getAllGames({
    ...params,
  });
};

const handleNavigate = async () => {
  updateUrl();

  await fetchData();

  if (import.meta.client) {
    window.scrollTo(0, 0);
  }
};

const selectGenres = async (genre: Genres) => {
  const genreId = genre.tag;
  const index = activeGenres.value.indexOf(genreId);

  if (index > -1) {
    activeGenres.value.splice(index, 1);
  } else {
    activeGenres.value.push(genreId);
  }

  updateUrl();
  await fetchData();
};

const isGenreSelected = (genre: Genres) => {
  return activeGenres.value.includes(genre.tag);
};
await fetchData();
</script>
