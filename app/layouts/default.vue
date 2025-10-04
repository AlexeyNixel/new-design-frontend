<script setup lang="ts"></script>

<template>
  <div class="app-layout">
    <div class="max-w-[1710px] w-full mx-auto">
      <LayoutHeader />
    </div>
    <PagesComponentsIndexMainNavigation />
    <main class="main-content">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex-direction: column;
  flex: 1 0 auto;
  margin: 0 auto;
  max-width: 1710px;
}
</style>
