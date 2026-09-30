<template>
  <!-- Зону наведения держит только корень: панель и подменю — его потомки,
       поэтому переход курсора между кнопкой, панелью и подменю не считается уходом. -->
  <div
    class="relative inline-block"
    @mouseenter="openDropdown"
    @mouseleave="scheduleClose"
    @keydown.esc="closeAll"
  >
    <!-- Триггер. Клик меню не закрывает: при наведении оно уже открыто,
         а с клавиатуры (Enter/Space) клик только открывает его. -->

    <button
      type="button"
      class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white/90 transition-colors duration-200 hover:bg-white/15 hover:text-white"
      :class="{ 'bg-white/15 text-white': isOpen }"
      aria-haspopup="menu"
      :aria-expanded="isOpen"
      @click="openDropdown"
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

    <!-- Выпадающий список. Паддинг-мостик (pt-2) закрывает щель между кнопкой и панелью. -->
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
        class="absolute top-full left-0 z-50 w-max pt-2"
      >
        <div
          ref="panelRef"
          role="menu"
          class="flex flex-col min-w-[240px] rounded-2xl border border-gray-100 bg-white p-2 shadow-xl"
          @mousemove="trackPointer"
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

            <!-- Пункт меню. Подменю лежит внутри пункта, поэтому, пока курсор
                 на подменю, пункт остаётся «наведённым». -->
            <div
              v-else
              class="relative"
              @mouseenter="hoverItem(item)"
            >
              <!-- Обычная ссылка -->
              <NuxtLink
                v-if="!hasChildren(item)"
                :to="item.to"
                :target="item.target"
                role="menuitem"
                class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-primary-700/5 hover:text-primary-700"
                @click="closeAll"
              >
                <span
                  v-if="item.icon"
                  class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors duration-150 group-hover:bg-primary-700/10 group-hover:text-primary-700"
                >
                  <Icon
                    :name="item.icon"
                    class="w-4 h-4"
                  />
                </span>
                <span>{{ item.title }}</span>
              </NuxtLink>

              <!-- Пункт с вложенным списком -->
              <button
                v-else
                type="button"
                role="menuitem"
                aria-haspopup="menu"
                :aria-expanded="activeChildItem === item.id"
                class="group flex w-full cursor-default items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors duration-150"
                :class="
                  activeChildItem === item.id
                    ? 'bg-primary-700/5 text-primary-700'
                    : 'text-gray-700 hover:bg-primary-700/5 hover:text-primary-700'
                "
                @click="showChild(item.id)"
              >
                <span
                  v-if="item.icon"
                  class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-150"
                  :class="
                    activeChildItem === item.id
                      ? 'bg-primary-700/10 text-primary-700'
                      : 'bg-gray-100 text-gray-500 group-hover:bg-primary-700/10 group-hover:text-primary-700'
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
              </button>

              <!-- Второй уровень: паддинг-мостик по горизонтали
                   (влево или вправо — см. positionChild) -->
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
                  class="absolute top-0 z-50"
                  :style="childStyle"
                >
                  <div
                    :ref="setChildPanel"
                    role="menu"
                    class="flex flex-col min-w-[240px] rounded-2xl border border-gray-100 bg-white p-2 shadow-xl"
                  >
                    <NuxtLink
                      v-for="child in item.children"
                      :key="child.id"
                      :to="child.to"
                      :target="child.target"
                      role="menuitem"
                      class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-primary-700/5 hover:text-primary-700"
                      @click="closeAll"
                    >
                      <span
                        v-if="child.icon"
                        class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors duration-150 group-hover:bg-primary-700/10 group-hover:text-primary-700"
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
import type { ComponentPublicInstance } from 'vue';
import type { NavigationMenuItem } from '~~/services/api/main-navigation.api';

interface Props {
  navigation: NavigationMenuItem;
}

const props = defineProps<Props>();

type ItemId = NavigationMenuItem['id'];
interface Point { x: number; y: number }

// Сколько меню остаётся открытым после ухода курсора — прощает случайный промах.
const CLOSE_DELAY = 300;
// Сколько ждём, прежде чем сменить подменю, пока курсор движется к открытому.
const AIM_DELAY = 350;
// Невидимый "мостик" между панелью и подменю (px).
const CHILD_GAP = 8;
// Запас треугольника "прицеливания" по вертикали (px).
const AIM_TOLERANCE = 40;

// Открытым может быть только одно меню панели: при наведении на соседний
// пункт верхнего уровня предыдущее закрывается сразу, без задержки.
const openMenuId = useState<ItemId | null>('main-nav-open', () => null);
const isOpen = computed(() => openMenuId.value === props.navigation.id);

const activeChildItem = ref<ItemId | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const childPanel = ref<HTMLElement | null>(null);
const childStyle = ref<Record<string, string>>({
  left: '100%',
  paddingLeft: `${CHILD_GAP}px`,
});

