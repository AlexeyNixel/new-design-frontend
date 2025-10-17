<template>
  <NuxtLayout>
    <UApp :locale="ru">
      <NuxtPage />
    </UApp>
  </NuxtLayout>
</template>
<script setup lang="ts">
import { ru } from '@nuxt/ui/locale';

useHead({ script: [{ src: 'https://forms.yandex.ru/_static/embed.js' }] });
useSeoMeta({
  title: 'НОМБ',
});
</script>
