<template>
  <div class="flex flex-col gap-5">
    <CommonContentContainer>
      <div class="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div class="col-span-1 xl:col-span-4">
          <MainCarousel class="h-full" />
        </div>

        <div class="flex flex-row xl:flex-col col-span-1 gap-5">
          <div
            class="bg-white p-4 rounded-xl shadow hidden sm:block w-1/2 xl:w-full xl:h-1/3"
          >
            <InfoBanner />
          </div>
          <div
            class="bg-white p-4 rounded-xl shadow w-full sm:w-1/2 xl:w-full xl:h-2/3"
          >
            <!--            <EventCalendar />-->
          </div>
        </div>
      </div>
      <div class="my-5">
        <CatalogSearch class="w-full" />
      </div>
    </CommonContentContainer>

    <CommonContentContainer title="Книги" bgGray>
      <BookShelf />
    </CommonContentContainer>

    <CommonContentContainer title="События">
      <NewsCarousel />
    </CommonContentContainer>

    <!--        <CommonContentContainer bgGray>-->
    <!--          <div class="flex gap-5">-->
    <!--            <CommonContentContainer title="Викторины" bgGray>-->
    <!--              <ExhibitionContent />-->
    <!--            </CommonContentContainer>-->
    <!--            <CommonContentContainer title="Викторины" bgGray>-->
    <!--              <ExhibitionContent />-->
    <!--            </CommonContentContainer>-->
    <!--          </div>-->
    <!--        </CommonContentContainer>-->

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

<script setup lang="ts"></script>

<style scoped></style>
