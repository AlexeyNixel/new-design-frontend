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
          class="flex items-center gap-3 rounded-2xl bg-[#0d4954] px-3 py-2.5 sm:px-4 text-white shadow-2xl ring-1 ring-white/10"
        >
          <!-- Иконка аудио -->
          <div
            class="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/15"
            aria-hidden="true"
          >
            <Icon
              :name="isPlaying ? 'i-heroicons-musical-note-20-solid' : 'i-heroicons-musical-note-20-solid'"
              class="size-5"
            />
          </div>

          <!-- Название подкаста -->
          <div class="min-w-0 flex-1">
            <p class="text-xs font-medium text-white/60">Подкаст</p>
            <p class="truncate text-sm font-bold leading-snug">
              {{ current.title }}
            </p>
          </div>

          <!-- Пауза / продолжить -->
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

          <!-- Кнопка выключения -->
          <button
            type="button"
            class="flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="Выключить плеер"
            title="Выключить плеер"
            @click="stop"
          >
            <Icon
              name="i-heroicons-stop-20-solid"
              class="size-4"
            />
            <span class="hidden sm:inline">Выключить</span>
          </button>
        </div>
      </div>
    </Transition>
  </ClientOnly>
</template>

<script setup lang="ts">
const { current, isPlaying, stop, toggle } = usePodcastPlayer();
</script>

<style scoped></style>
