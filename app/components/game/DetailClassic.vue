<template>
  <div>
    <header class="mb-8">
      <h1
        class="game-title text-gray-900"
        v-html="game.name"
      />
      <p
        v-if="shortDescription"
        class="mt-3 max-w-3xl text-lg leading-relaxed text-gray-600"
      >
        {{ shortDescription }}
      </p>
      <GameSpecs
        :game="game"
        variant="chips"
        class="mt-5"
      />
    </header>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="flex flex-col gap-6 lg:col-span-2">
        <GameGallery
          :game="game"
          :modal="modal"
        />

        <article
          v-if="game.full_description"
          class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 lg:p-6"
        >
          <h2 class="game-section-title">
            Описание игры
          </h2>
          <div
            class="tiptap mt-4"
            v-html="game.full_description"
          />
        </article>
      </div>

      <aside class="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
        <GameInfoPanel :game="game" />
        <GameRules :game="game" />
      </aside>
    </div>

    <GameAlsoSee
      :games="otherGames"
      :exclude-id="game.id"
    />
  </div>
</template>

<script setup lang="ts">
import type { Game } from '~~/services/types/game.type';
import { useStringCleaner } from '~/composables/useStringCleaner';

const props = defineProps<{
  game: Game;
  otherGames: Game[] | null | undefined;
  modal: unknown;
}>();

const { removeHtmlEntities } = useStringCleaner();

const shortDescription = computed(() =>
  removeHtmlEntities(props.game.short_description || ''),
);
</script>

<style scoped>
.game-title {
  font-size: 1.875rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.game-section-title {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.3;
  color: #111827;
}

@media (min-width: 640px) {
  .game-title {
    font-size: 2.25rem;
  }
}
</style>
