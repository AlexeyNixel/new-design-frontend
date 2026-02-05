<template>
  <header class="my-4 md:flex items-center justify-center md:justify-between">
    <div
      class="border-b border-b-neutral-200 md:border-0 pb-3 flex flex-col items-center justify-center"
    >
      <NuxtLink class="" to="/">
        <div class="fill-primary text-center">
          <Logo class="w-40 h-max" />
        </div>
      </NuxtLink>

      <div class="flex self-start md:hidden gap-4 mt-4 md:mt-0">
        <UButton
          v-for="link in navigateLinks"
          :icon="link.icon"
          :to="link.link"
          variant="soft"
          size="xl"
        />
      </div>
    </div>

    <div class="mt-4 md:mt-0 flex flex-row gap-4">
      <CustomPopover
        label="Режим работы"
        icon="mingcute:time-line"
        mode="hover"
        side="bottom"
      >
        <WorktimeLibrary />
      </CustomPopover>
      <CustomPopover
        label="Красный проспект, 26"
        icon="material-symbols:map-outline"
        mode="hover"
        side="bottom"
      >
        <LibraryOnMap />
      </CustomPopover>
    </div>
    <div class="flex md:flex-col gap-4">
      <div class="text-sm md:text-md flex items-center gap-2">
        <Icon name="ic:outline-phone" />
        <span>+7 (383) 210-10-53</span>
      </div>
      <div class="text-sm md:text-md flex items-center gap-2">
        <Icon name="material-symbols:mail-outline" />
        <span>noub@nso.ru</span>
      </div>
    </div>
    <div class="hidden md:flex gap-4">
      <UButton
        v-for="link in socialLinks"
        :icon="link.icon"
        :to="link.link"
        variant="soft"
        size="xl"
      />
    </div>
    <div class="hidden md:flex gap-4 mt-4 md:mt-0">
      <UButton
        v-for="link in navigateLinks"
        :icon="link.icon"
        :to="link.link"
        variant="soft"
        size="xl"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import CustomPopover from '~/components/ui/CustomPopover.vue';
import WorktimeLibrary from '~/components/modals/WorktimeLibrary.vue';
import LibraryOnMap from '~/components/modals/LibraryOnMap.vue';

const emit = defineEmits(['openModal']);

const navigateLinks = [
  {
    icon: 'i-heroicons-outline-search',
    label: 'Поиск по сайту',
    link: '/entry',
  },
  {
    icon: 'i-mynaui-wheelchair-solid',
    label: 'Доступная среда',
    link: '/entry/dostupnaya-sreda-03-32-22-10-22',
  },
  {
    icon: 'i-heroicons-academic-cap',
    label: 'Сведения об организации',
    link: '/information',
  },
  {
    icon: 'i-heroicons-eye',
    label: 'Версия для слабовидящих',
    link: '/',
  },
];

const socialLinks = [
  {
    icon: 'i-bxl-vk',
    link: 'https://vk.com/oub_nsk',
    label: 'Вконтакте',
  },
  {
    icon: 'i-ix-telegram-logo',
    link: 'https://t.me/oub_nsk',
    label: 'Телеграм',
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
