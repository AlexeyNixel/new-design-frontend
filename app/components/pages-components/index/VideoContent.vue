<template>
  <CommonContentGrid :items="video"></CommonContentGrid>
</template>

<script setup lang="ts">
import { useVideoApi } from '~~/services/api/videoService';

const { data: video } = await useFetch('http://api.infomania.ru/api/video');
</script>

<style scoped></style>