let closeTimeout: ReturnType<typeof setTimeout> | null = null;
let aimTimeout: ReturnType<typeof setTimeout> | null = null;
let pendingChild: ItemId | null | undefined;
const pointer: Point[] = [];

const hasChildren = (item: NavigationMenuItem) =>
  !!item.children && item.children.length > 0;

const setChildPanel = (el: Element | ComponentPublicInstance | null) => {
  childPanel.value = el as HTMLElement | null;
};

const clearTimer = (timer: ReturnType<typeof setTimeout> | null) => {
  if (timer) clearTimeout(timer);
  return null;
};

const cancelPending = () => {
  aimTimeout = clearTimer(aimTimeout);
  pendingChild = undefined;
};

const openDropdown = () => {
  closeTimeout = clearTimer(closeTimeout);
  openMenuId.value = props.navigation.id;
};

const closeAll = () => {
  closeTimeout = clearTimer(closeTimeout);
  cancelPending();
  activeChildItem.value = null;
  if (isOpen.value) openMenuId.value = null;
};

const scheduleClose = () => {
  closeTimeout = clearTimer(closeTimeout);
  closeTimeout = setTimeout(closeAll, CLOSE_DELAY);
};

// Меню закрыли снаружи (открыли соседнее) — сбрасываем подменю
watch(isOpen, (open) => {
  if (!open) {
    cancelPending();
    activeChildItem.value = null;
  }
});

const positionChild = () => {
  if (!panelRef.value || !childPanel.value) return;

  const panelRect = panelRef.value.getBoundingClientRect();
  const width = childPanel.value.offsetWidth + CHILD_GAP;
  const spaceRight = window.innerWidth - panelRect.right;

  if (spaceRight >= width) {
    childStyle.value = { left: '100%', paddingLeft: `${CHILD_GAP}px` };
  }
  else if (panelRect.left >= width) {
    childStyle.value = { right: '100%', paddingRight: `${CHILD_GAP}px` };
  }
  else {
    // Места нет ни с одной стороны — открываем вправо со сдвигом внутрь экрана
    childStyle.value = {
      left: '100%',
      paddingLeft: `${CHILD_GAP}px`,
      transform: `translateX(-${Math.ceil(width - spaceRight)}px)`,
    };
  }
};

const showChild = async (id: ItemId | null) => {
  cancelPending();
  if (activeChildItem.value === id) return;

  activeChildItem.value = id;
  if (id === null) return;

  await nextTick();
  positionChild();
};

const isInTriangle = (p: Point, a: Point, b: Point, c: Point) => {
  const sign = (p1: Point, p2: Point, p3: Point) =>
    (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
  const d1 = sign(p, a, b);
  const d2 = sign(p, b, c);
  const d3 = sign(p, c, a);
  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(hasNeg && hasPos);
};

/**
 * Курсор движется к открытому подменю? Строим треугольник от предыдущей точки
 * курсора к ближнему краю подменю: пока курсор внутри — пользователь «целится»
 * в подменю, и задетые по пути пункты не должны его переключать.
 */
const isAimingAtChild = () => {
  if (!childPanel.value || pointer.length < 2) return false;

  const prev = pointer[0]!;
  const cur = pointer[pointer.length - 1]!;
  const rect = childPanel.value.getBoundingClientRect();
  const edgeX = rect.left >= prev.x ? rect.left : rect.right;

  return isInTriangle(
    cur,
    prev,
    { x: edgeX, y: rect.top - AIM_TOLERANCE },
    { x: edgeX, y: rect.bottom + AIM_TOLERANCE },
  );
};

const trackPointer = (event: MouseEvent) => {
  pointer.push({ x: event.clientX, y: event.clientY });
  if (pointer.length > 4) pointer.shift();

  // Курсор перестал идти к подменю — переключаем сразу, не дожидаясь таймера
  if (pendingChild !== undefined && !isAimingAtChild()) {
    showChild(pendingChild);
  }
};

const hoverItem = (item: NavigationMenuItem) => {
  closeTimeout = clearTimer(closeTimeout);
  const target = hasChildren(item) ? item.id : null;

  if (target === activeChildItem.value) {
    // Вернулись на пункт открытого подменю (или вошли в само подменю)
    cancelPending();
    return;
  }

  if (activeChildItem.value !== null && isAimingAtChild()) {
    pendingChild = target;
    aimTimeout = clearTimer(aimTimeout);
    aimTimeout = setTimeout(() => showChild(target), AIM_DELAY);
    return;
  }

  showChild(target);
};

const handleResize = () => {
  if (activeChildItem.value !== null) positionChild();
};

onMounted(() => window.addEventListener('resize', handleResize));

onUnmounted(() => {
  clearTimer(closeTimeout);
  clearTimer(aimTimeout);
  window.removeEventListener('resize', handleResize);
});
</script>
