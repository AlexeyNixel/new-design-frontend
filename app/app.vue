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
    {
      type: 'text/javascript',
      src: 'https://vk.com/js/api/openapi.js?173',
    },
  ],
});
useSeoMeta({
  title: 'НОМБ',
});

onMounted(() => {
  VK.Widgets.Podcast(
    'vk_podcast_-203872543_456239018',
    '-203872543_456239018',
    '0d6c0c098dce43c129'
  );
});
</script>
