<template>
  <ClientOnly>
    <Teleport to="body">
      <div
        v-if="guides"
        class="dev-grid-overlay"
        :style="{ maxWidth: maxWidth + 'px' }"
      >
        <div
          v-for="n in columns"
          :key="n"
          class="dev-grid-col"
        />
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
const { guides, columns, maxWidth } = useDevTools();
</script>

<style>
.dev-grid-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  padding: 0 16px;
  display: flex;
  gap: 24px;
  pointer-events: none;
  z-index: 99998;
}
.dev-grid-col {
  flex: 1;
  background: rgba(117, 146, 220, 0.14);
  border-left: 1px solid rgba(117, 146, 220, 0.35);
  border-right: 1px solid rgba(117, 146, 220, 0.35);
}
</style>
