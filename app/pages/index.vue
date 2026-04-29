<script setup lang="ts"></script>
<!-- pages/index.vue -->
<template>
  <div class="flex flex-col gap-0">
    <!-- ГЕРОЙ-СЕКЦИЯ -->
    <section class="bg-gradient-to-br from-primary-50 to-primary-100">
      <div class="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
        <div class="max-w-[1700px] mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div class="lg:col-span-9 flex">
              <div
                class="rounded-2xl overflow-hidden shadow-xl bg-white w-full"
              >
                <MainCarousel />
              </div>
            </div>

            <!-- Правая колонка - 3 колонки -->
            <div class="lg:col-span-3 flex flex-col gap-4">
              <InfoBanner />
              <EventCalendar />
            </div>
          </div>

          <!-- Поиск -->
          <div class="mt-6 block">
            <CatalogSearch
              placeholder="Найти настолку, книгу или событие..."
              class="w-full"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Остальные секции -->
    <CommonSectionWrapper
      title="Последние новости"
      link="/entry"
      link-label="Все новости"
      bg-gray
    >
      <NewsCarousel />
    </CommonSectionWrapper>

    <CommonSectionWrapper
      title="Игровая библиотека"
      link="/games"
      link-label="Полный список игр"
    >
      <GameCarousel />
    </CommonSectionWrapper>

    <CommonSectionWrapper
      bg-gray
      title="Книги"
      link="/books"
      link-label="Полный список книг"
    >
      <BookShelf />
    </CommonSectionWrapper>

    <!--    <CommonSectionWrapper bg-gray>-->
    <!--      <Achievements />-->
    <!--    </CommonSectionWrapper>-->
  </div>
</template>
