<template>
  <div class="w-full bg-primary">
    <div class="max-w-[1710px] mx-auto flex justify-between p-2">
      <div v-for="item in items" :key="item.id">
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
