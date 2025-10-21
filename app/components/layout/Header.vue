<template>
  <header
    class="flex flex-col lg:flex-row justify-between items-start lg:items-center mt-4 gap-4 lg:gap-0 px-4 lg:px-0"
  >
    <!-- Логотип -->
    <UButton
      variant="link"
      color="primary"
      to="/"
      class="text-primary text-3xl lg:text-5xl font-bold w-full lg:w-auto text-center lg:text-left transition fill-primary hover:opacity-75"
    >
      <Logo class="w-48 h-max" />
    </UButton>

    <!-- Контактная информация -->
    <div
      class="flex flex-col lg:flex-row gap-4 lg:gap-10 w-full lg:w-auto order-3 lg:order-2"
    >
      <!-- Адрес и время работы - вертикально на мобильных -->
      <div class="hidden flex-col lg:flex lg:flex-row gap-4 lg:gap-10">
        <UiHeaderPop
          icon="i-heroicons-map-pin"
          label="г. Новосибирск, Красный проспект, 26"
          size="2xl lg:5xl"
          :modal="ModalsLibraryOnMap"
          class="flex-1"
        />
        <UiHeaderPop
          icon="i-heroicons-clock"
          label=""
          size="2xl lg:5xl"
          :modal="ModalsWorktimeLibrary"
          class="flex-1"
        >
          <div class="leading-[18px]">
            ВТ-ПТ — 10.00-20.00 <br />
            СБ-ВС — 10.00-19.00 <br />
            ПН — выходной день
          </div>
        </UiHeaderPop>
      </div>

      <!-- Телефон и email -->
      <div class="hidden lg:flex flex-col justify-between gap-2">
        <UiHeaderPop
          icon="i-heroicons-phone"
          label="+7 (383) 210-10-53"
          size="xl lg:2xl"
          :isPopover="false"
        />
        <UiHeaderPop
          icon="i-heroicons-outline-mail"
          label="noub@nso.ru"
          size="xl lg:2xl"
          :isPopover="false"
        />
      </div>
    </div>

    <!-- Социальные сети и навигация -->
    <div
      class="flex lg:gap-20 justify-between w-full lg:w-auto order-2 lg:order-3"
    >
      <!-- Социальные сети -->
      <div class="flex flex-row gap-2">
        <UButton
          v-for="(link, index) in socialLinks"
          :key="index"
          class="text-4xl lg:text-5xl"
          :to="link.link"
          variant="soft"
          size="sm lg:md"
        >
          <Icon v-if="link.icon" :name="link.icon" />
          <img class="h-6 w-6 lg:h-9 lg:w-9" v-else :src="link.src" alt="" />
        </UButton>
      </div>

      <!-- Навигационные иконки -->
      <div class="flex gap-2">
        <UPopover
          v-for="(link, index) in navigateLinks"
          :key="index"
          mode="hover"
        >
          <UButton
            class="text-4xl lg:text-5xl"
            :to="link.link"
            variant="soft"
            size="sm lg:md"
          >
            <Icon :name="link.icon" />
          </UButton>

          <template #content>
            <div
              class="py-1 px-2 text-xs lg:text-sm max-w-[200px] lg:max-w-none"
            >
              {{ link.popover }}
            </div>
          </template>
        </UPopover>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ModalsLibraryOnMap, ModalsWorktimeLibrary } from '#components';

const navigateLinks = [
  {
    icon: 'i-heroicons-academic-cap',
    popover: 'Сведения об организации',
    link: '/information',
  },
  {
    icon: 'i-mynaui-wheelchair-solid',
    popover: 'Доступная среда',
    link: '/',
  },
  {
    icon: 'i-heroicons-eye',
    popover: 'Версия для слабовидящих',
    link: '/',
  },
  {
    icon: 'i-heroicons-outline-search',
    popover: 'Поиск по сайту',
    link: '/entry',
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
</script>
