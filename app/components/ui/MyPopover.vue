<template>
  <div
    class="relative inline-block"
    @mouseenter="openDropdown"
    @mouseleave="closeDropdown"
  >
    <!-- Триггер -->
    <button
      type="button"
      class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white/90 transition-colors duration-200 hover:bg-white/10 hover:text-white"
      :class="{ 'bg-white/10 text-white': isOpen }"
      aria-haspopup="menu"
      :aria-expanded="isOpen"
    >
      <Icon
        v-if="navigation.icon"
        :name="navigation.icon"
        class="w-4 h-4"
      />
      {{ navigation.title }}
      <Icon
        name="i-heroicons-chevron-down-20-solid"
        class="w-4 h-4 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Выпадающий список.
         Наружная обёртка добавляет невидимый паддинг-мостик (pt-2) между кнопкой и панелью:
         без него курсор, двигаясь вниз, ненадолго покидает зону наведения и меню закрывается
         раньше, чем пользователь успевает попасть на панель. -->
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
        ref="dropdownRef"
        class="absolute top-full left-0 z-50 w-max pt-2"
        @mouseenter="openDropdown"
        @mouseleave="closeDropdown"
      >
        <div
          role="menu"
          class="flex flex-col min-w-[240px] rounded-2xl border border-gray-100 bg-white p-2 shadow-xl"
        >
          <template
            v-for="(item, index) in navigation.children"
            :key="item.id || index"
          >
            <!-- Разделитель -->
            <div
              v-if="item.type === 'separator'"
              class="mx-2 my-1.5 h-px bg-gray-100"
            />

            <!-- Пункт меню -->
            <div
              v-else
              class="relative"
              @mouseenter="(e) => handleItemHover(e, item)"
              @mouseleave="closeChildDropdown"
            >
              <!-- Обычная ссылка -->
              <NuxtLink
                v-if="!hasChildren(item)"
                :to="item.to"
                :target="item.target"
                role="menuitem"
                class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-primary/5 hover:text-primary"
                @click="closeAll"
              >
                <span
                  v-if="item.icon"
                  class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors duration-150 group-hover:bg-primary/10 group-hover:text-primary"
                >
                  <Icon
                    :name="item.icon"
                    class="w-4 h-4"
                  />
                </span>
                <span>{{ item.title }}</span>
              </NuxtLink>

              <!-- Пункт с вложенным списком -->
              <div
                v-else
                role="menuitem"
                :aria-expanded="activeChildItem === item.id"
                class="group flex cursor-default items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150"
                :class="
                  activeChildItem === item.id
                    ? 'bg-primary/5 text-primary'
                    : 'text-gray-700 hover:bg-primary/5 hover:text-primary'
                "
              >
                <span
                  v-if="item.icon"
                  class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-150"
                  :class="
                    activeChildItem === item.id
                      ? 'bg-primary/10 text-primary'
                      : 'bg-gray-100 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary'
                  "
                >
                  <Icon
                    :name="item.icon"
                    class="w-4 h-4"
                  />
                </span>
                <span class="flex-1">{{ item.title }}</span>
                <Icon
                  name="i-lucide-chevron-right"
                  class="w-4 h-4 text-gray-400"
                />
              </div>

              <!-- Второй уровень вложенности: та же логика паддинга-мостика,
                   но по горизонтали (влево или вправо — см. calculateChildDropdownPosition) -->
              <Transition
                enter-active-class="transition duration-150 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="activeChildItem === item.id"
                  ref="childDropdownRef"
                  class="absolute z-50"
                  :style="childDropdownStyle"
                  @mouseenter="keepChildOpen"
                  @mouseleave="closeChildDropdown"
                >
                  <div
                    role="menu"
                    class="flex flex-col min-w-[240px] rounded-2xl border border-gray-100 bg-white p-2 shadow-xl"
                  >
                    <NuxtLink
                      v-for="child in item.children"
                      :key="child.id"
                      :to="child.to"
                      :target="child.target"
                      role="menuitem"
                      class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-primary/5 hover:text-primary"
                      @click="closeAll"
                    >
                      <span
                        v-if="child.icon"
                        class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors duration-150 group-hover:bg-primary/10 group-hover:text-primary"
                      >
                        <Icon
                          :name="child.icon"
                          class="w-4 h-4"
                        />
                      </span>
                      <span>{{ child.title }}</span>
                    </NuxtLink>
                  </div>
                </div>
              </Transition>
            </div>
          </template>
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

defineProps<Props>();

