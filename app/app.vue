<template>
  <NuxtLayout>
    <UApp :locale="ru">
      <NuxtPage />
    </UApp>
  </NuxtLayout>
</template>
<script setup lang="ts">
import { ru } from '@nuxt/ui/locale';

useSeoMeta({
  title: 'НОМБ',
});
</script>
