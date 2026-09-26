<template>
  <Teleport to="body">
    <Transition
      name="drawer"
      @after-leave="path = []"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-[100] xl:hidden"
      >
        <div
          class="drawer-backdrop absolute inset-0 bg-gray-950/45 backdrop-blur-[2px]"
          @click="close"
        />

        <div
          class="drawer-panel absolute inset-y-0 right-0 flex flex-col w-[88%] max-w-[420px] bg-white shadow-2xl rounded-l-3xl overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Меню сайта"
          @touchstart.passive="onTouchStart"
          @touchend.passive="onTouchEnd"
        >
          <!-- Верхняя панель: логотип на первом уровне, «Назад» на вложенных -->
          <div class="flex items-center justify-between gap-2 h-16 pl-3 pr-3 border-b border-gray-100 shrink-0">
            <button
              v-if="path.length"
              type="button"
              class="flex items-center gap-1 min-h-11 pl-1 pr-3 rounded-xl text-sm font-medium text-gray-600 active:bg-neutral-100 transition-colors min-w-0"
              @click="goBack"
            >
              <Icon
                name="i-lucide-chevron-left"
                class="size-5 shrink-0"
              />
              <span class="truncate">{{ backLabel }}</span>
            </button>
            <NuxtLink
              v-else
              to="/"
              class="block w-24 pl-2 fill-primary"
              aria-label="НОМБ — на главную"
              @click="close"
            >
              <Logo class="w-full h-auto" />
            </NuxtLink>

            <button
              ref="closeButton"
              type="button"
              class="flex items-center justify-center size-11 shrink-0 rounded-full bg-neutral-100 text-gray-700 active:bg-neutral-200 transition-colors"
              aria-label="Закрыть меню"
              @click="close"
            >
              <Icon
                name="i-lucide-x"
                class="size-5"
              />
            </button>
          </div>

          <!-- Уровни меню: каждый следующий выезжает поверх предыдущего -->
          <div class="relative flex-1 overflow-hidden">
            <Transition :name="direction">
              <nav
                :key="levelKey"
                class="absolute inset-0 overflow-y-auto overscroll-contain bg-white px-3 pt-3 pb-6"
                :aria-label="current ? current.title : 'Разделы сайта'"
              >
                <!-- Первый уровень: быстрые ссылки + разделы -->
                <template v-if="!current">
                  <div
                    v-if="quickLinks.length"
                    class="grid grid-cols-2 gap-2 mb-5"
                  >
                    <NuxtLink
                      v-for="link in quickLinks"
                      :key="link.label"
                      :to="link.link"
                      class="flex items-center gap-2.5 min-h-14 px-3 py-2 rounded-2xl bg-neutral-100 active:bg-neutral-200 transition-colors"
                      @click="close"
                    >
                      <Icon
                        :name="link.icon"
                        class="size-5 shrink-0 text-primary"
                      />
                      <span class="text-[13px] font-medium leading-tight text-gray-800">{{ link.label }}</span>
                    </NuxtLink>
                  </div>

                  <p class="px-3 mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Разделы
                  </p>
                </template>

                <!-- Заголовок вложенного уровня -->
                <div
                  v-else
                  class="px-3 pt-1 pb-3"
                >
                  <p
                    v-if="path.length > 1"
                    class="text-xs text-gray-400 truncate mb-0.5"
                  >
                    {{ path.slice(0, -1).map((item) => item.title).join(' / ') }}
                  </p>
                  <h2 class="text-xl font-bold text-gray-900 leading-tight">
                    {{ current.title }}
                  </h2>
                </div>

                <ul class="space-y-0.5">
                  <li
                    v-for="item in currentItems"
                    :key="item.id"
                  >
                    <div
                      v-if="item.type === 'separator'"
                      class="border-t border-gray-100 my-2 mx-3"
                    />

                    <!-- Пункт с вложенными — открывает следующий уровень -->
                    <button
                      v-else-if="hasChildren(item)"
                      type="button"
                      class="menu-row"
                      :class="{ 'menu-row--active': isInActiveBranch(item) }"
                      @click="goTo(item)"
                    >
                      <span
                        v-if="!current"
                        class="flex items-center justify-center size-10 shrink-0 rounded-xl bg-primary/10 text-primary"
                      >
                        <Icon
                          :name="item.icon || 'i-lucide-folder'"
                          class="size-5"
                        />
                      </span>
                      <span class="flex-1 min-w-0 text-left">
                        <span class="block font-semibold text-gray-900 leading-snug">{{ item.title }}</span>
                        <span
                          v-if="!current"
                          class="block text-xs text-gray-500 truncate mt-0.5"
                        >{{ childrenPreview(item) }}</span>
                      </span>
                      <Icon
                        name="i-lucide-chevron-right"
                        class="size-5 shrink-0 text-gray-400"
                      />
                    </button>

                    <!-- Конечная ссылка -->
                    <NuxtLink
                      v-else
                      :to="item.to"
                      :target="item.target || (isExternal(item.to) ? '_blank' : undefined)"
                      class="menu-row"
                      :class="{ 'menu-row--active': isActive(item) }"
                      @click="close"
                    >
                      <Icon
                        v-if="item.icon"
                        :name="item.icon"
                        class="size-5 shrink-0 text-gray-400"
                      />
                      <span class="flex-1 min-w-0 text-gray-800 leading-snug">{{ item.title }}</span>
                      <Icon
                        v-if="isExternal(item.to)"
                        name="i-lucide-arrow-up-right"
                        class="size-4 shrink-0 text-gray-400"
                      />
                    </NuxtLink>
                  </li>
                </ul>
              </nav>
            </Transition>
          </div>

          <!-- Контакты -->
          <div class="drawer-footer shrink-0 px-4 pt-3 border-t border-gray-100 bg-neutral-50">
            <p class="flex items-center gap-2 mb-2.5 text-xs text-gray-500">
              <span
                class="size-2 rounded-full"
                :class="status ? (status.isOpen ? 'bg-emerald-500' : 'bg-amber-400') : 'bg-gray-300'"
                aria-hidden="true"
              />
              {{ status?.text ?? LIBRARY_INFO.address.streetAddress }}
            </p>
            <div class="flex items-center gap-2">
              <a
                :href="`tel:${phoneHref}`"
                class="flex flex-1 items-center justify-center gap-2 min-h-11 px-3 rounded-xl bg-primary text-white text-sm font-semibold active:opacity-90"
              >
                <Icon
                  name="ic:outline-phone"
                  class="size-4 shrink-0"
                />
                <span class="whitespace-nowrap">Позвонить</span>
              </a>
              <a
                :href="`mailto:${LIBRARY_INFO.email}`"
                class="flex items-center justify-center size-11 shrink-0 rounded-xl bg-white border border-gray-200 text-gray-700 active:bg-neutral-100"
                aria-label="Написать на почту"
              >
                <Icon
                  name="material-symbols:mail-outline"
                  class="size-5"
                />
              </a>
              <a
                v-for="link in socialLinks"
                :key="link.label"
                :href="link.link"
                target="_blank"
                rel="noopener"
                class="flex items-center justify-center size-11 shrink-0 rounded-xl bg-white border border-gray-200 text-gray-700 active:bg-neutral-100"
                :aria-label="link.label"
              >
                <Icon
                  :name="link.icon"
                  class="size-5"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '~~/services/api/main-navigation.api';
