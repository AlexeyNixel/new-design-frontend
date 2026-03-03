<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div class="w-full px-4 sm:px-6 lg:px-8 py-4">
      <!-- Одна строка: логотип слева, всё остальное справа -->
      <div class="flex items-center justify-between">
        <!-- Логотип - фиксированная ширина w-40 -->
        <NuxtLink to="/" class="flex-shrink-0">
          <div
            class="w-40 text-primary hover:text-primary/80 transition-colors"
          >
            <Logo class="w-full h-auto" />
          </div>
        </NuxtLink>

        <!-- Правая группа - всё остальное содержимое -->
        <div class="flex items-center justify-end gap-3 flex-1">
          <!-- Выпадающие списки -->
          <div class="hidden xl:flex items-center gap-1">
            <!-- Режим работы -->
            <UPopover mode="hover" :popper="{ placement: 'bottom' }">
              <UButton
                variant="ghost"
                class="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors group"
                size="sm"
              >
                <div
                  class="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors"
                >
                  <Icon
                    name="mingcute:time-line"
                    class="w-4 h-4 text-gray-600 group-hover:text-primary"
                  />
                </div>
                <span
                  class="text-sm font-medium text-gray-900 whitespace-nowrap"
                  >10:00–20:00</span
                >
                <Icon
                  name="i-heroicons-chevron-down-16-solid"
                  class="w-4 h-4 text-gray-400"
                />
              </UButton>

              <template #content>
                <div class="w-56 p-3">
                  <h4 class="font-semibold text-gray-900 text-sm mb-2">
                    Режим работы
                  </h4>
                  <div class="space-y-1.5 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Пн-Пт</span>
                      <span class="font-medium text-gray-900">10:00–20:00</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Сб</span>
                      <span class="font-medium text-gray-900">10:00–18:00</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Вс</span>
                      <span class="font-medium text-gray-900">Выходной</span>
                    </div>
                  </div>
                </div>
              </template>
            </UPopover>

            <!-- Адрес на карте -->
            <UPopover mode="hover" :popper="{ placement: 'bottom' }">
              <UButton
                variant="ghost"
                class="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors group"
                size="sm"
              >
                <div
                  class="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors"
                >
                  <Icon
                    name="material-symbols:map-outline"
                    class="w-4 h-4 text-gray-600 group-hover:text-primary"
                  />
                </div>
                <span
                  class="text-sm font-medium text-gray-900 whitespace-nowrap"
                  >Красный пр., 26</span
                >
                <Icon
                  name="i-heroicons-chevron-down-16-solid"
                  class="w-4 h-4 text-gray-400"
                />
              </UButton>

              <template #content>
                <div class="w-64 p-3">
                  <h4 class="font-semibold text-gray-900 text-sm mb-2">
                    Как нас найти
                  </h4>
                  <div
                    class="bg-gray-100 h-24 rounded-lg flex items-center justify-center mb-2"
                  >
                    <div class="text-center">
                      <Icon
                        name="material-symbols:map-outline"
                        class="w-8 h-8 text-gray-400 mx-auto mb-1"
                      />
                      <p class="text-sm text-gray-600">Красный проспект, 26</p>
                      <p class="text-sm text-gray-500">
                        ст. м. "Площадь Ленина"
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://yandex.ru/maps/-/CDvBPw~A"
                    target="_blank"
                    class="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
                  >
                    <Icon
                      name="i-heroicons-arrow-top-right-on-square"
                      class="w-4 h-4"
                    />
                    Открыть на карте
                  </a>
                </div>
              </template>
            </UPopover>
          </div>

          <!-- Навигация - квадратные кнопки 56x56 -->
          <div class="hidden lg:flex items-center gap-1">
            <UButton
              v-for="link in navigateLinks"
              :key="link.label"
              :to="link.link"
              variant="ghost"
              class="flex flex-col items-center justify-center w-14 h-14 gap-1 hover:bg-gray-50 rounded-lg transition-all duration-200 group"
            >
              <div
                class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors"
              >
                <Icon
                  :name="link.icon"
                  class="w-4 h-4 text-gray-700 group-hover:text-primary"
                />
              </div>
              <span
                class="text-xs font-medium text-gray-700 group-hover:text-primary leading-tight px-0.5 text-center"
                >{{ link.label }}</span
              >
            </UButton>
          </div>

          <!-- Контакты: телефон и почта -->
          <div class="hidden md:flex items-center gap-3">
            <div class="flex items-center gap-2">
              <a
                href="tel:+73832101053"
                class="flex items-center gap-2 text-gray-900 hover:text-primary transition-colors group"
              >
                <div
                  class="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                >
                  <Icon
                    name="ic:outline-phone"
                    class="w-3.5 h-3.5 text-primary"
                  />
                </div>
                <span class="text-sm font-medium whitespace-nowrap"
                  >+7 (383) 210-10-53</span
                >
              </a>
              <span class="text-gray-300 text-sm">|</span>
              <a
                href="mailto:noub@nso.ru"
                class="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors group"
              >
                <div
                  class="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                >
                  <Icon
                    name="material-symbols:mail-outline"
                    class="w-3.5 h-3.5 text-primary"
                  />
                </div>
                <span class="text-sm whitespace-nowrap">noub@nso.ru</span>
              </a>
            </div>

            <!-- Соцсети -->
            <div class="flex items-center gap-1">
              <a
                v-for="link in socialLinks"
                :key="link.label"
                :href="link.link"
                target="_blank"
                class="w-7 h-7 bg-gray-100 hover:bg-primary rounded-lg flex items-center justify-center transition-all duration-200 group"
              >
                <Icon
                  :name="link.icon"
                  class="w-3.5 h-3.5 text-gray-600 group-hover:text-white"
                />
              </a>
            </div>
          </div>

          <!-- Мобильная кнопка меню -->
          <UButton
            class="lg:hidden"
            color="gray"
            variant="ghost"
            icon="i-heroicons-bars-3-20-solid"
            size="md"
            :ui="{ rounded: 'rounded-lg' }"
            @click="mobileMenuOpen = !mobileMenuOpen"
          />
        </div>
      </div>

      <!-- Мобильное меню -->
      <div
        v-if="mobileMenuOpen"
        class="lg:hidden mt-4 pt-4 border-t border-gray-100"
      >
        <!-- Контакты для мобильных -->
        <div class="flex flex-col gap-2 mb-3">
          <a
            href="tel:+73832101053"
            class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div
              class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center"
            >
              <Icon name="ic:outline-phone" class="w-5 h-5 text-primary" />
            </div>
            <div>
              <p class="text-xs text-gray-500">Телефон</p>
              <p class="text-base font-medium text-gray-900">
                +7 (383) 210-10-53
              </p>
            </div>
          </a>
          <a
            href="mailto:noub@nso.ru"
            class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div
              class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center"
            >
              <Icon
                name="material-symbols:mail-outline"
                class="w-5 h-5 text-primary"
              />
            </div>
            <div>
              <p class="text-xs text-gray-500">Email</p>
              <p class="text-base font-medium text-gray-900">noub@nso.ru</p>
            </div>
          </a>
        </div>

        <!-- Выпадашки для мобильных -->
        <div class="flex gap-2 mb-3">
          <UPopover mode="click" :popper="{ placement: 'bottom' }">
            <UButton
              variant="soft"
              size="md"
              class="flex-1 flex items-center justify-center gap-2 py-2.5"
            >
              <Icon name="mingcute:time-line" class="w-4 h-4" />
              <span class="text-sm">Режим работы</span>
            </UButton>
            <template #content>
              <div class="w-56 p-3">
                <h4 class="font-semibold text-gray-900 text-sm mb-2">
                  Режим работы
                </h4>
                <div class="space-y-1.5 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Пн-Пт</span>
                    <span class="font-medium text-gray-900">10:00–20:00</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Сб</span>
                    <span class="font-medium text-gray-900">10:00–18:00</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Вс</span>
                    <span class="font-medium text-gray-900">Выходной</span>
                  </div>
                </div>
              </div>
            </template>
          </UPopover>

          <UPopover mode="click" :popper="{ placement: 'bottom' }">
            <UButton
              variant="soft"
              size="md"
              class="flex-1 flex items-center justify-center gap-2 py-2.5"
            >
              <Icon name="material-symbols:map-outline" class="w-4 h-4" />
              <span class="text-sm">Адрес</span>
            </UButton>
            <template #content>
              <div class="w-64 p-3">
                <h4 class="font-semibold text-gray-900 text-sm mb-2">
                  Как нас найти
                </h4>
                <div
                  class="bg-gray-100 h-24 rounded-lg flex items-center justify-center mb-2"
                >
                  <div class="text-center">
                    <Icon
                      name="material-symbols:map-outline"
                      class="w-8 h-8 text-gray-400 mx-auto mb-1"
                    />
                    <p class="text-sm text-gray-600">Красный проспект, 26</p>
                    <p class="text-sm text-gray-500">ст. м. "Площадь Ленина"</p>
                  </div>
                </div>
                <a
                  href="https://yandex.ru/maps/-/CDvBPw~A"
                  target="_blank"
                  class="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
                >
                  <Icon
                    name="i-heroicons-arrow-top-right-on-square"
                    class="w-4 h-4"
                  />
                  Открыть на карте
                </a>
              </div>
            </template>
          </UPopover>
        </div>

        <!-- Навигация для мобильных -->
        <div class="grid grid-cols-2 gap-2">
          <UButton
            v-for="link in navigateLinks"
            :key="link.label"
            :to="link.link"
            variant="soft"
            size="md"
            class="flex flex-col items-center justify-center p-4 h-20"
          >
            <Icon :name="link.icon" class="w-5 h-5 mb-1" />
            <span class="text-sm text-center leading-tight">{{
              link.label
            }}</span>
          </UButton>
        </div>

        <!-- Соцсети для мобильных -->
        <div
          class="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-gray-100"
        >
          <a
            v-for="link in socialLinks"
            :key="link.label"
            :href="link.link"
            target="_blank"
            class="w-10 h-10 bg-gray-100 hover:bg-primary rounded-full flex items-center justify-center transition-colors"
          >
            <Icon
              :name="link.icon"
              class="w-5 h-5 text-gray-600 hover:text-white"
            />
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const mobileMenuOpen = ref(false);

const navigateLinks = [
  {
    icon: 'i-heroicons-magnifying-glass',
    label: 'Поиск',
    link: '/entry',
  },
  {
    icon: 'i-heroicons-wheelchair',
    label: 'Доступная среда',
    link: '/entry/dostupnaya-sreda-03-32-22-10-22',
  },
  {
    icon: 'i-heroicons-academic-cap',
    label: 'Сведения',
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

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
