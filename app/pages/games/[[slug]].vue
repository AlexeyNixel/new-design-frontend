<template>
  <CommonContentContainer>
    <header class="mb-6">
      <h1 v-html="game.name" />
      <div v-if="game.game_year">
        Дата выхода: <b>{{ game.game_year }}</b>
      </div>
      <div v-if="game.game_duration">
        Время игры: <b>{{ game.game_duration }}</b>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="col-span-2 space-y-6">
        <div
          class="flex bg-white items-center justify-center w-full overflow-hidden rounded-xl shadow"
        >
          <img class="w-1/2" :src="BASE_URL_IMAGE + game.cover_file" alt="" />
        </div>

        <div class="bg-white rounded-xl shadow p-4 lg:p-6">
          <h3>Описание игры</h3>
          <div v-html="game.full_description"></div>
        </div>
      </div>

      <div class="flex flex-col gap-6">
        <div
          class="bg-white rounded-xl shadow p-4 lg:p-6 gap-5 flex flex-col h-max"
        >
          <h3>Параметры игры</h3>

          <div class="flex gap-3 bg-gray-100 p-3 rounded-lg">
            <div
              class="w-10 h-10 bg-primary/20 flex items-center justify-center rounded-lg"
            >
              <Icon class="w-8 h-8" name="heroicons:user-group" />
            </div>
            <div class="">
              <div class="text-sm">Количество игроков</div>
              <div class="font-bold">
                {{ game.player_min }}-{{ game.player_max }}
              </div>
            </div>
          </div>
          <div
            class="flex gap-3 bg-gray-100 p-3 rounded-lg"
            v-if="game.player_age"
          >
            <div
              class="w-10 h-10 bg-primary/20 flex items-center justify-center rounded-lg"
            >
              <Icon class="w-8 h-8" name="i-heroicons-cake" />
            </div>
            <div class="">
              <div class="text-sm">Возрастное ограничение</div>
              <div class="font-bold">{{ game.player_age }}+ лет</div>
            </div>
          </div>
          <div
            class="flex gap-3 bg-gray-100 p-3 rounded-lg"
            v-if="game.game_duration"
          >
            <div
              class="w-10 h-10 bg-primary/20 flex items-center justify-center rounded-lg"
            >
              <Icon class="w-8 h-8" name="i-heroicons-clock" />
            </div>
            <div class="">
              <div class="text-sm">Время партии</div>
              <div class="font-bold">{{ game.game_duration }}</div>
            </div>
          </div>
          <div
            class="flex gap-3 bg-gray-100 p-3 rounded-lg"
            v-if="game.game_year"
          >
            <div
              class="w-10 h-10 bg-primary/20 flex items-center justify-center rounded-lg"
            >
              <Icon class="w-8 h-8" name="i-heroicons-calendar" />
            </div>
            <div class="">
              <div class="text-sm">Год выпуска</div>
              <div class="font-bold">{{ game.game_year }}</div>
            </div>
          </div>
          <div v-if="game.place" class="flex gap-3 bg-gray-100 p-3 rounded-lg">
            <div
              class="w-10 h-10 bg-primary/20 flex items-center justify-center rounded-lg"
            >
              <Icon class="w-8 h-8" name="i-heroicons-map-pin" />
            </div>
            <div class="">
              <div class="text-sm">Место хранения</div>
              <div class="font-bold">{{ game.place }}</div>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-xl shadow p-4 lg:p-6 gap-5 flex flex-col h-max"
        >
          <h3>Жанры</h3>

          <div class="flex gap-3">
            <UBadge
              v-for="item in game.genres.split('; ')"
              :label="GENRES[item]"
            />
          </div>
        </div>
      </div>
    </div>
  </CommonContentContainer>
</template>

<script setup lang="ts">
import { useGameApi } from '~~/services/api/game.api';
import { GameGenres } from '~/constants/gameGenres';

const route = useRoute();
const gameApi = useGameApi();
const BASE_URL_IMAGE = 'http://infomania.ru/gamelibrary/img/game-cover/';

const GENRES = GameGenres;

const ui = {
  root: 'h-full flex',
  viewport: 'h-full ',
  item: 'h-full w-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 transition-opacity ',
  container: 'h-full',
  arrows: 'absolute right-15 bottom-5',
  prev: ' rounded  bg-primary text-white border-0 ring-0 hover:bg-primary-100 hover:cursor-pointer',
  next: ' rounded  bg-primary text-white border-0 ring-0 hover:bg-primary-100 hover:cursor-pointer',
};

const { data: game } = await gameApi.getOneGames(route.params.slug as string);
const { data: otherGames } = await gameApi.getAllGames({ limit: 8 });
</script>
