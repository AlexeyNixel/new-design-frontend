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

const dropdownItems = [
  { id: 1, label: 'Мой профиль', icon: 'i-heroicons-user-circle' },
  { id: 2, label: 'Сообщения', icon: 'i-heroicons-envelope', to: '/messages' },
  { id: 3, label: 'Уведомления', icon: 'i-heroicons-bell', disabled: true },
  { type: 'separator' },
  {
    id: 4,
    label: 'Выйти',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    color: 'red',
  },
];
</script>

<style scoped></style>
