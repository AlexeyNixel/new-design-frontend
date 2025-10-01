<script setup lang="ts"></script>

<template>
  <div class="app-layout">
    <LayoutHeader />
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
  //margin: 0 20px;
}

.main-content {
  flex: 1 0 auto;
  width: 100%;
}
</style>
