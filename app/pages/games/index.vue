<template>
  <CommonContentContainer>
    <div class="flex gap-4">
      <div class="flex bg-white p-2 shadow rounded-xl w-1/4">
        <h3>Фильтры</h3>
      </div>
      <div class="flex flex-col rounded-xl w-full">
        <div class="mb-4 bg-white border border-neutral-200 rounded-xl shadow">
          <UInput
            variant="none"
            class="w-full rounded-xl bg-white"
            placeholder="Поиск игры..."
            v-model="searchText"
            @keydown.enter="fetchData"
            size="xl"
          />
        </div>
        <div v-if="games" class="grid grid-cols-4 gap-4">
          <GameCard v-for="game in games.data" :game="game" />
        </div>
      </div>
    </div>
  </CommonContentContainer>
</template>

<script lang="ts" setup>
import { useGameApi } from '~~/services/api/game.api';
import type { Game } from '~~/services/types/game.type';
import type { ApiResponse } from '~~/services/api/base';

const gameApi = useGameApi();

const searchText = ref<string>('');
const games = ref<ApiResponse<Game[]>>();

const fetchData = async () => {
  games.value = await gameApi.getAllGames({
    limit: 12,
    search: searchText.value,
  });
  console.log(123);
};

await fetchData();
</script>
