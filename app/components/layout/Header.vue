<template>
  <div class="bg-white">
    <header class="max-w-[1710px] mx-auto">
      <div class="w-full">
        <div class="flex items-center justify-between h-20 lg:h-24">
          <NuxtLink to="/" class="group flex-shrink-0">
            <div class="relative">
              <div
                class="relative w-44 fill-primary group-hover:fill-primary/80 transition-all duration-300"
              >
                <Logo class="w-full h-auto drop-shadow-sm" />
              </div>
            </div>
          </NuxtLink>

          <div class="hidden lg:flex items-center rounded-2xl p-1.5">
            <UPopover
              mode="hover"
              v-for="link in navigateLinks"
              :key="link.label"
            >
              <UButton
                :to="link.link"
                variant="ghost"
                class="relative flex flex-col items-center justify-center p-4 gap-1.5 rounded-xl transition-all duration-300 group overflow-hidden"
              >
                <div class="relative">
                  <div
                    class="relative w-10 h-10 bg-gradient-to-br from-gray-50 to-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow group-hover:scale-110 transition-all duration-300"
                  >
                    <Icon
                      :name="link.icon"
                      class="w-5 h-5 transition-all duration-300 group-hover:scale-110"
                    />
                  </div>
                </div>
              </UButton>
              <template #content>
                <div class="text-sm p-1">{{ link.label }}</div>
              </template>
            </UPopover>
          </div>

          <div class="flex items-center gap-4">
            <div class="hidden md:flex items-center gap-3">
              <NuxtLink
                to="tel:+73832101053"
                class="group flex items-center gap-2.5 px-4 py-2.5 rounded-2xl hover:from-primary/10 transition-all duration-300"
              >
                <div class="relative">
                  <div
                    class="relative w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300"
                  >
                    <Icon name="ic:outline-phone" class="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Позвоните нам</p>
                  <p
                    class="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors whitespace-nowrap"
                  >
                    +7 (383) 210-10-53
                  </p>
                </div>
              </NuxtLink>

              <NuxtLink
                to="mailto:noub@nso.ru"
                class="group flex items-center gap-2.5 px-4 py-2.5 rounded-2xl hover:from-gray-200 transition-all duration-300"
              >
                <div class="relative">
                  <div
                    class="relative w-9 h-9 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300"
                  >
                    <Icon
                      name="material-symbols:mail-outline"
                      class="w-5 h-5 text-white"
                    />
                  </div>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Напишите нам</p>
                  <p
                    class="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors whitespace-nowrap"
                  >
                    noub@nso.ru
                  </p>
                </div>
              </NuxtLink>
            </div>

            <div class="hidden lg:flex items-center gap-1.5">
              <div class="w-px h-8 bg-gray-200 mx-1"></div>
              <a
                v-for="link in socialLinks"
                :key="link.label"
                :href="link.link"
                target="_blank"
                class="relative w-10 h-10 bg-gray-100 hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 rounded-xl flex items-center justify-center transition-all duration-300 group shadow-sm hover:shadow-lg"
              >
                <Icon
                  :name="link.icon"
                  class="w-5 h-5 text-gray-600 group-hover:text-white transition-all relative z-10"
                />
              </a>
            </div>

            <div class="hidden 2xl:flex items-center gap-1.5">
              <div class="w-px h-8 bg-gray-200 mx-1"></div>

              <UPopover mode="hover" :popper="{ placement: 'bottom' }">
                <UButton
                  variant="ghost"
                  class="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
                >
                  <div
                    class="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors"
                  >
                    <Icon
                      name="mingcute:time-line"
                      class="w-5 h-5 text-gray-600 group-hover:text-primary"
                    />
                  </div>
                  <div class="text-left">
                    <p class="text-xs text-gray-500">Режим работы</p>
                    <p
                      class="text-sm font-bold text-gray-900 whitespace-nowrap"
                    >
                      10:00 – 20:00
                    </p>
                  </div>
                  <Icon
                    name="i-heroicons-chevron-down-16-solid"
                    class="w-4 h-4 text-gray-400 group-hover:text-primary"
                  />
                </UButton>

                <template #content>
                  <div
                    class="w-64 p-4 bg-white rounded-xl shadow-xl border border-gray-100"
                  >
                    <div class="flex items-center gap-3 mb-3">
                      <div
                        class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center"
                      >
                        <Icon
                          name="mingcute:time-line"
                          class="w-5 h-5 text-primary"
                        />
                      </div>
                      <h4 class="font-bold text-gray-900">Часы работы</h4>
                    </div>
                    <div class="space-y-2">
                      <div
                        class="flex items-center justify-between py-2 border-b border-gray-100"
                      >
                        <span class="text-gray-600">Вторник - Пятница</span>
                        <span class="font-semibold text-gray-900"
                          >10:00 – 20:00</span
                        >
                      </div>
                      <div
                        class="flex items-center justify-between py-2 border-b border-gray-100"
                      >
                        <span class="text-gray-600">Суббота - Воскресенье</span>
                        <span class="font-semibold text-gray-900"
                          >10:00 – 19:00</span
                        >
                      </div>
                      <div class="flex items-center justify-between py-2">
                        <span class="text-gray-600">Понедельник</span>
                        <span class="font-semibold text-red-300">Выходной</span>
                      </div>
                    </div>
                    <div class="mt-3 pt-3 border-t border-gray-100">
                      <p class="text-xs text-gray-500">
                        Последняя пятница месяца — санитарный день
                      </p>
                    </div>
                  </div>
                </template>
              </UPopover>

              <!-- Адрес -->
              <UPopover mode="hover" :popper="{ placement: 'bottom' }">
                <UButton
                  variant="ghost"
                  class="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
                >
                  <div
                    class="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors"
                  >
                    <Icon
                      name="material-symbols:map-outline"
                      class="w-5 h-5 text-gray-600 group-hover:text-primary"
                    />
                  </div>
                  <div class="text-left">
                    <p class="text-xs text-gray-500">Наш адрес</p>
                    <p
                      class="text-sm font-bold text-gray-900 whitespace-nowrap"
                    >
                      Красный пр., 26
                    </p>
                  </div>
                  <Icon
                    name="i-heroicons-chevron-down-16-solid"
                    class="w-4 h-4 text-gray-400 group-hover:text-primary"
                  />
                </UButton>

                <template #content>
                  <div class="p-4 rounded-2xl">
                    <header class="flex gap-2 items-center mb-4">
                      <div
                        class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center"
                      >
                        <Icon
                          name="material-symbols:map-outline"
                          class="w-5 h-5 text-primary"
                        />
                      </div>

                      <h4 class="my-0!">Как нас найти</h4>
                    </header>
                    <LibraryOnMap />
                  </div>
                </template>
              </UPopover>
            </div>

            <!-- Мобильная кнопка меню -->
            <div class="lg:hidden px-5">
              <UDropdownMenu
                :content="{
                  align: 'end',
                  side: 'bottom',
                  sideOffset: 8,
                }"
                :ui="{
                  content: 'w-48',
                }"
                label-key="title"
                :items="items"
              >
                <UButton
                  icon="i-lucide-menu"
                  color="neutral"
                  variant="outline"
                />
              </UDropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
    <MainNavigation class="hidden lg:block" />
  </div>
</template>

<script setup lang="ts">
import LibraryOnMap from '~/components/modals/LibraryOnMap.vue';
import { useNavigationApi } from '~~/services/api/main-navigation.api';

const mobileMenuOpen = ref(false);

const navigationApi = useNavigationApi();

const items = await navigationApi.getAllNavigation();

const navigateLinks = [
  {
    icon: 'i-heroicons-magnifying-glass',
    label: 'Поиск',
    link: '/post',
  },
  {
    icon: 'mynaui:wheelchair-solid',
    label: 'Доступная среда',
    link: '/post/dostupnaya-sreda-03-32-22-10-22',
  },
  {
    icon: 'i-heroicons-academic-cap',
    label:
      'Сведения об организации, осуществляющей образовательную деятельность',
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
</script>

<style scoped></style>
