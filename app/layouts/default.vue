<script setup lang="ts"></script>

<template>
  <div class="flex flex-col min-h-screen">
    <div class="max-w-[1710px] w-full mx-auto">
      <LayoutHeader />
    </div>
    <PagesComponentsIndexMainNavigation />
    <main class="flex-[1_0_auto] max-w-[1710px] mx-auto">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>

<style scoped></style>
