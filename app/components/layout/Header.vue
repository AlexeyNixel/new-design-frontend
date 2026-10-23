<template>
  <div class="bg-white">
    <header
      class="site-header max-w-[1710px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3 lg:gap-5 h-16 sm:h-20"
    >
      <NuxtLink
        to="/"
        class="shrink-0 w-24 sm:w-28 lg:w-32 rounded-lg transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-700"
        aria-label="НОМБ — на главную"
      >
        <Logo class="block w-full h-auto" />
      </NuxtLink>

      <!-- Поиск — главное действие шапки, поэтому это сразу поле ввода с подсказками.
           Enter ведёт на страницу результатов. -->
      <LayoutHeaderSearch
        class="hidden md:block flex-1 max-w-md"
        hotkey
      />

      <div class="ml-auto flex items-center gap-1 sm:gap-2">
        <!-- Режим работы: короткий статус в шапке, полное расписание — в панели -->
        <UPopover
          v-model:open="worktimeOpen"
          :content="popoverContent"
          :ui="popoverUi"
        >
          <button
            type="button"
            class="info-chip hidden sm:flex"
            :class="{ 'info-chip--open': worktimeOpen }"
            aria-label="Режим работы библиотеки"
          >
            <span class="info-chip__icon">
              <UIcon
                name="i-heroicons-clock"
                class="size-5"
              />
              <span
                class="absolute -top-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-white"
                :class="status ? (status.isOpen ? 'bg-emerald-500' : 'bg-amber-400') : 'bg-gray-300'"
                aria-hidden="true"
              />
            </span>
            <span class="text-left leading-tight">
              <span class="block text-xs text-gray-500">Режим работы</span>
              <span class="block text-sm font-bold text-gray-900 whitespace-nowrap">
                {{ statusShort }}
              </span>
            </span>
            <UIcon
              name="i-heroicons-chevron-down-20-solid"
              class="size-4 text-gray-400 transition-transform"
              :class="{ 'rotate-180': worktimeOpen }"
            />
          </button>

          <template #content>
            <WorktimeLibrary
              :status="status"
              @navigate="worktimeOpen = false"
            />
          </template>
        </UPopover>

        <!-- Адрес и карта -->
        <UPopover
          v-model:open="mapOpen"
          :content="popoverContent"
          :ui="popoverUi"
        >
          <button
            type="button"
            class="info-chip hidden xl:flex"
            :class="{ 'info-chip--open': mapOpen }"
            aria-label="Как нас найти"
          >
            <span class="info-chip__icon">
              <UIcon
                name="i-heroicons-map-pin"
                class="size-5"
              />
            </span>
            <span class="text-left leading-tight">
              <span class="block text-xs text-gray-500">Как нас найти</span>
              <span class="block text-sm font-bold text-gray-900 whitespace-nowrap">
                {{ LIBRARY_INFO.address.streetAddress }}
              </span>
            </span>
            <UIcon
              name="i-heroicons-chevron-down-20-solid"
              class="size-4 text-gray-400 transition-transform"
              :class="{ 'rotate-180': mapOpen }"
            />
          </button>

          <template #content>
            <LibraryOnMap @navigate="mapOpen = false" />
          </template>
        </UPopover>

        <a
          :href="`tel:${PHONE_HREF}`"
          class="info-chip hidden 2xl:flex"
        >
          <span class="info-chip__icon">
            <UIcon
              name="i-heroicons-phone"
              class="size-5"
            />
          </span>
          <span class="text-left leading-tight">
            <span class="block text-xs text-gray-500">Позвоните нам</span>
            <span class="block text-sm font-bold text-gray-900 whitespace-nowrap">
              {{ LIBRARY_INFO.telephone }}
            </span>
          </span>
        </a>

        <!-- Служебные ссылки и соцсети: компактные иконки с подписью во всплывающей подсказке -->
        <div class="hidden lg:flex items-center gap-1 pl-2 ml-1 border-l border-gray-200">
          <component
            :is="link.action ? 'button' : NuxtLink"
            v-for="link in utilityLinks"
            :key="link.label"
            :to="link.action ? undefined : link.link"
            :type="link.action ? 'button' : undefined"
            :title="link.label"
            :aria-label="link.label"
            class="icon-btn flex"
            @click="link.action?.()"
          >
            <UIcon
              :name="link.icon"
              class="size-5"
            />
          </component>
          <a
            v-for="link in socialLinks"
            :key="link.label"
            :href="link.link"
            target="_blank"
            rel="noopener"
            :title="link.label"
            :aria-label="link.label"
            class="icon-btn hidden xl:flex"
          >
            <UIcon
              v-if="link.icon"
              :name="link.icon"
              class="size-5"
            />
            <img
              v-else
              class="size-5 brightness-0 opacity-60"
              src="/max-dark.svg"
              alt=""
            >
          </a>
        </div>

        <!-- Переход в админку (виден при наличии токена) -->
        <UButton
          v-if="hasSession"
          icon="i-heroicons-cog-6-tooth"
          variant="ghost"
          class="rounded-xl"
          @click="goToAdmin()"
        >
          <span class="hidden sm:inline">В админку</span>
        </UButton>

        <button
          type="button"
          class="icon-btn flex md:hidden"
          :class="{ 'bg-[#eef5f6] text-primary-800': mobileSearchOpen }"
          :aria-label="mobileSearchOpen ? 'Закрыть поиск' : 'Поиск по сайту'"
          :aria-expanded="mobileSearchOpen"
          @click="mobileSearchOpen = !mobileSearchOpen"
        >
          <UIcon
            :name="mobileSearchOpen ? 'i-heroicons-x-mark' : 'i-heroicons-magnifying-glass'"
            class="size-5"
          />
        </button>

        <!-- Мобильная кнопка меню: видна, пока нет горизонтальной навигации (до xl) -->
        <UButton
          icon="i-lucide-menu"
          color="neutral"
          variant="outline"
          size="lg"
          class="xl:hidden rounded-xl"
          aria-label="Открыть меню"
          :aria-expanded="mobileMenuOpen"
          data-menu-toggle
          @click="openMenu"
        />
      </div>
    </header>
    <!-- Мобильная панель поиска: раскрывается под шапкой на всю ширину -->
    <div
      v-if="mobileSearchOpen"
      class="md:hidden px-4 sm:px-6 pb-3"
    >
      <LayoutHeaderSearch
        autofocus
        @done="mobileSearchOpen = false"
      />
    </div>
    <MainNavigation class="hidden xl:block" />
    <MobileMenu
      v-model="mobileMenuOpen"
      :items="items"
      :quick-links="navigateLinks"
      :social-links="socialLinks"
    />
  </div>
