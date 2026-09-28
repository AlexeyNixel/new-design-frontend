<template>
  <div class="w-full bg-primary shadow-sm">
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
