<template>
  <div v-if="game" class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Хлебные крошки -->
    <CommonContentContainer class="pt-6 pb-4">
      <UBreadcrumb
        :ui="{ link: '[&>span]:text-gray-700' }"
        :items="[
          { label: 'Главная', to: '/' },
          { label: 'Библиотека игр', to: '/games' },
          { label: game.name, active: true },
        ]"
      />
    </CommonContentContainer>

    <!-- Основной контент -->
    <CommonContentContainer class="py-6">
      <!-- Заголовок и мета-информация -->
      <div class="mb-8">
        <h1
          class="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          v-html="game.name"
        />

        <div class="flex flex-wrap items-center gap-4 text-gray-600">
          <div class="flex items-center gap-2">
            <Icon name="i-heroicons-calendar" class="w-5 h-5" />
            <span
              >Год выпуска:
              <strong class="text-gray-900">{{
                game.game_year || 'Не указан'
              }}</strong></span
            >
          </div>
          <div class="flex items-center gap-2">
            <Icon name="i-heroicons-clock" class="w-5 h-5" />
            <span
              >Время игры:
              <strong class="text-gray-900"
                >{{ game.game_duration }} минут</strong
              ></span
            >
          </div>
          <div
            :class="[
              'px-3 py-1 rounded-full text-sm font-semibold',
              game.status === 1
                ? 'bg-green-100 text-green-800'
                : game.status === 0
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800',
            ]"
          >
            {{
              game.status_desc ||
              (game.status === 1 ? 'Доступно' : 'Недоступно')
            }}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Левая колонка - изображение и основные параметры -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Изображение игры -->
          <div class="bg-white rounded-2xl overflow-hidden shadow-lg">
            <img
              :src="baseUrlImage + game.cover_file"
              :alt="game.name"
              class="w-full h-[400px] md:h-[500px] object-cover"
              @error="handleImageError"
            />
          </div>

          <!-- Описание игры -->
          <div class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2
              class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3"
            >
              <Icon
                name="i-heroicons-document-text"
                class="w-6 h-6 text-primary"
              />
              Описание игры
            </h2>

            <div v-if="game.full_description" class="prose prose-lg max-w-none">
              <div v-html="game.full_description" />
            </div>
            <div v-else-if="game.short_description" class="text-gray-600">
              {{ game.short_description }}
            </div>
            <div v-else class="text-gray-500 italic">
              Описание игры отсутствует
            </div>
          </div>

          <!-- Правила игры -->
          <div
            v-if="game.rules_file"
            class="bg-white rounded-2xl shadow-lg p-6 md:p-8"
          >
            <h2
              class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3"
            >
              <Icon name="i-heroicons-book-open" class="w-6 h-6 text-primary" />
              Правила игры
            </h2>

            <div class="flex items-center gap-4">
              <div class="flex-1">
                <p class="text-gray-600 mb-4">
                  Загрузите файл с правилами игры для ознакомления
                </p>
              </div>
              <a
                :href="baseUrlImage + game.rules_file"
                target="_blank"
                class="inline-flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                <Icon name="i-heroicons-arrow-down-tray" class="w-5 h-5" />
                Скачать правила
              </a>
            </div>
          </div>
        </div>

        <!-- Правая колонка - детали игры -->
        <div class="space-y-6">
          <!-- Карточка с параметрами игры -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2
              class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"
            >
              <Icon
                name="i-heroicons-information-circle"
                class="w-5 h-5 text-primary"
              />
              Параметры игры
            </h2>

            <div class="space-y-4">
              <!-- Игроки -->
              <div
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="i-heroicons-user-group"
                      class="w-5 h-5 text-primary"
                    />
                  </div>
                  <div>
                    <div class="text-sm text-gray-500">Количество игроков</div>
                    <div class="font-bold text-gray-900">
                      {{ game.player_min }}-{{ game.player_max }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Возраст -->
              <div
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="i-heroicons-cake"
                      class="w-5 h-5 text-primary"
                    />
                  </div>
                  <div>
                    <div class="text-sm text-gray-500">
                      Возрастное ограничение
                    </div>
                    <div class="font-bold text-gray-900">
                      {{ game.player_age }}+ лет
                    </div>
                  </div>
                </div>
              </div>

              <!-- Время -->
              <div
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="i-heroicons-clock"
                      class="w-5 h-5 text-primary"
                    />
                  </div>
                  <div>
                    <div class="text-sm text-gray-500">Время партии</div>
                    <div class="font-bold text-gray-900">
                      {{ game.game_duration }} минут
                    </div>
                  </div>
                </div>
              </div>

              <!-- Год -->
              <div
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="i-heroicons-calendar"
                      class="w-5 h-5 text-primary"
                    />
                  </div>
                  <div>
                    <div class="text-sm text-gray-500">Год выпуска</div>
                    <div class="font-bold text-gray-900">
                      {{ game.game_year }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Место -->
              <div
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="i-heroicons-map-pin"
                      class="w-5 h-5 text-primary"
                    />
                  </div>
                  <div>
                    <div class="text-sm text-gray-500">Место хранения</div>
                    <div class="font-bold text-gray-900 truncate">
                      {{ game.place || 'Не указано' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Жанры -->
          <div v-if="game.genres" class="bg-white rounded-2xl shadow-lg p-6">
            <h2
              class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
            >
              <Icon name="i-heroicons-tag" class="w-5 h-5 text-primary" />
              Жанры
            </h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(genre, index) in game.genres.split(', ')"
                :key="index"
                class="inline-block bg-gray-100 text-gray-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                {{ genre.trim() }}
              </span>
            </div>
          </div>

          <!-- Комментарии -->
          <div v-if="game.comment" class="bg-white rounded-2xl shadow-lg p-6">
            <h2
              class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
            >
              <Icon
                name="i-heroicons-chat-bubble-left-right"
                class="w-5 h-5 text-primary"
              />
              Комментарии
            </h2>
            <p class="text-gray-600">{{ game.comment }}</p>
          </div>

          <!-- Кнопка бронирования -->
          <div
            class="bg-gradient-to-r from-primary to-primary/90 rounded-2xl p-6 text-white"
          >
            <h3 class="text-xl font-bold mb-3">Хотите поиграть?</h3>
            <p class="mb-6 opacity-90">
              Забронируйте эту игру для вашего мероприятия
            </p>
            <UButton
              :disabled="game.status !== 1"
              :class="[
                'w-full py-3 font-semibold',
                game.status === 1
                  ? 'bg-white text-primary hover:bg-gray-100'
                  : 'bg-gray-300 cursor-not-allowed',
              ]"
            >
              <Icon name="i-heroicons-calendar-days" class="w-5 h-5 mr-2" />
              {{
                game.status === 1
                  ? 'Забронировать игру'
                  : 'Игра временно недоступна'
              }}
            </UButton>
          </div>
        </div>
      </div>

      <!-- Другие игры из библиотеки -->
      <div v-if="otherGames && otherGames.length > 0" class="mt-16">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900">
              Другие игры из библиотеки
            </h2>
            <p class="text-gray-600 mt-2">
              Возможно, вас заинтересуют эти игры
            </p>
          </div>
          <NuxtLink
            to="/games"
            class="text-primary font-semibold hover:underline flex items-center gap-2"
          >
            Все игры
            <Icon name="i-heroicons-arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>

        <!-- Карусель с играми -->
      </div>
    </CommonContentContainer>
  </div>

  <!-- Состояние загрузки -->
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-12 h-12 text-primary animate-spin mx-auto mb-4"
      />
      <p class="text-gray-600">Загрузка информации об игре...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameApi } from '~~/services/api/game.api';

const route = useRoute();
const gameApi = useGameApi();

// Загружаем данные игры
const { data: game } = await gameApi.getOneGames('gm623');

// Загружаем другие игры (например, с похожими жанрами или случайные)
const { data: otherGames } = await gameApi.getAllGames({ limit: 8 });

const baseUrlImage = 'http://infomania.ru/gamelibrary/img/game-cover/';

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.src = 'https://placehold.co/800x500/6b7280/ffffff?text=Обложка+игры';
};

// Форматирование HTML контента
const formatHtml = (html: string) => {
  if (!html) return '';
  return html.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '</p>\n');
};
</script>

<style scoped>
/* Стили для многоточия и контента */
.prose :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.prose :deep(ul),
.prose :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3) {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.prose :deep(a) {
  color: #3b82f6;
  text-decoration: underline;
}

/* Анимации */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Адаптивность */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  h1 {
    font-size: 1.75rem;
  }

  .prose {
    font-size: 0.95rem;
  }
}
</style>
