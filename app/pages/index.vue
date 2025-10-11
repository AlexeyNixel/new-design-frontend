<template>
  <div class="flex flex-col gap-5">
    <CommonContentContainer>
      <div class="grid grid-cols-5 gap-5">
        <div class="col-span-4">
          <PagesComponentsIndexMainCarousel class="h-full" />
        </div>

        <div class="col-span-1 flex flex-col gap-5 w-full">
          <div class="bg-white rounded-xl shadow p-4 w-full h-1/3">
            <PagesComponentsIndexInfoBanner />
          </div>
          <div class="bg-white p-4 rounded-xl shadow flex-1 h-2/3">
            <PagesComponentsIndexEventCalendar />
          </div>
        </div>
      </div>
      <div class="my-5">
        <PagesComponentsIndexCatalogSearch class="w-full" />
      </div>
    </CommonContentContainer>

    <CommonContentContainer title="Книги" bgGray>
      <PagesComponentsIndexBookShelf />
    </CommonContentContainer>

    <CommonContentContainer title="События">
      <PagesComponentsIndexNewsCarousel />
    </CommonContentContainer>

    <CommonContentContainer bgGray>
      <div class="flex gap-5">
        <CommonContentContainer title="Викторины" bgGray>
          <PagesComponentsIndexExhibitionContent />
        </CommonContentContainer>
        <CommonContentContainer title="Викторины" bgGray>
          <PagesComponentsIndexExhibitionContent />
        </CommonContentContainer>
      </div>
    </CommonContentContainer>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
