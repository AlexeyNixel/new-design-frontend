<template>
  <NuxtLayout>
    <UApp :locale="ru">
      <NuxtPage />
    </UApp>
    <!-- TODO(prod-gate): скрыть в production (import.meta.dev + defineAsyncComponent).
         Вне <UApp>, чтобы не влиять на гидрацию его внутренних компонентов. -->
    <DevPanel />
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
  ],
});
useSeoMeta({
  title: 'НОМБ',
});
</script>
