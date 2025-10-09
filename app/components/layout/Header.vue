<template>
  <header class="flex justify-between items-center mt-4">
    <NuxtLink to="/" class="text-primary text-5xl font-bold">НОМБ</NuxtLink>

    <div class="flex gap-10">
      <UiHeaderPop
        icon="i-heroicons-map-pin"
        label="г. Новосибирск, Красный проспект, 26"
        size="5xl"
        :modal="ModalsLibraryOnMap"
      />
      <UiHeaderPop
        icon="i-heroicons-clock"
        label="ВТ-ПТ — 10.00-20.00 СБ-ВС — 10.00-19.00 ПН — выходной день"
        size="5xl"
        :modal="ModalsWorktimeLibrary"
      />
      <div class="flex flex-col justify-between">
        <UiHeaderPop
          icon="i-heroicons-phone"
          label="+7 (383) 210-10-53"
          size="2xl"
          :isPopover="false"
        />
        <UiHeaderPop
          icon="i-heroicons-outline-mail"
          label="noub@nso.ru"
          size="2xl"
          :isPopover="false"
        />
      </div>
    </div>

    <div class="flex flex-row gap-2">
      <UButton
        v-for="(link, index) in socialLinks"
        :key="index"
        class="text-4xl"
        :to="link.link"
        variant="soft"
      >
        <Icon v-if="link.icon" :name="link.icon" />
        <img class="h-9 w-9" v-else :src="link.src" alt="" />
      </UButton>
    </div>

    <div class="flex gap-2">
      <UPopover
        v-for="(link, index) in navigateLinks"
        :key="index"
        mode="hover"
      >
        <UButton class="text-4xl" :to="link.link" variant="soft">
          <Icon :name="link.icon" />
        </UButton>

        <template #content>
          <div class="py-1 px-2 text-sm">{{ link.popover }}</div>
        </template>
      </UPopover>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ModalsLibraryOnMap, ModalsWorktimeLibrary } from '#components';

const navigateLinks = [
  {
    icon: 'i-heroicons-academic-cap',
    popover:
      'Сведения об организации, осуществляющей образовательную деятельность',
    link: '/',
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
    link: '/',
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

<style scoped></style>