import type { LibraryStatus } from '~/utils/librarySchedule';

interface MenuLink {
  icon: string;
  label: string;
  link: string;
}

const props = withDefaults(
  defineProps<{
    items: NavigationMenuItem[] | null | undefined;
    quickLinks?: MenuLink[];
    socialLinks?: MenuLink[];
  }>(),
  {
    quickLinks: () => [],
    socialLinks: () => [],
  },
);

const open = defineModel<boolean>({ required: true });

const route = useRoute();
const phoneHref = LIBRARY_INFO.telephone.replace(/[^\d+]/g, '');

/** Цепочка открытых разделов: [] — первый уровень */
const path = ref<NavigationMenuItem[]>([]);
const direction = ref<'forward' | 'back'>('forward');
const closeButton = ref<HTMLButtonElement | null>(null);
const status = ref<LibraryStatus | null>(null);

const current = computed(() => path.value.at(-1));
const currentItems = computed(
  () => (current.value ? current.value.children : props.items) ?? [],
);
const levelKey = computed(
  () => path.value.map(item => item.id).join('/') || 'root',
);
const backLabel = computed(() => path.value.at(-2)?.title ?? 'Главное меню');

const close = () => {
  open.value = false;
};

const goTo = (item: NavigationMenuItem) => {
  direction.value = 'forward';
  path.value = [...path.value, item];
};

