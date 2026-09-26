<template>
  <!-- Секция целиком внутри компонента: если выставок нет или API недоступен,
       на главной не останется пустого блока с заголовком -->
  <CommonSectionWrapper
    v-if="latest"
    title="Виртуальные выставки"
    link="/page/exhibition"
    link-label="Все выставки"
  >
    <div class="grid gap-5 lg:grid-cols-2">
      <!-- Новая выставка — крупно -->
      <a
        :href="exhibitionUrl(latest)"
        target="_blank"
        rel="noopener"
        class="group relative block rounded-2xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
      >
        <!-- На десктопе высоту задаёт колонка справа — обложка заполняет её целиком -->
        <div class="aspect-video lg:aspect-auto lg:h-full bg-gray-100">
          <img
            :src="exhibitionCover(latest)"
            :alt="`Обложка новой виртуальной выставки от ${formatDate(latest.createdAt)}`"
            width="1280"
            height="720"
            loading="lazy"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            @error="onImageError"
          >
        </div>
        <span
          class="absolute top-4 left-4 rounded-full bg-primary-500 px-3 py-1 text-xs font-semibold text-white shadow"
        >
          Новая выставка
        </span>
      </a>

      <!-- Предыдущие — списком: миниатюра, дата, ссылка -->
      <ul class="flex flex-col gap-4">
        <li
          v-for="item in previous"
          :key="item.id"
          class="flex-1"
        >
          <a
            :href="exhibitionUrl(item)"
            target="_blank"
            rel="noopener"
            class="group flex h-full items-center gap-4 rounded-2xl bg-white p-3 shadow hover:shadow-lg transition-shadow duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            <div class="w-36 sm:w-48 shrink-0 aspect-video overflow-hidden rounded-xl bg-gray-100">
              <img
                :src="exhibitionCover(item)"
                :alt="`Обложка виртуальной выставки от ${formatDate(item.createdAt)}`"
                width="384"
                height="216"
                loading="lazy"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                @error="onImageError"
              >
            </div>
            <div class="min-w-0 flex flex-col gap-1 text-sm">
              <span class="text-gray-500">{{ formatDate(item.createdAt) }}</span>
              <span class="inline-flex items-center gap-1 font-semibold text-primary-500 group-hover:underline">
                Открыть выставку
                <UIcon
                  name="i-heroicons-arrow-top-right-on-square"
                  class="size-4"
                />
              </span>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </CommonSectionWrapper>
</template>

<script setup lang="ts">
import { useExhibitionApi } from '~~/services/api/exhibitionsService';

const exhibitionApi = useExhibitionApi();
const formatDate = useFormateDate();

// Ошибка API не должна ронять главную — просто не показываем секцию
const exhibitions = await exhibitionApi
  .getAllExhibitions({ page: 1, limit: 4, sortOrder: 'desc' })
  .then(response => response.data ?? [])
  .catch(() => []);

const latest = computed(() => exhibitions[0]);
const previous = computed(() => exhibitions.slice(1));

const onImageError = (event: Event) => {
  (event.target as HTMLImageElement).src = '/placeholder.jpg';
};
</script>
