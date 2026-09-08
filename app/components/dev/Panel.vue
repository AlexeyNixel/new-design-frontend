<template>
  <div class="dev-root">
    <button
      type="button"
      class="dev-fab"
      :class="{ 'dev-fab--active': open }"
      title="Dev Tools (Ctrl+Shift+D)"
      @click="toggle"
    >
      <Icon
        :name="open ? 'mingcute:close-line' : 'mingcute:settings-3-line'"
        class="dev-fab__icon"
      />
    </button>

    <Transition name="dev-slide">
      <section
        v-if="open"
        class="dev-panel"
      >
        <header class="dev-panel__tabs">
          <button
            v-for="t in tabs"
            :key="t.id"
            type="button"
            class="dev-tab"
            :class="{ 'dev-tab--active': tab === t.id }"
            @click="tab = t.id"
          >
            {{ t.label }}
          </button>
        </header>

        <div class="dev-panel__body">
          <DevColorsTab v-if="tab === 'colors'" />
          <DevGridTab v-else-if="tab === 'grid'" />
          <DevPageTab v-else />
        </div>
      </section>
    </Transition>

    <DevGridOverlay />
  </div>
</template>

<script setup lang="ts">
import type { DevTab } from '~/composables/useDevTools';

const { open, tab, toggle, init } = useDevTools();

const tabs: { id: DevTab; label: string }[] = [
  { id: 'colors', label: 'Цвета' },
  { id: 'grid', label: 'Сетка' },
  { id: 'page', label: 'Страница' },
];

// Восстановление состояния и слушатели — только после гидрации,
// чтобы серверный и клиентский первый рендер совпадали.
onMounted(init);
</script>

<!-- Стили намеренно не scoped: общие классы .dev-* используются во всех табах.
     Панель монтируется только в dev, префикс .dev- изолирует от стилей сайта. -->
<style>
.dev-root {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 99999;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 13px;
  line-height: 1.4;
  color: #e8e8ea;
}

.dev-fab {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1f2937;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  transition:
    transform 0.15s ease,
    background 0.15s ease;
}
.dev-fab:hover {
  transform: translateY(-2px);
}
.dev-fab--active {
  background: #7592dc;
}
.dev-fab__icon {
  width: 20px;
  height: 20px;
}

.dev-panel {
  position: absolute;
  right: 0;
  bottom: 56px;
  width: 360px;
  max-width: calc(100vw - 32px);
  max-height: min(80vh, 640px);
  display: flex;
  flex-direction: column;
  background: #111827;
  border: 1px solid #2b3648;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
}

.dev-panel__tabs {
  display: flex;
  border-bottom: 1px solid #2b3648;
  flex: none;
}
.dev-tab {
  flex: 1;
  padding: 10px 8px;
  border: none;
  background: transparent;
  color: #9aa4b2;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.dev-tab--active {
  color: #fff;
  box-shadow: inset 0 -2px 0 #7592dc;
}

.dev-panel__body {
  padding: 14px;
  overflow-y: auto;
}

.dev-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dev-mode {
  display: flex;
  gap: 4px;
  background: #0b1220;
  border-radius: 8px;
  padding: 3px;
}
.dev-mode button {
  flex: 1;
  padding: 6px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #9aa4b2;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.dev-mode button.on {
  background: #1f2937;
  color: #fff;
}

.dev-field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dev-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.dev-row > span {
  color: #9aa4b2;
}
.dev-row input[type='color'] {
  width: 44px;
  height: 26px;
  padding: 0;
  border: 1px solid #2b3648;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
}
.dev-row input[type='number'] {
  width: 80px;
}

.dev-hex,
.dev-row input[type='number'] {
  background: #0b1220;
  border: 1px solid #2b3648;
  border-radius: 6px;
  color: #e8e8ea;
  padding: 5px 8px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
}

.dev-swatches {
  display: flex;
  border-radius: 6px;
  overflow: hidden;
}
.dev-swatch {
  flex: 1;
  height: 26px;
}

.dev-presets {
  display: flex;
  gap: 8px;
}
.dev-preset {
  flex: 1;
  height: 28px;
  border: 1px solid #2b3648;
  border-radius: 6px;
  cursor: pointer;
  padding: 0;
}
.dev-preset--active {
  outline: 2px solid #fff;
  outline-offset: 1px;
}

.dev-actions {
  display: flex;
  gap: 8px;
}
.dev-actions button,
.dev-export button {
  flex: 1;
  padding: 7px 10px;
  border: 1px solid #2b3648;
  border-radius: 6px;
  background: #1f2937;
  color: #e8e8ea;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.dev-actions button:hover,
.dev-export button:hover {
  background: #263141;
}

.dev-export {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dev-export textarea {
  width: 100%;
  background: #0b1220;
  border: 1px solid #2b3648;
  border-radius: 6px;
  color: #e8e8ea;
  padding: 8px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  resize: vertical;
}

.dev-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.dev-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: #0b1220;
  border-radius: 8px;
  padding: 8px 10px;
}
.dev-info > div {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.dev-info span {
  color: #9aa4b2;
}
.dev-info b {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-weight: 600;
  text-align: right;
  word-break: break-all;
}

.dev-subhead {
  color: #9aa4b2;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.dev-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  max-height: 160px;
  overflow-y: auto;
}
.dev-list li {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
}
.dev-list li span {
  word-break: break-all;
}
.dev-list li b {
  color: #9aa4b2;
  flex: none;
}
.dev-muted {
  color: #6b7280;
}

.dev-section details summary {
  cursor: pointer;
  color: #9aa4b2;
}
.dev-section pre {
  margin: 6px 0 0;
  padding: 8px;
  background: #0b1220;
  border-radius: 6px;
  font-size: 11px;
  overflow-x: auto;
}

.dev-slide-enter-active,
.dev-slide-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.dev-slide-enter-from,
.dev-slide-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
