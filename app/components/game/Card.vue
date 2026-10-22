<template>
  <NuxtLink
    :to="`/games/${game.slug}`"
    class="group h-full bg-white rounded-2xl overflow-hidden shadow-sm ring-1 ring-gray-200 transition-all duration-300 flex flex-col w-full hover:-translate-y-1 hover:shadow-lg focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#0d4954]"
    :class="[
      compact ? '' : stretch ? 'sm:min-h-[560px]' : 'min-h-[560px]',
      stretch ? 'sm:max-w-[320px]' : 'max-w-[320px]',
    ]"
  >
    <!-- Коробка игры на фирменном светло-бирюзовом поле; multiply растворяет белый фон фото -->
    <div
      class="relative overflow-hidden bg-[#eef5f6] flex items-center justify-center px-5 pt-12 pb-5"
      :class="compact ? 'h-56' : 'h-72'"
    >
      <img
        class="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.04] group-hover:-rotate-1"
        :src="game.images[0]?.file.path"
        :srcset="imageSrcset(game.images[0]?.file)"
        sizes="(max-width: 640px) 100vw, 320px"
        :alt="game.title"
        width="400"
        height="320"
        loading="lazy"
        @error="handleImageError"
      >

      <!-- Статус: точка-индикатор, как в расписании работы в подвале -->
      <span
        class="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-bold text-[#0d4954] shadow-sm"
      >
        <span
          class="size-2 rounded-full"
          :class="statusDotClass"
        />
        {{ statusLabel }}
      </span>

      <span
        v-if="game.year"
        class="absolute top-3 right-3 rounded-full bg-[#0d4954] px-2.5 py-1 text-xs font-bold text-white"
      >
        {{ game.year }}
      </span>
    </div>

    <!-- Контент карточки -->
    <div class="p-4 md:p-5 flex-1 flex flex-col">
      <!-- Игроки, длительность и возраст: только заполненные поля -->
      <div
        v-if="hasPlayers || hasDuration || hasAge"
        class="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-[#157486]"
      >
        <span
          v-if="hasPlayers"
          class="inline-flex items-center gap-1"
          title="Количество игроков"
        >
          <Icon
            name="i-heroicons-user-group"
            class="size-4"
          />
          {{ playersText }}
        </span>
        <span
          v-if="hasDuration"
          class="inline-flex items-center gap-1"
          title="Длительность партии, мин"
        >
          <Icon
            name="i-heroicons-clock"
            class="size-4"
          />
          {{ durationText }} мин
        </span>
        <span
          v-if="hasAge"
          class="inline-flex items-center gap-1"
          title="Возраст игроков"
        >
          <Icon
            name="i-heroicons-cake"
            class="size-4"
          />
          {{ game.playerAge }}+
        </span>
      </div>

      <!-- Название игры -->
      <h3
        class="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:underline group-hover:underline-offset-4"
      >
        {{ game.title }}
      </h3>

      <!-- Жанры -->
      <div
        v-if="game.genres.length"
        class="mb-3 flex flex-wrap gap-1.5"
      >
        <span
          v-for="{ genre } in game.genres"
          :key="genre.id"
          class="rounded-full bg-[#eef5f6] px-2.5 py-0.5 text-xs font-semibold text-[#0d4954]"
        >
          {{ genre.title }}
        </span>
      </div>

      <!-- Краткое описание -->
      <div
        v-if="game.shortDescription"
        class="text-gray-600 text-sm mb-4 line-clamp-2"
      >
        {{ game.shortDescription }}
      </div>

      <!-- Кнопка подробнее: прижата к низу -->
      <div class="pt-3 border-t border-gray-100 mt-auto flex items-center text-[#157486] font-bold text-sm">
        <span>Подробнее</span>
        <Icon
          name="i-heroicons-arrow-right-20-solid"
          class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
        />
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Game } from '~~/services/types/game.type';
import { GameStatusLabels } from '~/constants/gameStatus';

const props = defineProps<{
  game: Game;
  compact?: boolean;
  /** На телефоне — во всю ширину колонки и без выравнивания по высоте (сетка каталога) */
  stretch?: boolean;
}>();

const statusLabel = computed(() => GameStatusLabels[props.game.status]);

/** Цвет точки статуса: в фонде — зелёный, на руках/временно нет — жёлтый, остальное — серый */
const statusDotClass = computed(() => {
  if (props.game.status === 'IN_STOCK') return 'bg-success';
  if (props.game.status === 'ON_HANDS' || props.game.status === 'TEMPORARILY_UNAVAILABLE')
    return 'bg-[#F2B632]';
  return 'bg-gray-400';
});

const hasPlayers = computed(
  () => props.game.playerMin != null || props.game.playerMax != null,
);

const hasDuration = computed(
  () => props.game.durationMin != null || props.game.durationMax != null,
);

const hasAge = computed(() => props.game.playerAge != null);

const playersText = computed(() => {
  const { playerMin, playerMax } = props.game;
  if (playerMin != null && playerMax != null && playerMin !== playerMax) {
    return `${playerMin}-${playerMax}`;
  }
  return `${playerMin ?? playerMax}`;
});

const durationText = computed(() => {
  const { durationMin, durationMax } = props.game;
  if (durationMin != null && durationMax != null && durationMin !== durationMax) {
    return `${durationMin}-${durationMax}`;
  }
  return `${durationMin ?? durationMax}`;
});

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.removeAttribute('srcset');
  target.src = '/placeholder.jpg';
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
