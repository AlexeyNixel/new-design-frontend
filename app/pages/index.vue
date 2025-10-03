<template>
  <div class="flex flex-col gap-5">
    <div class="grid grid-cols-3 gap-5">
      <div class="col-span-2">
        <MainCarousel />
      </div>

      <div class="col-span-1 flex flex-col gap-5 w-full">
        <div class="bg-white rounded-xl shadow p-4 w-full h-1/2">
          <NotificationBanner />
        </div>
        <div class="bg-white p-4 rounded-xl shadow flex-1 h-1/2">
          <EventCalendar />
        </div>
      </div>
    </div>
    <CatalogSearch />
    <BookShelf />
    <!--    <CustomSwiper />-->
  </div>
</template>

<script setup lang="ts">
import CustomSwiper from '~/components/ui/CustomSwiper.vue';
</script>

<style scoped></style>
