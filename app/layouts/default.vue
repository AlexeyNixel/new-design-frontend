<script setup lang="ts"></script>

<template>
  <div class="flex flex-col min-h-screen justify-center">
    <div class="max-w-full lg:max-w-[1710px] w-full mx-auto">
      <LayoutHeader />
    </div>

    <div class="fixed bottom-0 lg:static lg:my-4 z-100">
      <MainNavigation />
    </div>

    <main class="flex-[1_0_auto]">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>

<style scoped></style>