// Насколько дольше меню остаётся открытым после того, как курсор покинул его зону:
// даёт время перевести мышь на панель/вложенный список, не закрывая их случайно.
const CLOSE_DELAY = 350;
const CHILD_CLOSE_DELAY = 300;
// Невидимый "мостик" между уровнями меню (px), см. комментарии в template.
const CHILD_GAP = 8;

const isOpen = ref(false);
const activeChildItem = ref<string | number | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const childDropdownRef = ref<HTMLElement | null>(null);
const childDropdownStyle = ref({});

let closeTimeout: ReturnType<typeof setTimeout> | null = null;
let childCloseTimeout: ReturnType<typeof setTimeout> | null = null;
let resizeObserver: ResizeObserver | null = null;

const hasChildren = (item: NavigationMenuItem) =>
  !!item.children && item.children.length > 0;

const openDropdown = () => {
  if (closeTimeout) {
    clearTimeout(closeTimeout);
    closeTimeout = null;
  }
  isOpen.value = true;
};

const closeDropdown = () => {
  closeTimeout = setTimeout(() => {
    isOpen.value = false;
    activeChildItem.value = null;
  }, CLOSE_DELAY);
};

const closeAll = () => {
  if (closeTimeout) {
    clearTimeout(closeTimeout);
    closeTimeout = null;
  }
  if (childCloseTimeout) {
    clearTimeout(childCloseTimeout);
    childCloseTimeout = null;
  }
  isOpen.value = false;
  activeChildItem.value = null;
};

const handleItemHover = async (event: MouseEvent, item: NavigationMenuItem) => {
  if (closeTimeout) {
    clearTimeout(closeTimeout);
    closeTimeout = null;
  }

  if (childCloseTimeout) {
    clearTimeout(childCloseTimeout);
    childCloseTimeout = null;
  }

  if (hasChildren(item)) {
    activeChildItem.value = item.id;

    // Ждем следующего тика для отрисовки DOM
    await nextTick();

    // Вычисляем позицию после отрисовки
    calculateChildDropdownPosition();
  }
  else {
    activeChildItem.value = null;
  }
};

const keepChildOpen = () => {
  if (childCloseTimeout) {
    clearTimeout(childCloseTimeout);
    childCloseTimeout = null;
  }
};

const closeChildDropdown = () => {
  childCloseTimeout = setTimeout(() => {
    activeChildItem.value = null;
  }, CHILD_CLOSE_DELAY);
};

const calculateChildDropdownPosition = () => {
  if (!dropdownRef.value || !childDropdownRef.value) return;

  const dropdownRect = dropdownRef.value.getBoundingClientRect();
  const childDropdownWidth = childDropdownRef.value.offsetWidth || 240;

  // Доступное место справа
  const availableSpaceRight = window.innerWidth - dropdownRect.right - 330;
  // Доступное место слева
  const availableSpaceLeft = dropdownRect.left;

  // Определяем позицию
  if (availableSpaceRight >= childDropdownWidth) {
    // Места справа достаточно - открываем вправо
    childDropdownStyle.value = {
      left: '100%',
      top: '0',
      paddingLeft: `${CHILD_GAP}px`,
    };
  }
  else if (availableSpaceLeft >= childDropdownWidth) {
    // Места слева достаточно - открываем влево
    childDropdownStyle.value = {
      right: '100%',
      top: '0',
      paddingRight: `${CHILD_GAP}px`,
    };
  }
  else {
    // Если нет места ни слева, ни справа - открываем вправо, но сдвигаем внутрь
    const offset = Math.max(0, childDropdownWidth - availableSpaceRight);
    childDropdownStyle.value = {
      left: '100%',
      top: '0',
      paddingLeft: `${CHILD_GAP}px`,
      transform: `translateX(-${offset}px)`,
    };
  }
};

// Наблюдаем за изменениями размеров
const setupResizeObserver = () => {
  if (!dropdownRef.value) return;

  resizeObserver = new ResizeObserver(() => {
    if (activeChildItem.value) {
      calculateChildDropdownPosition();
    }
  });

  resizeObserver.observe(dropdownRef.value);
};

const handleResize = () => {
  if (activeChildItem.value) {
    calculateChildDropdownPosition();
  }
};

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('resize', handleResize);
    setupResizeObserver();
  }
});

onUnmounted(() => {
  if (closeTimeout) {
    clearTimeout(closeTimeout);
  }
  if (childCloseTimeout) {
    clearTimeout(childCloseTimeout);
  }
  if (import.meta.client) {
    window.removeEventListener('resize', handleResize);
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  }
});
</script>
