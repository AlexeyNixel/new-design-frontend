<template>
  <CommonContentContainer
    v-if="game"
    class="py-6"
  >
    <p class="mb-4 text-sm text-gray-500">
      Черновая страница для ручной проверки вёрстки карточки игры — открывает
      первую попавшуюся игру из каталога.
    </p>
    <GameDetailModern
      :game="game"
      :other-games="otherGames"
      :modal="modal"
    />
  </CommonContentContainer>

  <div
    v-else
    class="flex min-h-screen items-center justify-center"
  >
    <p class="text-gray-600">
      Загрузка...
    </p>
  </div>
</template>

<script setup lang="ts">
import { useGameApi } from '~~/services/api/game.api';
import { ModalsCommon } from '#components';

const gameApi = useGameApi();
const overlay = useOverlay();

// Старые id вида "gm623" не пережили миграцию на новую модель — берём
// первую попавшуюся игру из каталога вместо конкретного значения.
const { data: firstPage } = await gameApi.getAllGames({ limit: 1 });
const game = firstPage?.[0] ?? null;

const { data: otherGames } = await gameApi.getAllGames({ limit: 8 });

const modal = overlay.create(ModalsCommon);
</script>
