<script setup lang="ts">
const props = defineProps<{
  game: any;
}>();

const baseUrlImage = 'http://infomania.ru/gamelibrary/img/game-cover/';
</script>

<template>
  <NuxtLink class="bg-white rounded overflow-hidden flex flex-col w-max">
    <img
      class="w-[250px] object-cover"
      :src="baseUrlImage + game.cover_file"
      alt=""
    />
    <div class="p-2">
      <div class="text-wrap" v-html="game.name"></div>
    </div>
  </NuxtLink>
</template>

<style scoped></style>
