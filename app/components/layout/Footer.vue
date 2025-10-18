<template>
  <footer class="bg-gray-900 text-white mt-auto">
    <div
      class="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <!-- Логотип и контакты -->
      <div class="space-y-4 lg:col-span-1">
        <div class="mb-6">
          <img src="/logo.png" alt="Логотип библиотеки" class="h-12 w-auto" />
        </div>
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <UIcon
              name="i-heroicons-phone"
              class="w-5 h-5 text-primary-400 flex-shrink-0"
            />
            <span class="text-gray-300 text-sm">+7 (383) 210-10-53</span>
          </div>
          <div class="flex items-center gap-3">
            <UIcon
              name="i-heroicons-map-pin"
              class="w-5 h-5 text-primary-400 flex-shrink-0"
            />
            <span class="text-gray-300 text-sm"
              >г. Новосибирск, Красный проспект, 26</span
            >
          </div>
          <div class="flex items-center gap-3">
            <UIcon
              name="i-heroicons-envelope"
              class="w-5 h-5 text-primary-400 flex-shrink-0"
            />
            <span class="text-gray-300 text-sm">noub@nso.ru</span>
          </div>
        </div>
      </div>

      <!-- Навигация -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-white mb-4">Навигация</h3>
        <nav class="space-y-2">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.label"
            :to="link.link"
            class="flex items-center gap-5 text-gray-300 hover:text-white transition-colors duration-200 text-sm py-1"
          >
            <Icon class="text-xl" :name="link.icon" />
            <span>{{ link.label }}</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- Напишите нам -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-white mb-4">Напишите нам</h3>
        <p class="text-gray-300 text-sm leading-relaxed mb-4">
          Есть вопросы или предложения? Мы всегда рады обратной связи от наших
          читателей и партнеров.
        </p>
        <UButton
          to="/"
          color="primary"
          variant="solid"
          class="w-full md:w-auto"
        >
          Написать сообщение
        </UButton>
      </div>
    </div>

    <!-- Копирайт -->
    <!--    <div class="flex justify-between border-t border-gray-800">-->
    <!--      <NuxtLink-->
    <!--        to="/document/antikorrupcionnaya-politika"-->
    <!--        class="max-w-7xl mx-auto px-4 py-6 text-center text-gray-400 text-sm"-->
    <!--      >-->
    <!--        Антикоррупционная политика-->
    <!--      </NuxtLink>-->
    <!--      <NuxtLink-->
    <!--        to="/document/politika-obrabotki-i-zashity-personalnyh-dannyh"-->
    <!--        class="max-w-7xl mx-auto px-4 py-6 text-center text-gray-400 text-sm"-->
    <!--      >-->
    <!--        Политика обработки и защиты персональных данных-->
    <!--      </NuxtLink>-->
    <!--      <div-->
    <!--        class="max-w-7xl mx-auto px-4 py-6 text-center text-gray-400 text-sm"-->
    <!--      >-->
    <!--        © {{ currentYear }} Новосибирская областная молодежная библиотека. Все-->
    <!--        права защищены.-->
    <!--      </div>-->
    <!--    </div>-->
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear();

const navLinks = [
  {
    label: 'О библиотеке',
    link: '/',
    icon: 'i-heroicons-building-library',
  },
  {
    label: 'Услуги',
    link: '/document/assortiment-uslug',
    icon: 'i-heroicons-wrench-screwdriver',
  },
  {
    label: 'Проекты',
    link: '/',
    icon: 'i-heroicons-light-bulb',
  },
  {
    label: 'Ресурсы',
    link: '/',
    icon: 'i-heroicons-book-open',
  },
  {
    label: 'Конкурсы',
    link: '/',
    icon: 'i-heroicons-trophy',
  },
  {
    label: 'Коллегам',
    link: '/',
    icon: 'i-heroicons-user-group',
  },
];
</script>
