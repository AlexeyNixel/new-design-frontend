<template>
  <div
    class="divide-y divide-gray-100 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100"
  >
    <section class="p-5 lg:p-6">
      <h2 class="info-panel__title">
        Параметры игры
      </h2>
      <GameSpecs
        :game="game"
        class="mt-4"
      />
    </section>

    <section class="p-5 lg:p-6">
      <h2 class="info-panel__title">
        Где взять
      </h2>
      <GameAvailability
        :game="game"
        class="mt-4"
      />
    </section>

    <section
      v-if="hasGenres"
      class="p-5 lg:p-6"
    >
      <h2 class="info-panel__title">
        Жанры
      </h2>
      <GameGenres
        :game="game"
        class="mt-4"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Game } from '~~/services/types/game.type';

const props = defineProps<{ game: Game }>();

const hasGenres = computed(() => props.game.genres.length > 0);
</script>

<style scoped>
.info-panel__title {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.3;
  color: #111827;
}
</style>
