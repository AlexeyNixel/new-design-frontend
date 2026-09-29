<template>
  <!-- Секция целиком внутри компонента: если выставок нет или API недоступен,
       на главной не останется пустого блока с заголовком -->
  <CommonSectionWrapper
    v-if="exhibitions.length"
    title="Виртуальные выставки"
    link="/page/exhibition"
    link-label="Все выставки"
  >
    <!-- Все выставки в один ряд одинаковыми карточками — блок не раздувает главную -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
      <div
        v-for="(item, index) in exhibitions"
        :key="item.id"
        class="relative"
      >
        <ExhibitionCard :exhibition="item" />
        <span
          v-if="index === 0"
          class="pointer-events-none absolute top-2 left-2 md:top-3 md:left-3 rounded-full bg-primary-500 px-2.5 py-0.5 text-xs font-semibold text-white shadow"
        >
          Новая
        </span>
      </div>
    </div>
  </CommonSectionWrapper>
</template>

<script setup lang="ts">
import { useExhibitionApi } from '~~/services/api/exhibitionsService';

const exhibitionApi = useExhibitionApi();

// Ошибка API не должна ронять главную — просто не показываем секцию
const exhibitions = await exhibitionApi
  .getAllExhibitions({ page: 1, limit: 4, sortOrder: 'desc' })
  .then(response => response.data ?? [])
  .catch(() => []);
</script>
