<template>
  <div class="dev-section">
    <div class="dev-mode">
      <button
        :class="{ on: mode === 'base' }"
        @click="mode = 'base'"
      >
        База
      </button>
      <button
        :class="{ on: mode === 'manual' }"
        @click="mode = 'manual'"
      >
        Вручную
      </button>
    </div>

    <div
      v-if="mode === 'base'"
      class="dev-field-group"
    >
      <label class="dev-row">
        <span>Основной цвет (500)</span>
        <input
          type="color"
          :value="theme.base.value"
          @input="onBase(($event.target as HTMLInputElement).value)"
        >
      </label>
      <input
        class="dev-hex"
        :value="theme.base.value"
        @change="onBase(($event.target as HTMLInputElement).value)"
      >
      <div class="dev-presets">
        <button
          v-for="preset in PRESETS"
          :key="preset"
          type="button"
          class="dev-preset"
          :class="{ 'dev-preset--active': theme.base.value === preset }"
          :style="{ background: preset }"
          :title="preset"
          @click="onBase(preset)"
        />
      </div>
      <div class="dev-swatches">
        <div
          v-for="step in theme.PRIMARY_STEPS"
          :key="step"
          class="dev-swatch"
          :style="{ background: previewScale[step] }"
          :title="`${step}: ${previewScale[step]}`"
        />
      </div>
    </div>

    <div
      v-else
      class="dev-field-group"
    >
      <label
        v-for="step in theme.PRIMARY_STEPS"
        :key="step"
        class="dev-row"
      >
        <span>primary-{{ step }}</span>
        <input
          type="color"
          :value="theme.currentValue(theme.primaryVar(step))"
          @input="
            theme.setVar(
              theme.primaryVar(step),
              ($event.target as HTMLInputElement).value,
            )
          "
        >
      </label>
      <label class="dev-row">
        <span>link-500</span>
        <input
          type="color"
          :value="theme.currentValue(theme.LINK_VAR)"
          @input="
            theme.setVar(
              theme.LINK_VAR,
              ($event.target as HTMLInputElement).value,
            )
          "
        >
      </label>
    </div>

    <div class="dev-actions">
      <button @click="theme.reset()">
        Сбросить
      </button>
      <button @click="showExport = !showExport">
        Экспорт CSS
      </button>
    </div>

    <div
      v-if="showExport"
      class="dev-export"
    >
      <textarea
        readonly
        rows="8"
        :value="css"
      />
      <button @click="copy">
        {{ copied ? 'Скопировано' : 'Скопировать' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { generateScale } from '~/utils/colorScale';

const theme = useDevTheme();

const PRESETS = ['#ff3700', '#ff9000', '#0d3696'];

const mode = ref<'base' | 'manual'>('base');
const showExport = ref(false);
const copied = ref(false);

const previewScale = computed(() => generateScale(theme.base.value));
const css = computed(() => theme.exportCss());

function onBase(value: string) {
  theme.applyBase(value);
}

async function copy() {
  try {
    await navigator.clipboard.writeText(css.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
  }
  catch {
    /* clipboard недоступен */
  }
}
</script>
