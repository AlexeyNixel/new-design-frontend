<template>
  <header
    class="grid grid-cols-[200px_minmax(300px,_900px)_200px_300px] items-center my-2 mx-10"
  >
    <div class="text-5xl font-bold">НОМБ</div>

    <div class="grid grid-cols-3">
      <div class="flex items-center justify-center gap-2">
        <Icon class="text-5xl" name="i-heroicons-map-pin" />
        <span>г. Новосибирск, Красный проспект, 26 </span>
      </div>

      <div class="flex items-center justify-center gap-2">
        <Icon class="text-5xl" name="i-heroicons-outline-clock" />
        <span>
          ПН-СБ — 10.00-19.00 <br />
          ВС — выходной день
        </span>
      </div>

      <div class="flex flex-col items-center justify-center gap-4">
        <div class="flex items-center gap-2">
          <Icon class="text-2xl" name="i-heroicons-phone" />
          <span>+7 (383) 210-10-53</span>
        </div>
        <div class="flex items-center gap-2">
          <Icon class="text-2xl" name="i-heroicons-outline-mail" />
          <span>+7 (383) 210-10-53</span>
        </div>
      </div>
    </div>

    <div class="flex justify-center items-center">
      <NuxtLink to="/"><Icon class="text-5xl" name="i-ri-vk-fill" /></NuxtLink>
      <NuxtLink to="/">
        <Icon class="text-5xl" name="i-arcticons-yandex-pro-taximeter" />
      </NuxtLink>
    </div>

    <nav class="flex gap-2 items-center justify-center">
      <UPopover mode="hover" v-for="btn in navigationButtons" :key="btn.icon">
        <NuxtLink :to="btn.link" class="hover:text-blue-400 transition">
          <Icon class="text-5xl" :name="btn.icon" />
        </NuxtLink>

        <template #content>
          <span class="p-2 text-wrap wrap-normal">{{ btn.label }}</span>
        </template>
      </UPopover>
    </nav>
  </header>
</template>

<script setup lang="ts">
const navigationButtons = [
  {
    label:
      'Сведения об организации, осуществляющей образовательную деятельность',
    icon: 'i-heroicons-academic-cap',
    link: '/',
  },
  {
    label: 'Доступная среда',
    icon: 'i-mynaui-wheelchair-solid',
    link: '/',
  },
  {
    label: 'Версия для слабовидящих',
    icon: 'i-heroicons-eye',
    link: '/',
  },
  {
    label: 'Поиск',
    icon: 'i-heroicons-magnifying-glass',
    link: '/',
  },
];
</script>

<style scoped></style>
