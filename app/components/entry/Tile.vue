<template>
  <NuxtLink
    :to="{ name: 'entry-slug', params: { slug: entry.slug } }"
    class="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row items-stretch min-h-64 hover:-translate-y-2 border border-gray-100"
  >
    <!-- Изображение с эффектами -->
    <div
      class="md:w-72 min-w-72 h-64 md:h-auto overflow-hidden relative shrink-0"
    >
      <img
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        :onerror="notFoundImage"
        :src="entry?.preview?.path"
        :alt="entry.title"
        loading="lazy"
      />

      <!-- Градиентная накладка -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 md:opacity-0 group-hover:opacity-60 transition-opacity duration-300"
      ></div>

      <!-- Дата в стиле карточки -->
      <div
        class="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg"
      >
        <div class="flex flex-col items-center">
          <span class="text-sm font-semibold text-gray-500">
            {{ formateDate(entry.publishedAt, 'MMM') }}
          </span>
          <span class="text-2xl font-bold text-gray-800">
            {{ formateDate(entry.publishedAt, 'DD') }}
          </span>
          <span class="text-xs text-gray-500">
            {{ formateDate(entry.publishedAt, 'YYYY') }}
          </span>
        </div>
      </div>
    </div>

    <!-- Контент -->
    <div class="p-5 md:p-6 flex flex-col justify-between flex-1">
      <!-- Заголовок и описание -->
      <div>
        <h2
          class="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2"
        >
          {{ entry.title }}
        </h2>

        <div
          v-html="entry.description"
          class="text-gray-600 mb-4 line-clamp-3 prose prose-sm max-w-none"
        />
      </div>

      <!-- Нижняя панель -->
      <div class="pt-4 border-t border-gray-100 mt-auto">
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <!-- Департамент -->
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg flex items-center justify-center"
            >
              <Icon
                name="i-heroicons-building-office-20-solid"
                class="w-5 h-5 text-primary"
              />
            </div>
            <div>
              <div class="text-xs text-gray-500">Отдел</div>
              <div class="font-medium text-gray-800">
                {{ entry.department?.title }}
              </div>
            </div>
          </div>

          <!-- Дополнительная информация -->
          <div class="flex items-center gap-6 text-sm">
            <!-- Дата -->
            <div class="flex items-center text-gray-600">
              <Icon name="i-heroicons-calendar-20-solid" class="w-4 h-4 mr-2" />
              <span>{{ formateDate(entry.publishedAt, 'DD MMMM YYYY') }}</span>
            </div>

            <!-- Кнопка читать -->
            <div class="flex items-center text-primary font-semibold">
              <span class="mr-2">Подробнее</span>
              <Icon
                name="i-heroicons-arrow-right-20-solid"
                class="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Entry } from '~~/services/types/entry.type';

defineProps<{
  entry: Entry;
}>();

// Хелпер для форматирования даты
const formateDate = (dateString: string, format: string = 'DD MMMM YYYY') => {
  const date = new Date(dateString);
  const options: any = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  if (format === 'MMM') {
    return date.toLocaleDateString('ru-RU', { month: 'short' });
  } else if (format === 'DD') {
    return date.getDate().toString();
  } else if (format === 'YYYY') {
    return date.getFullYear().toString();
  }

  return date.toLocaleDateString('ru-RU', options);
};

const notFoundImage = (e: any) => {
  e.target.src = 'https://cdn1.flamp.ru/b1aea1d7e4be8c57b1e414678d5756f0.png';
};
</script>

<style scoped></style>
