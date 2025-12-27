<template>
  <div
    class="relative inline-block"
    @mouseenter="openDropdown"
    @mouseleave="closeDropdown"
  >
    <!-- Триггер кнопка -->
    <UButton
      :label="navigation.title"
      :icon="navigation.icon"
      trailing-icon="i-heroicons-chevron-down-20-solid"
      class="flex items-center gap-1"
    />

    <!-- Выпадающий список -->
    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        ref="dropdownRef"
        class="absolute z-50 mt-2 w-max rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
        @mouseenter="openDropdown"
        @mouseleave="closeDropdown"
      >
        <!-- Список элементов -->
        <div class="py-1 flex flex-col min-w-[160px]">
          <template
            v-for="(item, index) in navigation.children"
            :key="item.id || index"
          >
            <!-- Разделитель -->
            <div
              v-if="item.type === 'separator'"
              class="border-t border-gray-200 dark:border-gray-700 my-1"
            />

            <!-- Элемент с вложенностью -->
            <div
              v-else
              class="relative group"
              @mouseenter="(e) => handleItemHover(e, item)"
              @mouseleave="closeChildDropdown"
            >
              <UButton
                color="white"
                :to="
                  item.children && item.children.length > 0
                    ? undefined
                    : item.to
                "
                :icon="item.icon"
                class="w-full justify-start px-4 py-2 text-sm rounded-none group-hover:bg-gray-50 dark:group-hover:bg-gray-700"
                :label="item.title"
                :trailing-icon="
                  item.children && item.children.length > 0
                    ? 'i-lucide-chevron-right'
                    : undefined
                "
              />

              <!-- Второй уровень вложенности -->
              <Transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <div
                  v-if="activeChildItem === item.id"
                  ref="childDropdownRef"
                  class="absolute top-0 rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[160px] z-50"
                  :style="childDropdownStyle"
                  @mouseenter="keepChildOpen"
                  @mouseleave="closeChildDropdown"
                >
                  <template v-for="child in item.children" :key="child.id">
                    <UButton
                      :to="child.to"
                      color="white"
                      variant="ghost"
                      class="w-full justify-start px-4 py-2 text-sm rounded-none hover:bg-gray-50 dark:hover:bg-gray-700"
                      :label="child.title"
                      :icon="child.icon"
                      @click="handleChildClick(child)"
                    />
                  </template>
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
interface NavigationItem {
  id: string | number;
  title: string;
  icon?: string;
  to?: string;
  type?: string;
  children?: NavigationItem[];
}

interface Props {
  navigation: NavigationItem & {
    children?: NavigationItem[];
  };
}

const props = defineProps<Props>();

const isOpen = ref(false);
const activeChildItem = ref<string | number | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const childDropdownRef = ref<HTMLElement | null>(null);
const childDropdownStyle = ref({});

let closeTimeout: NodeJS.Timeout | null = null;
let childCloseTimeout: NodeJS.Timeout | null = null;
let resizeObserver: ResizeObserver | null = null;

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
  }, 100);
};

const handleItemHover = async (event: MouseEvent, item: NavigationItem) => {
  if (closeTimeout) {
    clearTimeout(closeTimeout);
    closeTimeout = null;
  }

  if (childCloseTimeout) {
    clearTimeout(childCloseTimeout);
    childCloseTimeout = null;
  }

  if (item.children && item.children.length > 0) {
    activeChildItem.value = item.id;

    // Ждем следующего тика для отрисовки DOM
    await nextTick();

    // Вычисляем позицию после отрисовки
    calculateChildDropdownPosition();
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
  }, 100);
};

const calculateChildDropdownPosition = () => {
  if (!dropdownRef.value || !childDropdownRef.value) return;

  const dropdownRect = dropdownRef.value.getBoundingClientRect();
  const childDropdownWidth = childDropdownRef.value.offsetWidth || 160;

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
      marginLeft: '1px',
    };
  } else if (availableSpaceLeft >= childDropdownWidth) {
    // Места слева достаточно - открываем влево
    childDropdownStyle.value = {
      right: '100%',
      top: '0',
      marginRight: '1px',
    };
  } else {
    // Если нет места ни слева, ни справа - открываем вправо, но сдвигаем внутрь
    const offset = Math.max(0, childDropdownWidth - availableSpaceRight);
    childDropdownStyle.value = {
      left: '100%',
      top: '0',
      marginLeft: '1px',
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
  if (process.client) {
    window.removeEventListener('resize', handleResize);
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  }
});
</script>
