<template>
  <div class="grid grid-cols-2 gap-5">
    <div
      class="relative shadow rounded-xl overflow-hidden"
      v-for="(item, index) in exhibitions"
      :key="index"
      :class="{ 'col-span-2': index === 0 }"
    >
      <img :src="item.preview" alt="" />
      <div class="absolute top-5 right-0 font-bold p-2 bg-primary text-white">
        {{ formattedDate(item.createdAt) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExhibitionApi } from '~~/services/api/exhibitionsService';

const exhibitionApi = useExhibitionApi();
const formattedDate = useFormateDate();

const { data: exhibitions } = await exhibitionApi.getAllExhibition({
  orderBy: '-createdAt',
  pageSize: 3,
});
</script>

<style scoped></style>
