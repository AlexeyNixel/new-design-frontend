<template>
  <div>
    <UCarousel @select="select" :ui="ui" v-slot="{ item }" :items="items">
      <div class="bg-blue-400">
        {{ item }}
      </div>
    </UCarousel>

    <div>{{ activeIdx }}</div>
  </div>
</template>

<script setup lang="ts">
const items = [1, 2, 3, 4, 5, 6];
</script>

<style scoped></style>
