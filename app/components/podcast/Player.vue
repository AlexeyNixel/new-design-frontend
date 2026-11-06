<template>
  <ClientOnly>
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="current"
        class="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2"
        role="region"
        aria-label="Плеер подкаста"
      >
        <div
          class="flex flex-col gap-2 rounded-2xl bg-[#0d4954] px-3 py-2.5 sm:px-4 text-white shadow-2xl ring-1 ring-white/10"
        >
          <div class="flex items-center gap-3">
            <!-- Обложка подкаста -->
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/15"
              aria-hidden="true"
            >
              <Icon
                name="i-heroicons-musical-note-20-solid"
                class="size-5"
              />
            </div>

            <!-- Название подкаста -->
            <div class="min-w-0 flex-1">
              <p class="text-xs font-medium text-white/60">
                Подкаст
              </p>
              <p class="truncate text-sm font-bold leading-snug">
                {{ current.title }}
              </p>
            </div>

            <!-- Назад 15 секунд -->
            <button
              type="button"
              class="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-40"
              aria-label="Перемотать на 15 секунд назад"
              title="−15 секунд"
              :disabled="!total"
              @click="skip(-15)"
            >
              <Icon
                name="i-heroicons-backward-20-solid"
                class="size-5"
              />
            </button>

            <!-- Пауза / воспроизведение -->
            <button
              type="button"
              class="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-[#0d4954] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              :aria-label="isPlaying ? 'Пауза' : 'Продолжить'"
              :title="isPlaying ? 'Пауза' : 'Продолжить'"
              @click="toggle"
            >
              <Icon
                :name="isPlaying ? 'i-heroicons-pause-20-solid' : 'i-heroicons-play-20-solid'"
                class="size-5"
              />
            </button>

            <!-- Вперёд 15 секунд -->
            <button
              type="button"
              class="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-40"
              aria-label="Перемотать на 15 секунд вперёд"
              title="+15 секунд"
              :disabled="!total"
              @click="skip(15)"
            >
              <Icon
                name="i-heroicons-forward-20-solid"
                class="size-5"
              />
            </button>

            <!-- Закрыть плеер -->
            <button
              type="button"
              class="flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="Закрыть плеер"
              title="Закрыть плеер"
              @click="stop"
            >
              <Icon
                name="i-heroicons-stop-20-solid"
                class="size-4"
              />
            </button>
          </div>

          <!-- Прогресс и счётчик времени: сколько идёт и сколько всего -->
          <div class="flex items-center gap-3">
            <span class="w-10 shrink-0 text-right text-xs font-medium tabular-nums text-white/80">
              {{ formatDuration(elapsed) || '0:00' }}
            </span>
            <input
              type="range"
              class="podcast-seek min-w-0 flex-1 cursor-pointer"
              :style="seekStyle"
              :min="0"
              :max="total || 0"
              :step="1"
              :value="Math.min(elapsed, total || elapsed)"
              :disabled="!total"
              :aria-valuetext="`${formatDuration(elapsed) || '0:00'} из ${formatDuration(total) || '0:00'}`"
              aria-label="Перемотка подкаста"
              @input="onSeek"
            >
            <span class="w-10 shrink-0 text-xs font-medium tabular-nums text-white/80">
              {{ formatDuration(total) || '--:--' }}
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </ClientOnly>
</template>

<script setup lang="ts">
import { formatDuration } from '~/utils/duration';

const { current, isPlaying, currentTime, duration, seek, skip, stop, toggle } = usePodcastPlayer();

// Длительность может быть неизвестна до загрузки метаданных — тогда полоса неактивна
const total = computed(() => Math.floor(duration.value || 0));
const elapsed = computed(() => Math.floor(currentTime.value || 0));

// Заливка полосы до бегунка — через CSS-переменную, без вычисления стилей вручную
const seekStyle = computed(() => ({
  '--seek-progress': total.value ? String(Math.min(elapsed.value / total.value, 1)) : '0',
}));

const onSeek = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value);
  seek(value);
};
</script>

<style scoped>
/* Полоса прогресса: серый фон, прошедшая часть — белая */
.podcast-seek {
  appearance: none;
  height: 4px;
  border-radius: 9999px;
  background:
    linear-gradient(to right, #fff calc(var(--seek-progress, 0) * 100%), rgb(255 255 255 / 0.25) 0);
  accent-color: #fff;
}

.podcast-seek:disabled {
  opacity: 0.5;
}

.podcast-seek::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 9999px;
  background: #fff;
  border: none;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.35);
}

.podcast-seek::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border: none;
  border-radius: 9999px;
  background: #fff;
}

.podcast-seek:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 4px;
}
</style>