</template>

<script setup lang="ts">
import LibraryOnMap from '~/components/modals/LibraryOnMap.vue';
import WorktimeLibrary from '~/components/modals/WorktimeLibrary.vue';
import type { LibraryStatus } from '~/utils/librarySchedule';
import { useNavigationApi } from '~~/services/api/main-navigation.api';

const navigationApi = useNavigationApi();

const items = await navigationApi.getAllNavigation();

const { hasSession, goToAdmin } = useAuth();

const mobileMenuOpen = ref(false);
const mobileSearchOpen = ref(false);
const worktimeOpen = ref(false);
const mapOpen = ref(false);

const PHONE_HREF = LIBRARY_INFO.telephone.replace(/[^\d+]/g, '');

const popoverContent = { align: 'end', sideOffset: 10, collisionPadding: 12 } as const;
const popoverUi = {
  content:
    'rounded-2xl ring-0 shadow-[0_24px_48px_-12px_rgb(13_73_84/0.35)] overflow-hidden',
};

const openMenu = () => {
  mobileMenuOpen.value = true;
};

// Кнопка меню видна раньше, чем Vue успевает её «оживить» (на телефоне — несколько секунд).
// Запоминаем тап до гидратации и открываем меню, как только компонент смонтирован.
useHead({
  script: [
    {
      key: 'menu-early-tap',
      innerHTML:
        'document.addEventListener("click",function(e){if(e.target.closest&&e.target.closest("[data-menu-toggle]"))window.__menuRequested=true},true);',
    },
  ],
});

// Статус зависит от текущего времени — считаем только в браузере,
// иначе серверный и клиентский рендер разойдутся
const status = ref<LibraryStatus | null>(null);
let statusTimer: ReturnType<typeof setInterval> | undefined;

/** Полная фраза («Закрыто, откроемся во вторник в 10:00») не помещается в шапку — она в панели */
const statusShort = computed(() => {
  if (!status.value) return 'Часы работы';
  if (status.value.isOpen) return status.value.text;
  return status.value.isTechnicalToday ? 'Технический день' : 'Сейчас закрыто';
});

onMounted(() => {
  const win = window as Window & { __menuRequested?: boolean };
  if (win.__menuRequested) openMenu();
  win.__menuRequested = false;

  status.value = getLibraryStatus();
  statusTimer = setInterval(() => {
    status.value = getLibraryStatus();
  }, 60_000);
});

onBeforeUnmount(() => clearInterval(statusTimer));

const NuxtLink = resolveComponent('NuxtLink');
const a11y = useAccessibility();

/** Быстрые ссылки мобильного меню; пункт с action — кнопка, а не ссылка */
const navigateLinks = computed<{ icon: string; label: string; link?: string; action?: () => void }[]>(() => [
  {
    icon: 'i-heroicons-magnifying-glass',
    label: 'Поиск по сайту',
    link: '/post',
  },
  {
    icon: 'mynaui:wheelchair-solid',
    label: 'Доступная среда',
    link: '/page/dostupnaya-sreda',
  },
  {
    icon: 'i-heroicons-academic-cap',
    label: 'Об организации',
    link: '/information',
  },
  {
    icon: a11y.settings.value.enabled ? 'i-heroicons-eye-slash' : 'i-heroicons-eye',
    label: a11y.settings.value.enabled ? 'Обычная версия сайта' : 'Версия для слабовидящих',
    action: a11y.toggle,
  },
]);

// На десктопе поиск вынесен в отдельное поле, остальное — иконками
const utilityLinks = computed(() => navigateLinks.value.slice(1));

const socialLinks = [
  {
    icon: 'i-bxl-vk',
    link: 'https://vk.com/oub_nsk',
    label: 'ВКонтакте',
  },
  {
    link: 'https://max.ru/id5406132173_gos',
    label: 'MAX',
  },
];
</script>

<style scoped>
/* Плашка «иконка + подпись + значение»: режим работы, адрес, телефон */
.info-chip {
  align-items: center;
  gap: 0.625rem;
  height: 3rem;
  padding: 0 0.625rem 0 0.375rem;
  border-radius: 0.75rem;
  transition: background-color 0.15s ease;
}

.info-chip:hover {
  background-color: var(--color-neutral-100);
}

.info-chip--open {
  background-color: #eef5f6;
}

.info-chip__icon {
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  background-color: #eef5f6;
  color: var(--color-primary-700);
}

.icon-btn {
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  color: var(--color-gray-600);
  transition: background-color 0.15s ease, color 0.15s ease;
}

.icon-btn:hover {
  background-color: #eef5f6;
  color: var(--color-primary-800);
}

.info-chip:focus-visible,
.icon-btn:focus-visible {
  outline: 2px solid var(--color-primary-700);
  outline-offset: 2px;
}
</style>
