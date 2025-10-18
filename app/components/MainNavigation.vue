<template>
  <div class="w-full bg-primary">
    <UNavigationMenu
      color="info"
      :ui="ui"
      :items="items"
      class="text-white max-w-[1710px] mx-auto"
      collapsed
    />
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

const ui = {
  root: '[&>div]:w-full',
  label: 'text-white',
  item: '[&>button]:text-white [&>button]:font-bold',
  linkLeadingIcon: 'text-white',
};

const items = [
  {
    label: 'Читателям',
    icon: 'i-lucide-book-open',
    to: '',
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
    label: 'Ресурсы',
    icon: 'i-lucide-book-open',
    to: '',
    children: [
      {
        label: '123',
      },
    ],
  },
  {
    label: 'Пространства',
    icon: 'i-lucide-box',
    to: '',
  },
  {
    label: 'Конкурсы',
    icon: 'i-heroicons-gift',
    to: '',
  },
  {
    label: 'Проекты',
    icon: 'i-fluent-projection-screen-16-regular',
    to: '',
  },
  {
    label: 'О библиотеке',
    icon: 'i-heroicons-exclamation-circle',
    to: '',
  },
  {
    label: 'Коллегам',
    icon: 'i-heroicons-user-group',
    to: '',
  },
  {
    label: 'Документы',
    icon: 'i-heroicons-document',
    to: '',
  },
];

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
    icon: 'i-lucide-book-open',
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
