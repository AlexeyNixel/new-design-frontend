<template>
  <div class="bg-primary my-4 p-2">
    <div class="flex justify-between mx-auto max-w-[1710px]">
      <UiCustomPopover
        v-for="(menu, index) in menus"
        :key="index"
        :label="menu.label"
        :icon="menu.icon"
        side="bottom"
        mode="click"
      >
        <div class="flex flex-col">
          <UiCustomPopover
            v-if="menu.children"
            v-for="(child, childIdx) in menu.children"
            :key="childIdx"
            :label="child.label"
            :icon="child.icon"
            side="right"
            mode="hover"
          >
            <UButton
              v-if="child.children"
              v-for="(item, itemIdx) in child.children"
              variant="link"
              :key="itemIdx"
              :label="item.label"
              :icon="item.icon"
            />
          </UiCustomPopover>
        </div>
      </UiCustomPopover>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const menus = ref([
  {
    label: 'Читателям',
    icon: 'i-lucide-book-open',
    children: [
      {
        label: 'Услуги',
        icon: 'i-lucide-house',
        children: [
          {
            label: 'Ответы на вопросы',
            icon: 'i-lucide-house',
          },
          {
            label: 'Пушкинская карта',
            icon: 'i-lucide-cloud-download',
          },
          {
            label: 'Ассортимент услуг',
            icon: 'i-lucide-smile',
          },
          {
            label: 'Сервисные услуги',
            icon: 'i-lucide-smile',
          },
          {
            label: 'Личный кабинет',
            icon: 'i-lucide-smile',
          },
          {
            label: 'Виртуальная справка',
            icon: 'i-lucide-smile',
          },
          {
            label: 'Правила пользования',
            icon: 'i-lucide-smile',
          },
          {
            label: 'Правила выдачи книг из фонда',
            icon: 'i-lucide-smile',
          },
          {
            label: 'Обратная связь',
            icon: 'i-lucide-smile',
          },
        ],
      },
      {
        label: 'Мероприятия',
        icon: 'i-lucide-cloud-download',
      },
      {
        label: 'Объединения',
        icon: 'i-lucide-smile',
      },
    ],
  },
  {
    label: 'Ресурсы',
    icon: 'i-lucide-database',
    children: [
      {
        label: 'Услуги',

        icon: 'i-lucide-house',
      },
      {
        label: 'Мероприятия',

        icon: 'i-lucide-cloud-download',
      },
      {
        label: 'Объединения',
        icon: 'i-lucide-smile',
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
    children: [],
  },
  {
    label: 'Проекты',
    icon: 'i-fluent-projection-screen-16-regular',
    children: [],
  },
  {
    label: 'О библиотеке',
    icon: 'i-heroicons-exclamation-circle',
    children: [],
  },
  {
    label: 'Коллегам',
    icon: 'i-heroicons-user-group',
    children: [],
  },
  {
    label: 'Документы',
    icon: 'i-heroicons-document',
    children: [],
  },
]);
</script>

<style scoped></style>
