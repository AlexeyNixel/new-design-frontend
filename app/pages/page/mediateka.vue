<template>
  <div class="bg-gradient-to-b from-indigo-50 via-white to-purple-50">
    <!-- Hero секция с названием -->
    <div
      class="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600"
    >
      <div class="absolute inset-0 bg-black opacity-20"></div>
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full opacity-10 blur-3xl"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-white rounded-full opacity-10 blur-3xl"
      ></div>

      <div class="container mx-auto px-4 py-16 md:py-24 max-w-7xl relative">
        <div
          class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8"
        >
          <div class="flex-1">
            <div
              class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
            >
              <UIcon
                name="i-heroicons-musical-note"
                class="w-5 h-5 text-white"
              />
              <span class="text-white text-sm font-medium"
                >Отдел медиатека</span
              >
            </div>
            <h1 class="text-5xl md:text-7xl font-bold text-white mb-4">
              Медиатека
            </h1>
            <p class="text-xl text-indigo-100 max-w-2xl">
              Место встречи и общения всех, кто любит кино и музыку
            </p>
          </div>

          <!-- Контактная карточка -->
          <div class="lg:w-96">
            <div class="bg-white rounded-2xl shadow-2xl p-6 backdrop-blur-sm">
              <div
                class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100"
              >
                <div
                  class="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-2"
                >
                  <UIcon name="i-heroicons-phone" class="w-6 h-6 text-white" />
                </div>
                <div>
                  <p class="text-sm text-gray-500">Свяжитесь с нами</p>
                  <a
                    href="tel:+73832101204"
                    class="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition"
                  >
                    (383) 210-12-04
                  </a>
                </div>
              </div>

              <div class="space-y-3">
                <div class="flex items-center gap-3 text-gray-600">
                  <UIcon
                    name="i-heroicons-map-pin"
                    class="w-5 h-5 flex-shrink-0"
                  />
                  <span class="text-sm">г. Новосибирск, [Ваш адрес]</span>
                </div>
                <div class="flex items-center gap-3 text-gray-600">
                  <UIcon
                    name="i-heroicons-envelope"
                    class="w-5 h-5 flex-shrink-0"
                  />
                  <span class="text-sm">[email@example.com]</span>
                </div>
                <div class="flex items-center gap-3 text-gray-600">
                  <UIcon
                    name="i-heroicons-clock"
                    class="w-5 h-5 flex-shrink-0"
                  />
                  <span class="text-sm">[Режим работы]</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Основной контент -->
    <div class="container mx-auto px-4 py-16 max-w-7xl">
      <!-- Статистика/Факты -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        <div
          class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 text-center"
        >
          <div class="text-3xl font-bold text-indigo-600 mb-2">10 000+</div>
          <div class="text-sm text-gray-600">грампластинок</div>
        </div>
        <div
          class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 text-center"
        >
          <div class="text-3xl font-bold text-purple-600 mb-2">1000+</div>
          <div class="text-sm text-gray-600">фильмов на дисках</div>
        </div>
        <div
          class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 text-center"
        >
          <div class="text-3xl font-bold text-blue-600 mb-2">300+</div>
          <div class="text-sm text-gray-600">мероприятий в год</div>
        </div>
        <div
          class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center"
        >
          <div class="text-3xl font-bold text-green-600 mb-2">5</div>
          <div class="text-sm text-gray-600">клубов по интересам</div>
        </div>
      </div>

      <!-- Основное описание -->
      <div class="prose prose-lg max-w-none mb-16">
        <div class="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <p class="text-gray-700 leading-relaxed mb-6">
            <strong class="text-indigo-600">Медиатека</strong> Новосибирской
            областной молодежной библиотеки располагает обширной и разнообразной
            коллекцией документальных и художественных фильмов на лицензионных
            дисках. Это шедевры мирового и отечественного художественного
            киноискусства, киноклассика, современные рейтинговые фильмы,
            киноновинки различных жанров.
          </p>

          <div class="grid md:grid-cols-2 gap-8 my-8">
            <div
              class="bg-gradient-to-br from-indigo-50 to-transparent rounded-xl p-6"
            >
              <div class="flex items-center gap-3 mb-4">
                <div class="bg-indigo-100 rounded-lg p-2">
                  <UIcon
                    name="i-heroicons-film"
                    class="w-6 h-6 text-indigo-600"
                  />
                </div>
                <h3 class="font-semibold text-gray-900">Коллекция фильмов</h3>
              </div>
              <p class="text-gray-600 text-sm">
                Шедевры мирового и отечественного киноискусства, киноклассика,
                современные рейтинговые фильмы, киноновинки различных жанров.
              </p>
            </div>

            <div
              class="bg-gradient-to-br from-purple-50 to-transparent rounded-xl p-6"
            >
              <div class="flex items-center gap-3 mb-4">
                <div class="bg-purple-100 rounded-lg p-2">
                  <UIcon
                    name="i-heroicons-musical-note"
                    class="w-6 h-6 text-purple-600"
                  />
                </div>
                <h3 class="font-semibold text-gray-900">Фонотека</h3>
              </div>
              <p class="text-gray-600 text-sm">
                Около 10 тысяч грампластинок с музыкальными и литературными
                записями, музыкальные диски, аудиокниги.
              </p>
            </div>

            <div
              class="bg-gradient-to-br from-pink-50 to-transparent rounded-xl p-6"
            >
              <div class="flex items-center gap-3 mb-4">
                <div class="bg-pink-100 rounded-lg p-2">
                  <UIcon
                    name="i-heroicons-academic-cap"
                    class="w-6 h-6 text-pink-600"
                  />
                </div>
                <h3 class="font-semibold text-gray-900">Образование</h3>
              </div>
              <p class="text-gray-600 text-sm">
                Мультимедийные издания учебного, познавательного характера,
                научно-популярные фильмы BBC и National Geographic.
              </p>
            </div>

            <div
              class="bg-gradient-to-br from-blue-50 to-transparent rounded-xl p-6"
            >
              <div class="flex items-center gap-3 mb-4">
                <div class="bg-blue-100 rounded-lg p-2">
                  <UIcon
                    name="i-heroicons-user-group"
                    class="w-6 h-6 text-blue-600"
                  />
                </div>
                <h3 class="font-semibold text-gray-900">Досуг</h3>
              </div>
              <p class="text-gray-600 text-sm">
                Конкурсы, акции, разнообразные массовые мероприятия, уютный зал
                для групповых просмотров.
              </p>
            </div>
          </div>

          <p class="text-gray-700 leading-relaxed mb-6">
            Здесь найдут для себя много интересного любители мистики и ужасов,
            неисправимые романтики и любители мелодрам, вечные юмористы и
            искатели киноприключений. Для любителей серьёзного кино в фонде
            медиатеки имеются документальные фильмы по отечественной и
            зарубежной истории, фильмы о космосе, животном и подводном мире,
            биографии ученых, писателей и художников и многое другое.
          </p>

          <p class="text-gray-700 leading-relaxed mb-6">
            Маленьким зрителям мы можем предложить посмотреть у нас интересные
            мультфильмы, сказки, художественные фильмы для детей.
          </p>

          <div class="my-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              Коллекции фильмов в сериях:
            </h3>
            <div class="flex flex-wrap gap-3">
              <span
                class="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm"
                >Русская литература в кинематографе</span
              >
              <span
                class="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm"
                >Ретроколлекция фильмов</span
              >
              <span
                class="bg-pink-100 text-pink-800 px-4 py-2 rounded-full text-sm"
                >Театр на экране</span
              >
              <span
                class="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm"
                >Балетные постановки</span
              >
              <span
                class="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm"
                >Другое кино</span
              >
              <span
                class="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm"
                >Кино без границ</span
              >
            </div>
          </div>

          <!-- Условия -->
          <div
            class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 my-8"
          >
            <h3 class="text-lg font-semibold text-gray-900 mb-3">
              У нас есть все, чтобы предложить вам отличный отдых и эффективную
              работу:
            </h3>
            <ul class="space-y-2 text-gray-700">
              <li class="flex items-center gap-2">
                ✓ Уютный зал для групповых просмотров и индивидуальные места,
                оборудованные современной техникой
              </li>
              <li class="flex items-center gap-2">✓ Открытый доступ к фонду</li>
              <li class="flex items-center gap-2">
                ✓ Доброжелательная атмосфера
              </li>
            </ul>
          </div>

          <div
            class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-center text-white my-8"
          >
            <h3 class="text-2xl font-bold mb-3">Мульт-Сибирь</h3>
            <p class="text-indigo-100 mb-4">
              В рамках проекта "Мульт-Сибирь", который реализуется Новосибирской
              региональной общественной организацией "Гильдия молодых
              библиотекарей" с использованием гранта Президента Российской
              Федерации, в медиатеке открыта мультстудия.
            </p>
            <div
              class="inline-flex bg-white/20 backdrop-blur-sm rounded-full px-6 py-2"
            >
              <span class="text-sm">🎬 Присоединяйтесь!</span>
            </div>
          </div>

          <!-- Руководитель -->
          <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mt-8">
            <div class="bg-indigo-100 rounded-full p-3">
              <UIcon
                name="i-heroicons-user-circle"
                class="w-8 h-8 text-indigo-600"
              />
            </div>
            <div>
              <p class="text-sm text-gray-500">Руководитель отдела</p>
              <p class="font-semibold text-gray-900">
                Бычкова Наталья Васильевна
              </p>
              <p class="text-sm text-gray-600">главный библиотекарь</p>
            </div>
          </div>

          <div class="text-center mt-12">
            <div
              class="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xl font-semibold py-3 px-8 rounded-full shadow-lg"
            >
              Всегда рады видеть вас в медиатеке! 🎬🎵
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>
