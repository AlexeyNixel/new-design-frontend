<template>
  <NuxtLink
    :to="`/games/${game.id}`"
    class="group h-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col w-full max-w-[280px] hover:-translate-y-2 border border-gray-100"
  >
    <!-- Обертка для изображения -->
    <div
      class="relative overflow-hidden h-80 bg-gradient-to-br from-gray-100 to-gray-200"
    >
      <!-- Изображение игры -->
      <img
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        :src="baseUrlImage + game.cover_file"
        :alt="game.name"
        loading="lazy"
        @error="handleImageError"
      />

      <!-- Бейдж статуса -->
      <div class="absolute top-3 left-3">
        <span
          :class="[
            'px-3 py-1 rounded-full text-xs font-semibold shadow-md',
            game.status === 1
              ? 'bg-green-500/90 text-white'
              : game.status === 0
                ? 'bg-yellow-500/90 text-white'
                : 'bg-red-500/90 text-white',
          ]"
        >
          {{
            game.status_desc || (game.status === 1 ? 'Доступно' : 'Недоступно')
          }}
        </span>
      </div>

      <!-- Год выпуска -->
      <div
        class="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-full"
      >
        {{ game.game_year || 'N/A' }}
      </div>

      <!-- Индикатор количества игроков -->
      <div
        class="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <Icon name="i-heroicons-user-group" class="w-4 h-4 text-primary" />
            <span class="font-bold text-gray-900"
              >{{ game.player_min }}-{{ game.player_max }}</span
            >
          </div>
          <div class="flex items-center gap-1">
            <Icon name="i-heroicons-clock" class="w-4 h-4 text-primary" />
            <span class="font-bold text-gray-900"
              >{{ game.game_duration }} мин</span
            >
          </div>
          <div class="flex items-center gap-1">
            <Icon name="i-heroicons-cake" class="w-4 h-4 text-primary" />
            <span class="font-bold text-gray-900">{{ game.player_age }}+</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Контент карточки -->
    <div class="p-4 md:p-5 flex-1 flex flex-col">
      <!-- Название игры -->
      <h3
        class="text-lg font-bold h-full text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight"
        v-html="game.name"
      />

      <!-- Жанры -->
      <div v-if="game.genres" class="mb-4">
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(genre, index) in game.genres.split(', ').slice(0, 3)"
            :key="index"
            class="inline-block bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            {{ genre.trim() }}
          </span>
          <span
            v-if="game.genres.split(', ').length > 3"
            class="text-gray-400 text-xs self-center"
          >
            +{{ game.genres.split(', ').length - 3 }}
          </span>
        </div>
      </div>

      <!-- Краткое описание -->
      <div
        v-if="game.short_description"
        class="text-gray-600 text-sm mb-4 line-clamp-2 flex-1"
        v-html="game.short_description"
      />

      <!-- Дополнительная информация -->
      <div class="pt-4 border-t border-gray-100 mt-auto">
        <div class="flex items-center justify-between">
          <!-- Локация -->
          <div v-if="game.place" class="flex items-center gap-2">
            <div
              class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center"
            >
              <Icon name="i-heroicons-map-pin" class="w-4 h-4 text-primary" />
            </div>
            <span class="text-sm text-gray-700 truncate max-w-[100px]">{{
              game.place
            }}</span>
          </div>

          <!-- Кнопка подробнее -->
          <div class="flex items-center text-primary font-semibold text-sm">
            <span>Подробнее</span>
            <Icon
              name="i-heroicons-arrow-right-20-solid"
              class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Game } from '~~/services/types/game.type';

const props = defineProps<{
  game: Game;
}>();

const baseUrlImage = 'http://infomania.ru/gamelibrary/img/game-cover/';

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.src = 'https://placehold.co/280x320/6b7280/ffffff?text=Нет+обложки';
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Убираем лишние теги из HTML-контента */
:deep(br) {
  display: none;
}

:deep(p) {
  margin: 0;
  display: inline;
}
</style>
