<template>
  <div class="w-full bg-primary">
    <UNavigationMenu
      color="info"
      :ui="ui"
      :items="items"
      label-key="title"
      class="text-white max-w-[1710px] mx-auto"
      collapsed
    />
  </div>
</template>

<script setup lang="ts">
import { useNavigationApi } from '~~/services/api/main-navigation.api';

interface Menu {
  id: string;
  oldId: number;
  title: string;
  isDeleted: boolean;
  menuType: string;
  menuItems: Array<any>;
}

interface MenuResponse {
  data: Menu[];
  meta: any;
}

const ui = {
  root: '[&>div]:w-full',
  label: 'text-white',
  item: '[&>button]:text-white [&>button]:font-bold',
  linkLeadingIcon: 'text-white',
};

const navigationApi = useNavigationApi();

const items = await navigationApi.getAllNavigation();
</script>

<style scoped></style>
