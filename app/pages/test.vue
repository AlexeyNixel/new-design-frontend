<script setup lang="ts"></script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Шапка -->
    <header
      class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100"
    >
      <CommonContentContainer>
        <div class="flex items-center justify-between h-16">
          <!-- Логотип -->
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center"
            >
              <Icon
                name="i-heroicons-building-library"
                class="w-6 h-6 text-white"
              />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">
                Игровая Библиотека
              </h1>
              <p class="text-xs text-gray-500">
                Культурный и развлекательный центр
              </p>
            </div>
          </div>

          <!-- Навигация -->
          <nav class="hidden md:flex items-center gap-6">
            <NuxtLink
              to="/"
              class="text-gray-700 hover:text-primary font-medium"
              >Главная</NuxtLink
            >
            <NuxtLink
              to="/news"
              class="text-gray-700 hover:text-primary font-medium"
              >Новости</NuxtLink
            >
            <NuxtLink
              to="/games"
              class="text-gray-700 hover:text-primary font-medium"
              >Игры</NuxtLink
            >
            <NuxtLink
              to="/books"
              class="text-gray-700 hover:text-primary font-medium"
              >Книги</NuxtLink
            >
            <NuxtLink
              to="/events"
              class="text-gray-700 hover:text-primary font-medium"
              >События</NuxtLink
            >
          </nav>

          <!-- Кнопки -->
          <div class="flex items-center gap-3">
            <UButton
              icon="i-heroicons-magnifying-glass"
              color="gray"
              variant="ghost"
            />
            <UButton label="Войти" color="primary" variant="solid" />
          </div>
        </div>
      </CommonContentContainer>
    </header>

    <CommonContentContainer class="py-8">
      <!-- Блок 1: Слайдер + Уведомления + Календарь -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <!-- Левая часть: Слайдер (2/3) -->
        <div class="lg:col-span-2">
          <div
            class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
          >
            <!-- Заголовок слайдера -->
            <div class="bg-gradient-to-r from-primary to-primary/90 px-6 py-4">
              <h2 class="text-xl font-bold text-white flex items-center gap-2">
                <Icon name="i-heroicons-photo" class="w-5 h-5" />
                Актуальные события
              </h2>
            </div>

            <!-- Контент слайдера -->
            <div
              class="relative h-80 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center"
            >
              <div class="text-center">
                <Icon
                  name="i-heroicons-play-circle"
                  class="w-16 h-16 text-primary/50 mx-auto mb-4"
                />
                <p class="text-gray-600 font-medium">
                  Слайдер с важными событиями
                </p>
                <p class="text-gray-400 text-sm mt-2">
                  Здесь будет карусель с изображениями и описаниями
                </p>
              </div>

              <!-- Навигация слайдера -->
              <div
                class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2"
              >
                <div class="w-3 h-3 bg-primary rounded-full"></div>
                <div class="w-3 h-3 bg-gray-300 rounded-full"></div>
                <div class="w-3 h-3 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Правая часть: Уведомления и Календарь (1/3) -->
        <div class="space-y-6">
          <!-- Блок уведомлений -->
          <div
            class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div class="bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-3">
              <h3 class="font-bold text-white flex items-center gap-2">
                <Icon name="i-heroicons-bell-alert" class="w-5 h-5" />
                Важные уведомления
              </h3>
            </div>

            <div class="p-4 space-y-3">
              <div class="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                <Icon
                  name="i-heroicons-exclamation-triangle"
                  class="w-5 h-5 text-amber-600 mt-0.5"
                />
                <div>
                  <p class="font-medium text-gray-900">Технические работы</p>
                  <p class="text-sm text-gray-600">Завтра с 10:00 до 12:00</p>
                </div>
              </div>

              <div class="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Icon
                  name="i-heroicons-megaphone"
                  class="w-5 h-5 text-blue-600 mt-0.5"
                />
                <div>
                  <p class="font-medium text-gray-900">Новая игра</p>
                  <p class="text-sm text-gray-600">Поступила в библиотеку</p>
                </div>
              </div>

              <div class="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <Icon
                  name="i-heroicons-calendar"
                  class="w-5 h-5 text-green-600 mt-0.5"
                />
                <div>
                  <p class="font-medium text-gray-900">Турнир по настолкам</p>
                  <p class="text-sm text-gray-600">Регистрация открыта</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Календарь событий -->
          <div
            class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div class="bg-gradient-to-r from-green-500 to-green-400 px-4 py-3">
              <h3 class="font-bold text-white flex items-center gap-2">
                <Icon name="i-heroicons-calendar-days" class="w-5 h-5" />
                Календарь событий
              </h3>
            </div>

            <div class="p-4">
              <!-- Месяц и год -->
              <div class="flex items-center justify-between mb-4">
                <button class="p-2 hover:bg-gray-100 rounded-lg">
                  <Icon name="i-heroicons-chevron-left" class="w-4 h-4" />
                </button>
                <span class="font-bold text-gray-900">Март 2024</span>
                <button class="p-2 hover:bg-gray-100 rounded-lg">
                  <Icon name="i-heroicons-chevron-right" class="w-4 h-4" />
                </button>
              </div>

              <!-- Дни недели -->
              <div class="grid grid-cols-7 gap-1 mb-2">
                <div class="text-center text-sm text-gray-500 font-medium">
                  Пн
                </div>
                <div class="text-center text-sm text-gray-500 font-medium">
                  Вт
                </div>
                <div class="text-center text-sm text-gray-500 font-medium">
                  Ср
                </div>
                <div class="text-center text-sm text-gray-500 font-medium">
                  Чт
                </div>
                <div class="text-center text-sm text-gray-500 font-medium">
                  Пт
                </div>
                <div class="text-center text-sm text-gray-500 font-medium">
                  Сб
                </div>
                <div class="text-center text-sm text-gray-500 font-medium">
                  Вс
                </div>
              </div>

              <!-- Числа -->
              <div class="grid grid-cols-7 gap-1">
                <div
                  v-for="day in 31"
                  :key="day"
                  :class="[
                    'text-center p-2 rounded-lg text-sm cursor-pointer',
                    day === 15
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100 text-gray-700',
                  ]"
                >
                  {{ day }}
                </div>
              </div>

              <!-- События сегодня -->
              <div class="mt-6 p-3 bg-gray-50 rounded-lg">
                <p class="text-sm font-medium text-gray-900 mb-1">Сегодня:</p>
                <p class="text-sm text-gray-600">
                  Встреча книжного клуба в 18:00
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Блок 2: Новости -->
      <div class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Последние новости</h2>
            <p class="text-gray-600">
              Следите за обновлениями нашей библиотеки
            </p>
          </div>
          <NuxtLink
            to="/news"
            class="text-primary font-semibold hover:underline flex items-center gap-2"
          >
            Все новости
            <Icon name="i-heroicons-arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Заглушки для новостей -->
          <div
            v-for="i in 3"
            :key="i"
            class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 group hover:shadow-xl transition-shadow"
          >
            <!-- Изображение -->
            <div
              class="h-48 bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden"
            >
              <div class="absolute inset-0 flex items-center justify-center">
                <Icon
                  name="i-heroicons-newspaper"
                  class="w-16 h-16 text-gray-400"
                />
              </div>
              <!-- Дата -->
              <div
                class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5"
              >
                <span class="text-sm font-semibold text-gray-900">15 Мар</span>
              </div>
            </div>

            <!-- Контент -->
            <div class="p-6">
              <h3
                class="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors"
              >
                Заголовок новости {{ i }} о мероприятии в библиотеке
              </h3>
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                Краткое описание новости о проведении мероприятия...
              </p>

              <!-- Читать далее -->
              <div class="flex items-center text-primary font-medium text-sm">
                <span>Читать подробнее</span>
                <Icon
                  name="i-heroicons-arrow-right"
                  class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Блок 3: Книги -->
      <div class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">
              Новые поступления книг
            </h2>
            <p class="text-gray-600">Пополнение библиотечного фонда</p>
          </div>
          <NuxtLink
            to="/books"
            class="text-primary font-semibold hover:underline flex items-center gap-2"
          >
            Все книги
            <Icon name="i-heroicons-arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <!-- Заглушки для книг -->
          <div
            v-for="i in 4"
            :key="i"
            class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 group hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <!-- Обложка -->
            <div
              class="aspect-[3/4] bg-gradient-to-br from-amber-100 to-amber-200 relative overflow-hidden"
            >
              <div
                class="absolute inset-0 flex flex-col items-center justify-center p-4"
              >
                <Icon
                  name="i-heroicons-book-open"
                  class="w-12 h-12 text-amber-600 mb-3"
                />
                <div class="w-full h-1 bg-amber-300 mb-2"></div>
                <div class="w-3/4 h-1 bg-amber-300 mb-2"></div>
                <div class="w-1/2 h-1 bg-amber-300"></div>
              </div>
              <!-- Тип -->
              <div class="absolute top-2 right-2">
                <span
                  class="bg-white/90 text-xs font-semibold px-2 py-1 rounded"
                >
                  Книга
                </span>
              </div>
            </div>

            <!-- Информация -->
            <div class="p-4">
              <h4 class="font-medium text-gray-900 line-clamp-2 text-sm mb-2">
                Название книги {{ i }} с автором
              </h4>
              <p class="text-xs text-gray-500 mb-3">Жанр книги</p>
              <div class="flex items-center justify-between">
                <span class="text-primary text-sm font-medium"
                  >Подробнее →</span
                >
                <span class="text-xs text-gray-400">2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Блок 4: Игры -->
      <div class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Игровая библиотека</h2>
            <p class="text-gray-600">Настольные игры для всех возрастов</p>
          </div>
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/games"
              class="text-primary font-semibold hover:underline flex items-center gap-2"
            >
              Все игры
              <Icon name="i-heroicons-arrow-right" class="w-4 h-4" />
            </NuxtLink>
            <UButton
              label="Подобрать игру"
              color="primary"
              variant="solid"
              icon="i-heroicons-magnifying-glass"
              size="sm"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <!-- Заглушки для игр -->
          <div
            v-for="i in 6"
            :key="i"
            class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 group hover:shadow-md transition-all"
          >
            <!-- Обложка игры -->
            <div
              class="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 relative overflow-hidden"
            >
              <div class="absolute inset-0 flex items-center justify-center">
                <Icon
                  name="i-heroicons-puzzle-piece"
                  class="w-10 h-10 text-blue-600"
                />
              </div>
              <!-- Параметры -->
              <div class="absolute bottom-2 left-2 right-2">
                <div
                  class="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1"
                >
                  <span class="text-xs font-bold">2-4</span>
                  <span class="text-xs">60м</span>
                  <span class="text-xs font-bold">12+</span>
                </div>
              </div>
            </div>

            <!-- Информация -->
            <div class="p-3">
              <h4 class="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                Название игры {{ i }}
              </h4>
              <div class="flex items-center justify-between">
                <span class="text-xs text-green-600 font-semibold"
                  >✓ Доступна</span
                >
                <Icon
                  name="i-heroicons-arrow-right"
                  class="w-3 h-3 text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Блок 5: Статистика -->
      <div
        class="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-white mb-12"
      >
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="text-center">
            <div class="text-4xl font-bold mb-2">156+</div>
            <div class="text-sm opacity-90">Игр в библиотеке</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold mb-2">2,340+</div>
            <div class="text-sm opacity-90">Книг в коллекции</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold mb-2">45+</div>
            <div class="text-sm opacity-90">Мероприятий в месяц</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold mb-2">1,200+</div>
            <div class="text-sm opacity-90">Посетителей в неделю</div>
          </div>
        </div>
      </div>

      <!-- Футер -->
      <footer class="border-t border-gray-200 pt-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center"
              >
                <Icon
                  name="i-heroicons-building-library"
                  class="w-6 h-6 text-white"
                />
              </div>
              <div>
                <h3 class="font-bold text-gray-900">Игровая Библиотека</h3>
                <p class="text-sm text-gray-600">Культура и отдых</p>
              </div>
            </div>
            <p class="text-gray-600 text-sm">
              Место, где встречаются книги, игры и хорошая компания
            </p>
          </div>

          <div>
            <h4 class="font-bold text-gray-900 mb-4">Навигация</h4>
            <ul class="space-y-2">
              <li>
                <a href="#" class="text-gray-600 hover:text-primary text-sm"
                  >Новости</a
                >
              </li>
              <li>
                <a href="#" class="text-gray-600 hover:text-primary text-sm"
                  >Игры</a
                >
              </li>
              <li>
                <a href="#" class="text-gray-600 hover:text-primary text-sm"
                  >Книги</a
                >
              </li>
              <li>
                <a href="#" class="text-gray-600 hover:text-primary text-sm"
                  >События</a
                >
              </li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold text-gray-900 mb-4">Контакты</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li class="flex items-center gap-2">
                <Icon name="i-heroicons-phone" class="w-4 h-4" />
                +7 (XXX) XXX-XX-XX
              </li>
              <li class="flex items-center gap-2">
                <Icon name="i-heroicons-envelope" class="w-4 h-4" />
                info@library.ru
              </li>
              <li class="flex items-center gap-2">
                <Icon name="i-heroicons-map-pin" class="w-4 h-4" />
                г. Город, ул. Примерная, 123
              </li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold text-gray-900 mb-4">Часы работы</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li>Пн-Пт: 10:00 - 22:00</li>
              <li>Сб-Вс: 11:00 - 20:00</li>
            </ul>
          </div>
        </div>

        <div
          class="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-500"
        >
          © 2024 Игровая Библиотека. Все права защищены.
        </div>
      </footer>
    </CommonContentContainer>
  </div>
</template>

<style scoped></style>
