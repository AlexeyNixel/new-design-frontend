<template>
  <div class="dev-section">
    <label class="dev-toggle">
      <input
        v-model="outline"
        type="checkbox"
      >
      <span>Outline всех элементов</span>
    </label>
    <label class="dev-toggle">
      <input
        v-model="guides"
        type="checkbox"
      >
      <span>Границы контейнера / колонки</span>
    </label>

    <label class="dev-row">
      <span>Колонок</span>
      <input
        v-model.number="columns"
        type="number"
        min="1"
        max="24"
      >
    </label>
    <label class="dev-row">
      <span>Max-width, px</span>
      <input
        v-model.number="maxWidth"
        type="number"
        min="320"
        step="20"
      >
    </label>

    <div class="dev-info">
      <div>
        <span>Вьюпорт</span><b>{{ vw }}×{{ vh }}</b>
      </div>
      <div>
        <span>Breakpoint</span><b>{{ breakpoint }}</b>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { outline, guides, columns, maxWidth } = useDevTools();

const vw = ref(0);
const vh = ref(0);

function onResize() {
  vw.value = window.innerWidth;
  vh.value = window.innerHeight;
}

onMounted(() => {
  onResize();
  window.addEventListener('resize', onResize);
});
onUnmounted(() => window.removeEventListener('resize', onResize));

// Брейкпоинты из app/assets/css/theme.css
const BREAKPOINTS: [string, number][] = [
  ['3xl', 1710],
  ['2xl', 1440],
  ['xl', 1280],
  ['lg', 1024],
  ['md', 768],
  ['sm', 640],
  ['xs', 375],
];

const breakpoint = computed(() => {
  for (const [name, min] of BREAKPOINTS) {
    if (vw.value >= min) return name;
  }
  return '<xs';
});
</script>
