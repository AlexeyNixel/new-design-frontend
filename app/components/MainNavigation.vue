<template>
  <UNavigationMenu
    color="secondary"
    contentOrientation="vertical"
    :items="items"
    class="my-4 w-full justify-center bg-[#0F172B] text-white"
  >
    <template #item="{ item }">
      <div class="text-white font-bold text-[16px] mx-10">
        {{ item.label }}
      </div>
    </template>
  </UNavigationMenu>
</template>

<script setup lang="ts">
// import type { Menu } from '~~/types/api';

import type { NavigationMenuItem } from '#ui/components/NavigationMenu.vue';

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

const navigationLinks = [
  {
    text: 'Читателям',
    link: '/',
  },

  {
    text: 'Ресурсы',
    link: '/',
  },
  {
    text: 'Пространства',
    link: '/',
  },
  {
    text: 'Конкурсы',
    link: '/',
  },
  {
    text: 'Проекты',
    link: '/',
  },
  {
    text: 'О библиотеке',
    link: '/',
  },
  {
    text: 'Коллегам',
    link: '/',
  },
  {
    text: 'Документы',
    link: '/',
  },
];
const items = ref<NavigationMenuItem[]>([
  {
    label: 'Читателям',
    icon: 'i-lucide-book-open',
    children: [
      {
        label: 'Услуги',
        description: 'Список услуг предостовляемый нашей библиотекой.',
        icon: 'i-lucide-house',
      },
      {
        label: 'Мероприятия',
        description: 'Список мероприятий проходящих в нашей библиотеке.',
        icon: 'i-lucide-cloud-download',
      },
      {
        label: 'Объединения',
        icon: 'i-lucide-smile',
        description: 'Кружки по интересам .',
      },
    ],
  },
  {
    label: 'Ресурсы',
    icon: 'i-lucide-database',
  },
  {
    label: 'Пространства',
    icon: 'i-lucide-box',
    active: true,
  },
  {
    label: 'Конкурсы',
    icon: 'i-simple-icons-github',
    children: [{}],
  },
  {
    label: 'Проекты',
    icon: 'i-fluent-projection-screen-16-regular',
    children: [{}],
  },
  {
    label: 'О библиотеке',
    icon: 'i-heroicons-exclamation-circle',
    children: [{}],
  },
  {
    label: 'Коллегам',
    icon: 'i-heroicons-user-group',
    children: [{}],
  },
  {
    label: 'Документы',
    icon: 'i-heroicons-document',
    children: [{}],
  },
]);
const { data: menus }: MenuResponse = await $fetch(
  'http://api.infomania.ru/api/menu',
  {
    params: { pageSize: 50, type: 'COMMON' },
  }
);
</script>

<style scoped></style>
