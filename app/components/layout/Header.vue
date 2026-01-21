<template>
  <header class="px-4 xl:px-0 py-3">
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6"
    >
      <UButton
        variant="link"
        color="primary"
        to="/"
        class="md:w-auto self-center md:self-auto fill-primary"
        aria-label="На главную"
      >
        <Logo class="h-10 md:h-12 w-auto transition-opacity hover:opacity-80" />
      </UButton>

      <div class="hidden md:flex items-center gap-4 lg:gap-6 flex-1">
        <UiHeaderPop
          icon="i-heroicons-map-pin"
          label="г. Новосибирск, Красный проспект, 26"
          :modal="ModalsLibraryOnMap"
          size="sm"
          class="min-w-0"
        />

        <UiHeaderPop
          icon="i-heroicons-clock"
          label=""
          :modal="ModalsWorktimeLibrary"
          size="sm"
          class="min-w-0"
        >
          <div class="text-xs leading-tight whitespace-nowrap">
            ВТ-ПТ — 10.00-20.00<br />
            СБ-ВС — 10.00-19.00<br />
            ПН — выходной
          </div>
        </UiHeaderPop>

        <a
          href="tel:+73832101053"
          class="flex items-center gap-2 text-sm whitespace-nowrap hover:text-primary transition-colors"
        >
          <Icon name="i-heroicons-phone" class="w-4 h-4" />
          +7 (383) 210-10-53
        </a>

        <a
          href="mailto:noub@nso.ru"
          class="flex items-center gap-2 text-sm whitespace-nowrap hover:text-primary transition-colors"
        >
          <Icon name="i-heroicons-outline-mail" class="w-4 h-4" />
          noub@nso.ru
        </a>
      </div>

      <div class="flex items-center gap-2 lg:gap-3">
        <div class="flex gap-1">
          <UButton
            v-for="(link, index) in socialLinks"
            :key="index"
            :to="link.link"
            variant="ghost"
            size="xs"
            class="text-xl md:text-2xl p-1"
            target="_blank"
            :aria-label="`${link.icon.includes('vk') ? 'ВКонтакте' : 'Telegram'}`"
          >
            <Icon :name="link.icon" />
          </UButton>
        </div>

        <div class="flex items-center gap-1 md:gap-2">
          <div class="flex md:hidden items-center gap-1">
            <UButton
              v-for="(link, index) in navigateLinks.slice(0, 2)"
              :key="index"
              :to="link.link"
              variant="ghost"
              size="xs"
              class="text-xl p-1"
              :aria-label="link.popover"
            >
              <Icon :name="link.icon" />
            </UButton>

            <UDropdownMenu
              :items="mobileMenuItems"
              :popper="{ placement: 'bottom-end' }"
            >
              <UButton
                variant="ghost"
                size="xs"
                class="text-xl p-1"
                icon="i-heroicons-ellipsis-horizontal"
                aria-label="Ещё"
              />
            </UDropdownMenu>
          </div>

          <!-- Десктоп навигация (от 768px) -->
          <div class="hidden md:flex items-center gap-1">
            <UPopover
              v-for="(link, index) in navigateLinks"
              :key="index"
              mode="hover"
              :popper="{ placement: 'bottom' }"
            >
              <UButton
                :to="link.link"
                variant="ghost"
                size="xs"
                class="text-xl p-1.5"
                :aria-label="link.popover"
              >
                <Icon :name="link.icon" />
              </UButton>
              <template #content>
                <div
                  class="py-1 px-2 text-xs whitespace-nowrap bg-white shadow-lg rounded"
                >
                  {{ link.popover }}
                </div>
              </template>
            </UPopover>
          </div>
        </div>
      </div>
    </div>

    <!-- Мобильные контакты (только на мобильных) -->
    <div class="md:hidden mt-3 pt-3 border-t">
      <div class="grid grid-cols-2 gap-2">
        <UButton
          variant="ghost"
          size="xs"
          class="justify-start text-left text-xs h-auto py-1.5 px-2 bg-gray-50 rounded"
          @click="$emit('openModal', ModalsLibraryOnMap)"
        >
          <div class="flex items-center gap-1.5">
            <Icon
              name="i-heroicons-map-pin"
              class="w-3.5 h-3.5 text-gray-500"
            />
            <span class="truncate">Красный проспект, 26</span>
          </div>
        </UButton>

        <UButton
          variant="ghost"
          size="xs"
          class="justify-start text-left text-xs h-auto py-1.5 px-2 bg-gray-50 rounded"
          @click="$emit('openModal', ModalsWorktimeLibrary)"
        >
          <div class="flex items-center gap-1.5">
            <Icon name="i-heroicons-clock" class="w-3.5 h-3.5 text-gray-500" />
            <span>Режим работы</span>
          </div>
        </UButton>
      </div>

      <div class="flex justify-between items-center mt-2">
        <div class="flex gap-3">
          <a
            href="tel:+73832101053"
            class="flex items-center gap-1.5 text-xs hover:text-primary transition-colors"
          >
            <Icon name="i-heroicons-phone" class="w-3.5 h-3.5" />
            <span class="whitespace-nowrap">210-10-53</span>
          </a>
          <a
            href="mailto:noub@nso.ru"
            class="flex items-center gap-1.5 text-xs hover:text-primary transition-colors"
          >
            <Icon name="i-heroicons-outline-mail" class="w-3.5 h-3.5" />
            <span class="truncate">noub@nso.ru</span>
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ModalsLibraryOnMap, ModalsWorktimeLibrary } from '#components';

const emit = defineEmits(['openModal']);

const navigateLinks = [
  {
    icon: 'i-heroicons-outline-search',
    popover: 'Поиск по сайту',
    link: '/search',
  },
  {
    icon: 'i-mynaui-wheelchair-solid',
    popover: 'Доступная среда',
    link: '/accessibility',
  },
  {
    icon: 'i-heroicons-academic-cap',
    popover: 'Сведения об организации',
    link: '/information',
  },
  {
    icon: 'i-heroicons-eye',
    popover: 'Версия для слабовидящих',
    link: '/accessible-version',
  },
];

const socialLinks = [
  {
    icon: 'i-bxl-vk',
    link: 'https://vk.com/oub_nsk',
  },
  {
    icon: 'i-ix-telegram-logo',
    link: 'https://t.me/oub_nsk',
  },
];

const mobileMenuItems = [
  {
    label: 'Сведения об организации',
    icon: 'i-heroicons-academic-cap',
    to: '/information',
  },
  {
    label: 'Версия для слабовидящих',
    icon: 'i-heroicons-eye',
    to: '/accessible-version',
  },
];
</script>
