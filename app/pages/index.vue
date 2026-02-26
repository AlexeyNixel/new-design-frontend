<template>
  <div class="flex flex-col gap-5">
    <CommonContentContainer>
      <!--
        Основная сетка:
        - xs/sm: 1 колонка (всё вертикально)
        - md: 2 колонки (карусель + сайдбар рядом)
        - lg/xl: 7 колонок (карусель 5, сайдбар 2)
      -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-4 md:gap-5"
      >
        <!-- КАРУСЕЛЬ -->
        <div class="col-span-1 md:col-span-1 xl:col-span-5">
          <div class="w-full h-full rounded-xl">
            <MainCarousel />
          </div>
        </div>
        <!-- ПРАВАЯ КОЛОНКА (Баннер + Календарь) -->
        <!--
          Логика перестроения:
          - xs (< 640px): Только календарь (баннер скрыт)
          - sm (640px+): Баннер и календарь в ряд (50/50)
          - md (768px+): Баннер и календарь в ряд, но внутри второй колонки грида
          - xl (1280px+): Баннер и календарь вертикально
        -->
        <div
          class="col-span-1 md:col-span-1 xl:col-span-2 flex flex-col sm:flex-row xl:flex-col gap-4 md:gap-5"
        >
          <!-- БАННЕР -->
          <div class="hidden sm:flex w-full sm:w-1/2 xl:w-full xl:flex-1">
            <div class="w-full h-full min-h-[200px] xl:min-h-0">
              <InfoBanner />
            </div>
          </div>
          <!-- КАЛЕНДАРЬ -->
          <div class="w-full sm:w-1/2 xl:w-full xl:flex-[1.5]">
            <div class="h-full min-h-[300px] xl:min-h-0">
              <EventCalendar />
            </div>
          </div>
        </div>
      </div>
      <!-- ПОИСК -->
      <div class="mt-4 md:mt-5">
        <CatalogSearch class="w-full" />
      </div>
    </CommonContentContainer>

    <CommonContentContainer bg-gray title="Последние новости">
      <NewsCarousel />
    </CommonContentContainer>

    <CommonContentContainer
      title="Книги"
      link="/books"
      link-label="Полный список книг"
    >
      <BookShelf />
    </CommonContentContainer>

    <!--    <CommonContentContainer-->
    <!--      bg-gray-->
    <!--      title="Игровая библиотека"-->
    <!--      link-label="Полный список игр"-->
    <!--      link="/"-->
    <!--      ><GameCarousel-->
    <!--    /></CommonContentContainer>-->

    <!--    <CommonContentContainer bgGray>-->
    <!--      <div class="flex gap-5">-->
    <!--        <CommonContentContainer title="Викторины" bgGray>-->
    <!--          <ExhibitionContent />-->
    <!--        </CommonContentContainer>-->
    <!--        <CommonContentContainer title="Викторины" bgGray>-->
    <!--          <ExhibitionContent />-->
    <!--        </CommonContentContainer>-->
    <!--      </div>-->
    <!--    </CommonContentContainer>-->

    <CommonContentContainer>
      <div class="flex gap-8">
        <div class="w-1/2 h-[450px]">
          <FeedbackGos class="h-full shadow overflow-hidden rounded-xl" />
        </div>
        <div class="w-1/2 shadow overflow-hidden rounded-xl">
          <img src="/banner-uvazhaemye-posetiteli.png" alt="" />
        </div>
      </div>
    </CommonContentContainer>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

console.log(config.public.apiBaseUrl);
</script>

<style scoped></style>
