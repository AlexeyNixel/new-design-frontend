<template>
  <NuxtLayout>
    <UApp :locale="ru">
      <NuxtPage />
    </UApp>
  </NuxtLayout>
</template>
<script setup lang="ts">
import { ru } from '@nuxt/ui/locale';

useHead({
  script: [
    { src: 'https://forms.yandex.ru/_static/embed.js' },
    {
      src: 'https://pos.gosuslugi.ru/bin/script.min.js',
      body: true,
    },
    {
      innerHTML: "Widget('https://pos.gosuslugi.ru/form', 348893)",
      body: true,
    },
  ],
});
useSeoMeta({
  title: 'НОМБ',
});
</script>
