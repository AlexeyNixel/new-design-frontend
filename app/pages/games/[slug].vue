<template>
  <CommonContentContainer>
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <NuxtLink
        to="/games"
        class="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition-colors hover:text-primary-700"
      >
        <Icon
          name="i-heroicons-arrow-left-20-solid"
          class="h-4 w-4"
        />
        Каталог игр
      </NuxtLink>

      <!-- Временный переключатель дизайна для сравнения вариантов -->
      <div
        class="inline-flex rounded-full bg-white p-1 shadow-sm ring-1 ring-gray-200"
      >
        <button
          v-for="option in designOptions"
          :key="option.value"
          type="button"
          class="rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors"
          :class="
            design === option.value
              ? 'bg-primary-700 text-white'
              : 'text-gray-500 hover:text-gray-900'
          "
          @click="setDesign(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <template v-if="game">
      <GameDetailModern
        v-if="design === 'modern'"
        :game="game"
        :other-games="otherGames"
        :modal="modal"
      />
      <GameDetailClassic
        v-else
        :game="game"
        :other-games="otherGames"
        :modal="modal"
      />
    </template>

    <div
      v-else
      class="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-gray-100"
    >
      <p class="text-lg font-semibold text-gray-900">
        Игра не найдена
      </p>
      <p class="mt-1 text-sm text-gray-500">
        Возможно, её убрали из игротеки или ссылка устарела.
      </p>
      <NuxtLink
        to="/games"
        class="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary-700 px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-800"
      >
        Вернуться в каталог
      </NuxtLink>
    </div>
  </CommonContentContainer>
</template>

<script setup lang="ts">
import { useGameApi } from '~~/services/api/game.api';
import { ModalsCommon } from '#components';

type DesignVariant = 'modern' | 'classic';

const route = useRoute();
const overlay = useOverlay();
const gameApi = useGameApi();

const { data: game } = await gameApi.getOneGames(route.params.slug as string);

// Если игра — часть серии, "Смотрите также" показывает другие её части,
// иначе — произвольную подборку из каталога.
const { data: otherGames } = await gameApi.getAllGames(
  game?.seriesId
    ? { seriesId: game.seriesId, limit: 6 }
    : { limit: 6 },
);

const modal = overlay.create(ModalsCommon);

const designOptions: { value: DesignVariant; label: string }[] = [
  { value: 'modern', label: 'Современный' },
  { value: 'classic', label: 'Классический' },
];

const design = useState<DesignVariant>('game-detail-design', () => 'modern');

const setDesign = (value: DesignVariant) => {
  design.value = value;
  if (import.meta.client) {
    localStorage.setItem('game-detail-design', value);
  }
};

onMounted(() => {
  const saved = localStorage.getItem('game-detail-design');
  if (saved === 'modern' || saved === 'classic') {
    design.value = saved;
  }
});

if (game) {
  const title = game.title;
  const description
    = game.shortDescription
      || `Настольная игра «${title}» в игротеке — параметры, описание и правила.`;

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: game.images[0]?.file.path,
    ogType: 'article',
  });
}
</script>

<style scoped></style>
