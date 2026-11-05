<template>
  <div class="flex flex-col gap-4 sm:gap-5">
    <!-- Вкладки слева, ссылка на полный каталог открытой вкладки — справа -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <UTabs
        v-model="tab"
        :items="items"
        :content="false"
        :ui="TABS_UI"
      />

      <NuxtLink
        v-if="activeItem.link"
        :to="activeItem.link"
        class="group shelf-link inline-flex items-center gap-2 self-end sm:self-auto shrink-0 rounded-full bg-white py-1.5 pl-4 pr-1.5 text-sm font-bold text-[#0d4954] shadow-sm ring-1 ring-[#0d4954]/10 transition-colors hover:bg-[#0d4954] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d4954]"
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
      <!-- Содержимое вкладки не подменяется, а живёт в CSS-сетке поверх своего места.
           Вкладки разного роста, поэтому по умолчанию высоту блока задаёт самая низкая
           («Комиксы»), а если текущая не помещается — блок плавно дорастает до неё.
           Так переключение не дёргает страницу, а скрытые вкладки не пересчитывают
           раскладку карусели при каждом открытии. -->
      <div
        ref="stackRef"
        class="shelf-stack"
        :class="{ 'shelf-stack--compact': tab === 'podcasts' }"
        :style="{ '--shelf-min-h': `${minContentHeight}px` }"
      >
        <div
          v-for="item in items"
          :key="item.value"
          class="shelf-panel"
          :class="{ 'shelf-panel--active': item.value === tab }"
          :inert="item.value !== tab"
          :aria-hidden="item.value !== tab"
        >
          <component :is="item.component" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TabsItem } from '#ui/components/Tabs.vue';
import { BookCollections, BookList, ComicList, PodcastList } from '#components';

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

type ShelfTab = 'books' | 'collections' | 'comics' | 'podcasts';

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
  {
    label: 'Подкасты',
    icon: 'i-heroicons-musical-note',
    value: 'podcasts',
    component: PodcastList,
    link: '',
    linkLabel: '',
  },
] satisfies (TabsItem & { value: ShelfTab; link: string; linkLabel: string })[];

const activeItem = computed(() => items.find(item => item.value === tab.value) ?? items[0]);

// Высота блока вкладок. Минимум выбирает сама CSS-сетка (--shelf-min-h, см. <style>),
// а здесь запоминаем самую низкую раскладку, у которой есть содержимое: именно она
// задаёт минимальную высоту. Пустую вкладку («Подборки», пока реестр пуст) мерой
// не считаем — иначе пустой абзац сжал бы блок и карточки обрезались бы.
const stackRef = ref<HTMLElement | null>(null);
const minContentHeight = ref(0);

let resizeObserver: ResizeObserver | null = null;

// Панель без содержимого: Nuxt рендерит только пустую обёртку <div>
const isFilledPanel = (panel: HTMLElement) =>
  Array.from(panel.children).some(
    child => child.childElementCount > 0 || (child.textContent?.trim().length ?? 0) > 0,
  );

const measureBaseHeight = () => {
  if (!stackRef.value) return;

  let min = Number.POSITIVE_INFINITY;
  stackRef.value.querySelectorAll<HTMLElement>(':scope > .shelf-panel').forEach((panel) => {
    if (!isFilledPanel(panel) || !panel.offsetHeight) return;
    min = Math.min(min, panel.getBoundingClientRect().height);
  });

  minContentHeight.value = Number.isFinite(min) ? Math.ceil(min) : 0;
};

// Пустая вкладка зажимает сетку по своей высоте — когда она открыта, меряем заново
watch(tab, () => nextTick(measureBaseHeight));

// Список изменился (API или разметка): карточки могли стать другими —
// заново ищем самую низкую заполненную вкладку
watch(
  () => {
    const stack = stackRef.value;
    if (!stack) return '';
    return Array.from(stack.querySelectorAll<HTMLElement>(':scope > .shelf-panel'))
      .filter(isFilledPanel)
      .map(panel => String(panel.offsetHeight))
      .join(',');
  },
  () => measureBaseHeight(),
);

onMounted(() => {
  // ResizeObserver на самой сетке: её высота меняется вместе с самой высокой
  // вкладкой и при ресайзе — этот случай нужен, когда ниже подстроить нечего
  resizeObserver = new ResizeObserver(() => measureBaseHeight());
  if (stackRef.value) resizeObserver.observe(stackRef.value);
  measureBaseHeight();
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
});
</script>

<style scoped>
/* На узких экранах вкладки листаются пальцем — полоса прокрутки не нужна */
:deep(.tabs-scroll) {
  scrollbar-width: none;
}

:deep(.tabs-scroll)::-webkit-scrollbar {
  display: none;
}

/* Все вкладки — в одной ячейке CSS-сетки: высоту задаёт самая высокая, но не ниже
   --shelf-min-h (самой низкой заполненной вкладки). Смена вкладки высоту не меняет. */
.shelf-stack {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-height: var(--shelf-min-h);

  /* Высота при смене вкладки или загрузке данных меняется плавно, а не рывком.
     grid-template-rows в переход не входит, поэтому анимируются сами панели по высоте. */
  transition: height 0.3s ease;
}

/* Вкладка «Подкасты» — компактная область: высоту задаёт только её содержимое, а не
   высокая карусель книг/комиксов. Остальные панели убираем из потока (ширина и высота
   у них остаются, карусели не пересчитываются), поэтому под карточками подкастов нет
   пустого места на весь блок полки. */
.shelf-stack--compact {
  overflow: hidden;
}

.shelf-stack--compact .shelf-panel:not(.shelf-panel--active) {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

@media (prefers-reduced-motion: reduce) {
  .shelf-stack {
    transition: none;
  }
}

.shelf-panel {
  grid-area: 1 / 1;
  align-self: start;
  min-width: 0;
  transition: height 0.3s ease;
}

/* Неактивные вкладки лежат в потоке (высота и ширина известны, карусели
   проинициализированы), но не видны, не кликаются (inert) и не озвучиваются. */
.shelf-panel:not(.shelf-panel--active) {
  visibility: hidden;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .shelf-panel {
    transition: none;
  }
}
</style>
