<template>
  <div class="bg-primary my-4 p-2">
    <div class="flex justify-between mx-auto max-w-[1710px]">
      <UPopover mode="hover" v-for="item in items">
        <UButton
          variant="link"
          class="text-white hover:text-muted active:text-muted text-md"
          :icon="item.icon"
        >
          {{ item.label }}</UButton
        >

        <template #content>
          <div class="p-2">
            <div
              v-if="item?.children?.length > 1"
              v-for="child in item?.children"
              class="p-2 flex gap-2 items-center rounded hover:bg-neutral-100"
            >
              <icon :name="child.icon" class="text-2xl"></icon>
              <div>
                <h3 class="my-2 font-bold">{{ child.label }}</h3>
                <div class="text-muted">{{ child.description }}</div>
              </div>
            </div>
            <div v-else class="h-[100px] w-[100px]">123</div>
          </div>
        </template>
      </UPopover>
    </div>
  </div>
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
    label: 'Пространства',
    icon: 'i-lucide-box',
    active: true,
  },
  {
    label: 'Конкурсы',
    icon: 'i-heroicons-gift',
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
