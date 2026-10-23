<template>
  <section
    v-if="settings.enabled"
    class="border-b-2 border-black bg-white text-black"
    aria-label="Настройки версии для слабовидящих"
  >
    <!-- На телефоне настройки свёрнуты, иначе панель занимает весь экран -->
    <div class="max-w-[1710px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-2 lg:hidden">
      <button
        type="button"
        class="a11y-btn px-3 w-auto"
        :aria-expanded="expanded"
        aria-controls="a11y-settings"
        @click="expanded = !expanded"
      >
        {{ expanded ? 'Скрыть настройки' : 'Настройки для слабовидящих' }}
      </button>
      <button
        type="button"
        class="a11y-btn px-3 w-auto"
        @click="disable"
      >
        Обычная версия
      </button>
    </div>

    <div
      id="a11y-settings"
      class="max-w-[1710px] mx-auto px-4 sm:px-6 lg:px-8 pb-3 lg:py-3 flex-wrap items-center gap-x-6 gap-y-3"
      :class="expanded ? 'flex' : 'hidden lg:flex'"
    >
      <!-- Размер шрифта -->
      <div
        class="a11y-group"
        role="group"
        aria-label="Размер шрифта"
      >
        <span class="a11y-label">Шрифт</span>
        <button
          v-for="(size, i) in A11Y_FONT_SIZES"
          :key="size"
          type="button"
          class="a11y-btn"
          :class="{ 'a11y-btn--on': settings.fontSize === size }"
          :aria-pressed="settings.fontSize === size"
          :aria-label="FONT_LABELS[size]"
          :title="FONT_LABELS[size]"
          :style="{ fontSize: `${1 + i * 0.25}rem` }"
          @click="update({ fontSize: size })"
        >
          А
        </button>
      </div>

      <!-- Цветовая схема: образцы держат свои цвета в любой схеме (класс a11y-keep) -->
      <div
        class="a11y-group"
        role="group"
        aria-label="Цветовая схема"
      >
        <span class="a11y-label">Цвет</span>
        <button
          v-for="scheme in A11Y_SCHEMES"
          :key="scheme"
          type="button"
          class="a11y-btn a11y-keep"
          :class="{ 'a11y-btn--on': settings.scheme === scheme }"
          :aria-pressed="settings.scheme === scheme"
          :aria-label="SCHEMES[scheme].label"
          :title="SCHEMES[scheme].label"
          :style="{ backgroundColor: SCHEMES[scheme].bg, color: SCHEMES[scheme].fg, borderColor: SCHEMES[scheme].fg }"
          @click="update({ scheme })"
        >
          Ц
        </button>
      </div>

      <!-- Изображения -->
      <div
        class="a11y-group"
        role="group"
        aria-label="Изображения"
      >
        <span class="a11y-label">Изображения</span>
        <button
          type="button"
          class="a11y-btn px-3 w-auto"
          :aria-pressed="!settings.images"
          @click="update({ images: !settings.images })"
        >
          {{ settings.images ? 'Выключить' : 'Включить' }}
        </button>
      </div>

      <!-- Интервалы -->
      <div
        class="a11y-group"
        role="group"
        aria-label="Межбуквенный интервал"
      >
        <span class="a11y-label">Интервал</span>
        <button
          v-for="spacing in A11Y_SPACINGS"
          :key="spacing"
          type="button"
          class="a11y-btn px-3 w-auto"
          :class="{ 'a11y-btn--on': settings.letterSpacing === spacing }"
          :aria-pressed="settings.letterSpacing === spacing"
          @click="update({ letterSpacing: spacing })"
        >
          {{ SPACING_LABELS[spacing] }}
        </button>
      </div>

      <div
        class="a11y-group"
        role="group"
        aria-label="Межстрочный интервал"
      >
        <span class="a11y-label">Строки</span>
        <button
          v-for="spacing in A11Y_SPACINGS"
          :key="spacing"
          type="button"
          class="a11y-btn px-3 w-auto"
          :class="{ 'a11y-btn--on': settings.lineHeight === spacing }"
          :aria-pressed="settings.lineHeight === spacing"
          @click="update({ lineHeight: spacing })"
        >
          {{ SPACING_LABELS[spacing] }}
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-2 lg:ml-auto">
        <button
          type="button"
          class="a11y-btn px-3 w-auto"
          @click="reset"
        >
          Сбросить настройки
        </button>
        <!-- На телефоне эта кнопка уже есть в свёрнутой строке выше.
             Видимость — на обёртке: display у .a11y-btn перебил бы утилиту hidden -->
        <span class="hidden lg:contents">
          <button
            type="button"
            class="a11y-btn px-3 w-auto font-bold"
            @click="disable"
          >
            Обычная версия сайта
          </button>
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { A11yFontSize, A11yScheme, A11ySpacing } from '~/composables/useAccessibility';

const { settings, update, reset, disable } = useAccessibility();

/** Развёрнуты ли настройки на телефоне (на десктопе видны всегда) */
const expanded = ref(false);

const FONT_LABELS: Record<A11yFontSize, string> = {
  normal: 'Обычный шрифт',
  large: 'Крупный шрифт',
  xlarge: 'Очень крупный шрифт',
};

/** Сочетания цветов из ГОСТ Р 52872-2019 */
const SCHEMES: Record<A11yScheme, { label: string; bg: string; fg: string }> = {
  bw: { label: 'Чёрным по белому', bg: '#fff', fg: '#000' },
  wb: { label: 'Белым по чёрному', bg: '#000', fg: '#fff' },
  blue: { label: 'Тёмно-синим по голубому', bg: '#9dd1ff', fg: '#063462' },
  beige: { label: 'Коричневым по бежевому', bg: '#f7f3d6', fg: '#4d4b43' },
  green: { label: 'Зелёным по тёмно-коричневому', bg: '#3b2716', fg: '#a9e44d' },
};

const SPACING_LABELS: Record<A11ySpacing, string> = {
  normal: 'Обычный',
  wide: 'Средний',
  wider: 'Большой',
};
</script>

<style scoped>
.a11y-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
}

.a11y-label {
  margin-right: 0.25rem;
  font-size: 0.875rem;
  font-weight: 700;
}

.a11y-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.75rem;
  height: 2.75rem;
  border: 2px solid currentColor;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
}

/* Выбранная настройка — толстая рамка и подчёркивание, а не цвет:
   в любой цветовой схеме она остаётся заметной */
.a11y-btn--on {
  outline: 3px solid currentColor;
  outline-offset: 2px;
  text-decoration: underline;
  text-underline-offset: 0.2em;
}
</style>
