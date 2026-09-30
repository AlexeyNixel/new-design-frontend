<template>
  <!-- Тот же бирюзовый, что у фона героя на главной (primary-50 → primary-100), но темнее,
       чтобы полоса читалась отдельным слоем и не спорила со слайдером -->
  <div class="w-full bg-gradient-to-r from-primary-700 to-primary-800 shadow-sm">
    <div class="max-w-[1710px] mx-auto flex items-center justify-between gap-1 px-4 sm:px-6 lg:px-8 py-1.5">
      <div
        v-for="item in items"
        :key="item.id"
      >
        <MyPopover :navigation="item" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNavigationApi } from '~~/services/api/main-navigation.api';
import MyPopover from '~/components/ui/MyPopover.vue';

const navigationApi = useNavigationApi();

const items = await navigationApi.getAllNavigation();
</script>

<style scoped></style>