const goBack = () => {
  direction.value = 'back';
  path.value = path.value.slice(0, -1);
};

const hasChildren = (item: NavigationMenuItem) =>
  !!item.children?.some(child => child.type !== 'separator');

const isExternal = (to?: string) => !!to && /^https?:\/\//.test(to);

const isActive = (item: NavigationMenuItem) =>
  !!item.to && !isExternal(item.to) && item.to === route.path;

const isInActiveBranch = (item: NavigationMenuItem): boolean =>
  isActive(item) || !!item.children?.some(isInActiveBranch);

const childrenPreview = (item: NavigationMenuItem) =>
  (item.children ?? [])
    .filter(child => child.type !== 'separator')
    .map(child => child.title)
    .join(', ');

// Свайп вправо: на вложенном уровне — назад, на первом — закрыть меню
let touchStartX = 0;
let touchStartY = 0;

const onTouchStart = (event: TouchEvent) => {
  touchStartX = event.touches[0]?.clientX ?? 0;
  touchStartY = event.touches[0]?.clientY ?? 0;
};

const onTouchEnd = (event: TouchEvent) => {
  const touch = event.changedTouches[0];
  if (!touch) return;
  const dx = touch.clientX - touchStartX;
  const dy = Math.abs(touch.clientY - touchStartY);
  if (dx < 70 || dy > dx * 0.6) return;
  if (path.value.length) goBack();
  else close();
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') close();
};

watch(open, async (isOpen) => {
  if (!import.meta.client) return;
  // Блокируем прокрутку страницы под меню (html — чтобы работало и в iOS Safari)
  document.documentElement.style.overflow = isOpen ? 'hidden' : '';
  if (isOpen) {
    status.value = getLibraryStatus();
    window.addEventListener('keydown', onKeydown);
    await nextTick();
    closeButton.value?.focus({ preventScroll: true });
  }
  else {
    window.removeEventListener('keydown', onKeydown);
  }
});

// Переход на другую страницу закрывает меню
watch(() => route.fullPath, close);

onBeforeUnmount(() => {
  if (!import.meta.client) return;
  document.documentElement.style.overflow = '';
  window.removeEventListener('keydown', onKeydown);
});
</script>

<style scoped>
.menu-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  min-height: 3.25rem;
  padding: 0.5rem 0.75rem;
  border-radius: 1rem;
  transition: background-color 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}

.menu-row:active {
  background-color: var(--color-neutral-100);
}

@media (hover: hover) {
  .menu-row:hover {
    background-color: var(--color-neutral-100);
  }
}

.menu-row--active {
  background-color: color-mix(in oklab, var(--ui-primary) 10%, transparent);
}

.menu-row--active span {
  color: var(--ui-primary);
}

.drawer-footer {
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
}

/* Открытие/закрытие шторки */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-enter-active .drawer-panel,
.drawer-leave-active .drawer-panel {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .drawer-panel,
.drawer-leave-to .drawer-panel {
  transform: translateX(100%);
}

/* Переходы между уровнями */
.forward-enter-active,
.forward-leave-active,
.back-enter-active,
.back-leave-active {
  transition:
    transform 0.28s cubic-bezier(0.32, 0.72, 0, 1),
    opacity 0.28s ease;
}

.forward-enter-from {
  transform: translateX(100%);
}

.forward-leave-to {
  transform: translateX(-25%);
  opacity: 0;
}

.back-enter-from {
  transform: translateX(-25%);
  opacity: 0;
}

.back-leave-to {
  transform: translateX(100%);
}

/* Выезжающий уровень всегда поверх уходящего */
.forward-enter-active,
.back-leave-active {
  z-index: 1;
}

@media (prefers-reduced-motion: reduce) {
  .drawer-enter-active,
  .drawer-leave-active,
  .drawer-enter-active .drawer-panel,
  .drawer-leave-active .drawer-panel,
  .forward-enter-active,
  .forward-leave-active,
  .back-enter-active,
  .back-leave-active {
    transition: none;
  }
}
</style>
