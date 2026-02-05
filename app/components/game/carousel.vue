<template>
  <UCarousel class="h-full" :ui="ui" v-slot="{ item }" :items="games">
    <GameCard :game="item" />
  </UCarousel>
</template>

<script setup lang="ts">
import { useGameApi } from '~~/services/api/game.api';
import CustomSwiper from '~/components/ui/CustomSwiper.vue';

const ui = {
  root: 'h-full flex',
  viewport: 'h-full ',
  item: 'h-full w-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6 transition-opacity ',
  container: 'h-full',
  arrows: 'absolute right-15 bottom-5',
  prev: ' rounded  bg-primary text-white border-0 ring-0 hover:bg-primary-100 hover:cursor-pointer',
  next: ' rounded  bg-primary text-white border-0 ring-0 hover:bg-primary-100 hover:cursor-pointer',
};

const gameApi = useGameApi();

const { data: games } = await gameApi.getAllGames();
</script>

<style scoped></style>
