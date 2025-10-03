<template>
  <ClientOnly>
    <swiper-container slides-per-view="auto" :loop="true" :speed="800">
      <swiper-slide v-for="(entry, index) in entries" :key="entry.id">
        <img
          class="w-full h-[300px] object-cover rounded-lg shadow-lg"
          :src="'http://static.infomania.ru' + entry.preview.path"
          :alt="entry.title"
        />
      </swiper-slide>
    </swiper-container>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useEntryApi } from '~~/services/api/entryService';
import { ref, onMounted, computed } from 'vue';

const entryApi = useEntryApi();

const { data: entries } = await entryApi.getAllEntry({
  pageSize: 10,
  orderBy: '-createdAt',
  include: 'preview',
});
</script>

<style scoped>
.swiper-slide-active {
  width: 50% !important;
  transition: width 1s ease;
}

.swiper-slide-prev {
  width: 25% !important;
  transition: width 1s ease;
}

.swiper-slide-next {
  width: 25% !important;
  transition: width 1s ease;
}

.slide-transition {
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
</style>
