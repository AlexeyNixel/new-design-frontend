<template>
  <div class="flex flex-col gap-4 sm:gap-5">
    <!-- Видимого заголовка нет — его роль играют вкладки; для скринридеров и структуры страницы оставляем h2 -->
    <h2 class="sr-only">
      Книги
    </h2>

    <!-- Вкладки слева, ссылка на полный каталог открытой вкладки — справа -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <UTabs
        v-model="tab"
        :items="items"
        :content="false"
        :ui="TABS_UI"
      />

      <NuxtLink
        :to="activeItem.link"
        class="group inline-flex items-center gap-2 self-end sm:self-auto shrink-0 rounded-full bg-white py-1.5 pl-4 pr-1.5 text-sm font-bold text-[#0d4954] shadow-sm ring-1 ring-[#0d4954]/10 transition-colors hover:bg-[#0d4954] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d4954]"
      >
        <!-- Та же «пилюля», что у ссылок в заголовках остальных блоков главной (CommonSectionWrapper) -->
        <span>{{ activeItem.linkLabel }}</span>
        <span class="flex size-7 items-center justify-center rounded-full bg-[#eef5f6] text-[#0d4954] transition-transform group-hover:translate-x-0.5">
          <Icon
            name="i-heroicons-arrow-right-20-solid"
            class="size-4"
          />
        </span>
      </NuxtLink>
    </div>

    <div
      role="tabpanel"
      :aria-label="activeItem.label"
    >
      <component :is="activeItem.component" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TabsItem } from '#ui/components/Tabs.vue';
import { BookCollections, BookList, ComicList } from '#components';

/** Вкладки-«пилюли» в фирменных бирюзовых цветах — как кнопки календаря событий */
const TABS_UI = {
  root: 'min-w-0',
  list: 'w-full sm:w-fit max-w-full p-1 rounded-full bg-white ring-1 ring-[#0d4954]/10 shadow-sm overflow-x-auto tabs-scroll',
  indicator: 'rounded-full bg-[#0d4954] shadow-none inset-y-1',
  trigger:
    'shrink-0 grow sm:grow-0 rounded-full px-3 sm:px-5 py-2 text-[#0d4954] data-[state=inactive]:text-[#0d4954]/70 hover:data-[state=inactive]:not-disabled:text-[#0d4954] data-[state=active]:text-white focus-visible:outline-[#0d4954]',
  // На телефоне без иконок — так все три вкладки помещаются в ширину экрана
  leadingIcon: 'hidden sm:inline-block size-5',
  label: 'text-sm sm:text-base font-bold',
};

type ShelfTab = 'books' | 'collections' | 'comics';

const tab = ref<ShelfTab>('books');

const items = [
  {
    label: 'Книги',
    icon: 'i-heroicons-book-open',
    value: 'books',
    component: BookList,
    link: '/books',
    linkLabel: 'Все книги',
  },
  {
    label: 'Подборки',
    icon: 'i-heroicons-rectangle-stack',
    value: 'collections',
    component: BookCollections,
    link: '/books/collections',
    linkLabel: 'Все подборки',
  },
  {
    label: 'Комиксы / Манга',
    icon: 'i-heroicons-paint-brush',
    value: 'comics',
    component: ComicList,
    link: '/comics',
    linkLabel: 'Все комиксы и манга',
  },
] satisfies (TabsItem & { value: ShelfTab; link: string; linkLabel: string })[];

const activeItem = computed(() => items.find(item => item.value === tab.value) ?? items[0]);
</script>

<style scoped>
/* На узких экранах вкладки листаются пальцем — полоса прокрутки не нужна */
:deep(.tabs-scroll) {
  scrollbar-width: none;
}

:deep(.tabs-scroll)::-webkit-scrollbar {
  display: none;
}
</style>
