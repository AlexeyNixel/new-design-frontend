<template>
  <div
    v-if="game.rules_file"
    class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 lg:p-6"
  >
    <h3 class="flex items-center gap-2 text-lg font-bold text-gray-900">
      <Icon
        name="i-heroicons-book-open"
        class="h-5 w-5 text-primary-700"
      />
      Правила игры
    </h3>
    <p class="mt-1.5 text-sm text-gray-600">
      Скачайте PDF с правилами, чтобы разобраться до первой партии.
    </p>
    <NuxtLink
      :to="ruleUrl"
      target="_blank"
      class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-700 px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-800"
    >
      <Icon
        name="i-heroicons-arrow-down-tray"
        class="h-5 w-5"
      />
      Скачать правила
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { Game } from '~~/services/types/game.type';

const props = defineProps<{ game: Game }>();

const BASE_URL_RULE = 'http://infomania.ru/gamelibrary/files/rules/';

const ruleUrl = computed(() => BASE_URL_RULE + props.game.rules_file);
</script>
