<template>
  <div>
    <!-- Hero: коробка игры «на столе под софитом» -->
    <section class="relative overflow-hidden rounded-3xl bg-primary-900">
      <img
        :src="cover"
        alt=""
        aria-hidden="true"
        class="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl brightness-[0.45] saturate-150"
        @error="onCoverError"
      >
      <div
        class="absolute inset-0 bg-gradient-to-tr from-primary-900/90 via-primary-900/70 to-primary-800/40"
      />
      <div
        class="absolute -left-24 top-1/2 h-[26rem] w-[26rem] -translate-y-1/2 rounded-full bg-primary-50/25 blur-3xl"
      />

      <div
        class="relative z-10 flex flex-col gap-8 p-6 sm:p-10 lg:flex-row lg:items-end lg:gap-12"
      >
        <div class="shrink-0 [perspective:1000px]">
          <img
            :src="cover"
            :alt="plainName"
            class="w-40 rotate-[-2deg] rounded-2xl bg-white p-2 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:rotate-0 sm:w-52 lg:w-60"
            @error="onCoverError"
          >
        </div>

        <div class="min-w-0 flex-1">
          <h1
            class="game-title text-white"
            v-html="game.name"
          />

          <p
            v-if="shortDescription"
            class="mt-4 max-w-2xl text-lg leading-relaxed text-white/80"
          >
            {{ shortDescription }}
          </p>

          <GameGenres
            :game="game"
            tone="onDark"
            class="mt-5"
          />

          <GameSpecs
            :game="game"
            variant="chips"
            tone="onDark"
            class="mt-5"
          />

          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink
              v-if="game.rules_file"
              :to="ruleUrl"
              target="_blank"
              class="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-primary-800 transition-colors hover:bg-white/90"
            >
              <Icon
                name="i-heroicons-arrow-down-tray"
                class="h-5 w-5"
              />
              Скачать правила
            </NuxtLink>
            <NuxtLink
              to="/games"
              class="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-white ring-1 ring-inset ring-white/40 transition-colors hover:bg-white/10"
            >
              <Icon
                name="i-heroicons-squares-2x2"
                class="h-5 w-5"
              />
              К каталогу игр
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Тело -->
    <div class="mt-8 grid gap-6 lg:grid-cols-3">
      <div class="flex flex-col gap-6 lg:col-span-2">
        <GameGallery
          :game="game"
          :modal="modal"
          hero-covered
        />

        <article
          v-if="game.full_description"
          class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 lg:p-8"
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

const BASE_URL_IMAGE = 'http://infomania.ru/gamelibrary/img/game-cover/';
const BASE_URL_RULE = 'http://infomania.ru/gamelibrary/files/rules/';

const { removeHtmlEntities } = useStringCleaner();

const cover = computed(() => BASE_URL_IMAGE + props.game.cover_file);
const ruleUrl = computed(() => BASE_URL_RULE + props.game.rules_file);
const plainName = computed(() => removeHtmlEntities(props.game.name));
const shortDescription = computed(() =>
  removeHtmlEntities(props.game.short_description || ''),
);

const onCoverError = (event: Event) => {
  (event.target as HTMLImageElement).src = '/placeholder.jpg';
};
</script>

<style scoped>
.game-title {
  font-size: 1.875rem;
  font-weight: 800;
  line-height: 1.08;
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
    font-size: 2.5rem;
  }
}

@media (min-width: 1024px) {
  .game-title {
    font-size: 3rem;
  }
}
</style>
