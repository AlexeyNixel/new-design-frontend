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

    <div>
      <UButton
        color="none"
        class="text-4xl"
        @click="
          navigateTo('https://vk.com/oub_nsk', { open: { target: '_blank' } })
        "
      >
        <Icon name="i-simple-icons-vk"></Icon>
      </UButton>
      <UButton color="none" class="text-4xl">
        <Icon name="i-simple-icons-vk"></Icon>
      </UButton>
    </div>

    <div class="flex gap-2">
      <UButton variant="soft" class="text-4xl">
        <Icon name="i-heroicons-academic-cap"></Icon>
      </UButton>
      <UButton variant="soft" class="text-4xl">
        <Icon name="i-mynaui-wheelchair-solid"></Icon>
      </UButton>
      <UButton variant="soft" class="text-4xl">
        <Icon name="i-heroicons-eye"></Icon>
      </UButton>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ModalsLibraryOnMap, ModalsWorktimeLibrary } from '#components';
</script>

<style scoped></style>
