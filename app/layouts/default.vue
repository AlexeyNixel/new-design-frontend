<script setup lang="ts"></script>

<template>
  <div class="app-layout">
    <LayoutHeader />
    <MainNavigation />
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
  flex: 1 0 auto;
  width: 100%;
  margin: 0 80px;
}
</style>
