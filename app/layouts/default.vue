<script setup lang="ts"></script>

<template>
  <div class="flex flex-col min-h-screen">
    <div class="base-layout w-full mx-auto">
      <LayoutHeader />
    </div>

    <div class="my-4">
      <PagesComponentsIndexMainNavigation />
    </div>

    <main class="flex-[1_0_auto]">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>

<style scoped>
.base-layout {
  max-width: 600px;
}

@media (min-width: 1024px) {
  .base-layout {
    max-width: 1710px;
    width: 95%;
  }
}
</style>
