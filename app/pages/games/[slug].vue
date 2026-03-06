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
          class="flex bg-white items-center justify-center w-full overflow-hidden rounded-xl shadow min-h-[500px]"
        >
          <div class="flex flex-row-reverse" v-if="game.id === 'gm28'">
            <UCarousel
              ref="carousel"
              class="h-full flex justify-center m-auto w-1/2"
              :items="items"
              v-slot="{ item }"
              :ui="{
                item: 'm-auto',
              }"
              v-image-gallery="{ modal }"
            >
              <template v-if="item.type === 'image'">
                <img
                  class="max-h-[450px] cursor-pointer"
                  :src="item.src"
                  alt=""
                />
              </template>
              <template v-else-if="item.type === 'video'">
                <div
                  class="relative w-full h-full flex items-center justify-center"
                >
                  <div class="relative w-full" style="padding-bottom: 56.25%">
                    <iframe
                      :src="item.src"
                      class="absolute top-0 left-0 w-full h-full rounded-lg"
                      :allow="item.allow"
                      frameborder="0"
                      allowfullscreen
                    ></iframe>
                  </div>
                </div>
              </template>
            </UCarousel>
            <div class="flex flex-col gap-4 p-4 w-1/6">
              <div
                v-for="(item, index) in items"
                :key="index"
                class="size-28 opacity-65 hover:opacity-100 transition-opacity cursor-pointer"
                :class="{ 'opacity-100': activeIndex === index }"
                @click="select(index)"
              >
                <template v-if="item.type === 'image'">
                  <img
                    :src="item.src"
                    class="rounded-lg w-full h-full object-cover"
                    loading="lazy"
                    alt=""
                  />
                </template>
                <template v-else-if="item.type === 'video'">
                  <div
                    class="relative w-full h-full rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center"
                  >
                    <Icon
                      name="i-heroicons-play"
                      class="w-8 h-8 text-white/80"
                    />
                    <div
                      class="absolute inset-0 bg-black/20 flex items-center justify-center"
                    >
                      <div
                        class="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center"
                      >
                        <div
                          class="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-white ml-1"
                        ></div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <img
            class="w-1/2"
            :src="BASE_URL_IMAGE + game.cover_file"
            alt=""
            v-else
          />
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

        <div
          v-if="game?.rules_file"
          class="bg-white rounded-xl shadow p-4 lg:p-6 gap-5 flex flex-col h-max"
        >
          <h3 class="text-2xl font-bold mb-4 flex items-center gap-3">
            <Icon name="i-heroicons-book-open" class="w-6 h-6 text-primary" />
            Правила игры
          </h3>

          <div class="flex items-center gap-4">
            <div class="flex-1">
              <p class="text-gray-600 mb-4">
                Загрузите файл с правилами игры для ознакомления
              </p>
            </div>
            <NuxtLink
              :to="BASE_URL_RULE + game.rules_file"
              target="_blank"
              class="inline-flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              <Icon name="i-heroicons-arrow-down-tray" class="w-5 h-5" />
              Скачать правила
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-5">
      <h3 class="mb-10">Смотрите также</h3>
      <div class="grid grid-cols-5 gap-4 mt-4">
        <GameCard v-for="game in otherGames" :key="game.id" :game="game" />
      </div>
    </div>
  </CommonContentContainer>
</template>

<script setup lang="ts">
import { useGameApi } from '~~/services/api/game.api';
import { GameGenres } from '~/constants/gameGenres';
import { ModalsCommon } from '#components';
import { useStringCleaner } from '~/composables/useStringCleaner';

const BASE_URL_IMAGE = 'http://infomania.ru/gamelibrary/img/game-cover/';
const BASE_URL_RULE = 'http://infomania.ru/gamelibrary/files/rules/';

const route = useRoute();
const overlay = useOverlay();
const gameApi = useGameApi();
const { removeHtmlEntities } = useStringCleaner();

const { data: otherGames } = await gameApi.getAllGames({ limit: 5 });
const { data: game } = await gameApi.getOneGames(route.params.slug as string);

const modal = overlay.create(ModalsCommon);

const GENRES = GameGenres;

const activeIndex = ref(0);
const carousel = useTemplateRef('carousel');

function select(index: number) {
  activeIndex.value = index;
  carousel.value?.emblaApi?.scrollTo(index);
}

// Обновленный массив items с видео на последнем слайде
const items = [
  {
    type: 'image',
    src: 'https://hobbygames.ru/image/cache/hobbygames_beta/data/HobbyWorld/Civilization_Noviy_Rassvet/Civilization_Newdawn-1980x1980-wm.webp',
  },
  {
    type: 'image',
    src: 'https://hobbygames.ru/image/cache/hobbygames_beta/data/HobbyWorld/Civilization_Noviy_Rassvet/Civilization_Noviy_Rassvet_02-1980x1980-wm.webp',
  },
  {
    type: 'image',
    src: 'https://hobbygames.ru/image/cache/hobbygames_beta/data/HobbyWorld/Civilization_Noviy_Rassvet/Civilization_Noviy_Rassvet_03-1980x1980-wm.webp',
  },
  {
    type: 'video',
    src: 'https://vkvideo.ru/video_ext.php?oid=-187250026&id=456239123&hash=ed3aa8ee4fcd9257&hd=4',
    allow:
      'autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;',
  },
];

useSeoMeta({
  title: removeHtmlEntities(game.name || ''),
  description: game.short_description || '',
});
</script>

<style scoped>
/* Дополнительные стили для видео превью */
.video-thumbnail {
  position: relative;
  overflow: hidden;
}

.video-thumbnail::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 16px solid white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}
</style>
