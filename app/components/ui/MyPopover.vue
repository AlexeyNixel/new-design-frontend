<template>
  <!-- Зону наведения держит корень: панель — его потомок, поэтому переход курсора
       между кнопкой и панелью не считается уходом. Корень без relative — панель
       позиционируется по всей полосе навигации (relative в MainNavigation). -->
  <div
    class="inline-block"
    @mouseenter="openDropdown"
    @mouseleave="scheduleClose"
    @keydown.esc="closeAll"
  >
    <!-- Триггер. Клик меню не закрывает: при наведении оно уже открыто,
         а с клавиатуры (Enter/Space) клик только открывает его. -->
    <button
      type="button"
      class="flex items-center gap-1.5 px-2 2xl:px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap text-white/90 transition-colors duration-200 hover:bg-white/15 hover:text-white"
      :class="{ 'bg-white/15 text-white': isOpen }"
      aria-haspopup="menu"
      :aria-expanded="isOpen"
      @click="openDropdown"
    >
      <UiNavIcon
        v-if="hasNavIcon(navigation)"
        :icon="navigation.icon"
        :to="navigation.to"
        class="w-4 h-4"
      />
      {{ navigation.title }}
      <Icon
        name="i-heroicons-chevron-down-20-solid"
        class="w-4 h-4 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Мега-панель: все группы раздела сразу, колонками — без каскада подменю -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute inset-x-0 top-full z-50"
      >
        <div class="rounded-b-3xl border-t border-[#0d4954]/10 bg-white shadow-[0_24px_48px_-12px_rgb(13_73_84/0.3)]">
          <div
            role="menu"
            :aria-label="navigation.title"
            class="mx-auto flex max-w-[1710px] gap-6 xl:gap-10 px-4 sm:px-6 lg:px-8 py-6"
          >
            <!-- Карточка раздела: якорь, по которому видно, где ты находишься -->
            <div class="hidden lg:flex w-56 xl:w-64 shrink-0 flex-col rounded-2xl bg-gradient-to-br from-[#157486] to-[#0d4954] p-5 text-white">
              <span class="flex size-12 items-center justify-center rounded-2xl bg-white/15">
                <UiNavIcon
                  :icon="navigation.icon"
                  :to="navigation.to"
                  fallback="i-heroicons-squares-2x2"
                  class="size-6"
                />
              </span>
              <p class="mt-4 text-xl font-bold leading-tight">
                {{ navigation.title }}
              </p>
              <p class="mt-1 text-sm text-white/70">
                {{ linkCount }} {{ pluralLinks(linkCount) }}
              </p>
            </div>

            <!-- Колонки групп -->
            <div class="grid flex-1 grid-cols-[repeat(auto-fill,minmax(220px,1fr))] content-start gap-x-8 gap-y-6">
              <div
                v-for="group in groups"
                :key="group.id"
                class="min-w-0"
              >
                <div class="mb-2 flex items-center gap-2.5 border-b border-gray-100 pb-2.5">
                  <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#eef5f6] text-[#0d4954]">
                    <UiNavIcon
                      :icon="group.icon"
                      :to="group.to"
                      fallback="i-heroicons-folder"
                      class="size-4"
                    />
                  </span>
                  <span class="text-sm font-bold uppercase tracking-wide text-[#0d4954]">
                    {{ group.title }}
                  </span>
                </div>
                <ul class="flex flex-col">
                  <li
                    v-for="child in group.children"
                    :key="child.id"
                  >
                    <UiNavMegaLink
                      :item="child"
                      @navigate="closeAll"
                    />
                  </li>
                </ul>
              </div>

              <!-- Пункты раздела без вложенного списка — колонкой ссылок в стиле заголовков групп -->
              <ul
                v-if="leaves.length"
                class="flex min-w-0 flex-col gap-2"
              >
                <li
                  v-for="leaf in leaves"
                  :key="leaf.id"
                >
                  <UiNavMegaLink
                    :item="leaf"
                    parent
                    @navigate="closeAll"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '~~/services/api/main-navigation.api';

interface Props {
  navigation: NavigationMenuItem;
}

const props = defineProps<Props>();

type ItemId = NavigationMenuItem['id'];

// Сколько меню остаётся открытым после ухода курсора — прощает случайный промах.
const CLOSE_DELAY = 300;

// Открытым может быть только одно меню панели: при наведении на соседний
// пункт верхнего уровня предыдущее закрывается сразу, без задержки.
const openMenuId = useState<ItemId | null>('main-nav-open', () => null);
const isOpen = computed(() => openMenuId.value === props.navigation.id);

const items = computed(() =>
  (props.navigation.children ?? []).filter(item => item.type !== 'separator'),
);
const hasChildren = (item: NavigationMenuItem) => !!item.children?.length;

/** Группы со ссылками — по колонке на каждую */
const groups = computed(() => items.value.filter(hasChildren));
/** Одиночные ссылки раздела — собираются в отдельную колонку */
const leaves = computed(() => items.value.filter(item => !hasChildren(item)));

const linkCount = computed(
  () => groups.value.reduce((sum, group) => sum + group.children!.length, 0) + leaves.value.length,
);
const pluralLinks = (n: number) => plural(n, ['ссылка', 'ссылки', 'ссылок']);

let closeTimeout: ReturnType<typeof setTimeout> | null = null;

const clearTimer = (timer: ReturnType<typeof setTimeout> | null) => {
  if (timer) clearTimeout(timer);
  return null;
};

const openDropdown = () => {
  closeTimeout = clearTimer(closeTimeout);
  openMenuId.value = props.navigation.id;
};

const closeAll = () => {
  closeTimeout = clearTimer(closeTimeout);
  if (isOpen.value) openMenuId.value = null;
};

const scheduleClose = () => {
  closeTimeout = clearTimer(closeTimeout);
  closeTimeout = setTimeout(closeAll, CLOSE_DELAY);
};

onUnmounted(() => clearTimer(closeTimeout));
</script>
