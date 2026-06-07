<template>
  <CommonContentGrid :items="video" />
</template>

<script setup lang="ts">
const { data: video } = await useFetch('http://api.infomania.ru/api/video');
</script>

<style scoped></style>
