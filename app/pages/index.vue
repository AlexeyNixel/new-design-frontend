<template>
  <div class="flex flex-col gap-5">
    <div class="grid grid-cols-3 gap-5">
      <div class="col-span-2">
        <PagesComponentsIndexMainCarousel />
      </div>

      <div class="col-span-1 flex flex-col gap-5 w-full">
        <div class="bg-white rounded-xl shadow p-4 w-full h-1/2">
          <PagesComponentsIndexNotificationBanner />
        </div>
        <div class="bg-white p-4 rounded-xl shadow flex-1 h-1/2">
          <PagesComponentsIndexEventCalendar />
        </div>
      </div>
    </div>
    <PagesComponentsIndexCatalogSearch />
    <PagesComponentsIndexBookShelf />
    <!--    <CustomSwiper />-->
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
