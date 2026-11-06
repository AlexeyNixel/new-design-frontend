<template>
  <div
    class="group h-full flex flex-col gap-3 rounded-2xl bg-white p-4 sm:p-5 shadow-sm ring-1 ring-[#0d4954]/10 transition-all duration-300 hover:shadow-lg"
  >
    <div class="flex items-start gap-3">
      <!-- Кнопка воспроизведения -->
      <button
        type="button"
        class="mt-0.5 flex size-12 shrink-0 items-center justify-center rounded-full text-white shadow-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d4954]"
        :class="isCurrent ? 'bg-[#0d4954]' : 'bg-[#157486] group-hover:bg-[#0d4954]'"
        :aria-label="isCurrent && isPlayingNow ? 'Пауза' : 'Слушать'"
        :title="isCurrent && isPlayingNow ? 'Пауза' : 'Слушать'"
        @click="toggle"
      >
        <Icon
          :name="isCurrent && isPlayingNow ? 'i-heroicons-pause-20-solid' : 'i-heroicons-play-20-solid'"
          class="size-6"
        />
      </button>

      <div class="min-w-0 flex-1">
        <h3
          class="text-base font-bold leading-snug text-gray-900 line-clamp-2"
        >
          {{ podcast.title }}
        </h3>
        <p
          v-if="podcast.description"
          class="mt-1 text-sm leading-snug text-gray-500 line-clamp-3"
        >
          {{ podcast.description }}
        </p>

        <!-- Длительность: из API, иначе — из метаданных аудио -->
        <p
          class="mt-2 inline-flex items-center gap-1.5 text-xs font-medium tabular-nums text-gray-500"
        >
          <Icon
            name="i-heroicons-clock-20-solid"
            class="size-4 shrink-0 text-[#157486]"
            aria-hidden="true"
          />
          <span :aria-label="duration ? `Длительность ${duration}` : undefined">
            {{ duration }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Podcast } from '~~/services/types/podcast.type';
import { eventPodcastDuration, formatDuration } from '~/utils/duration';

const props = defineProps<{
  podcast: Podcast;
}>();

const player = usePodcastPlayer();

const isCurrent = computed(() => player.current.value?.id === props.podcast.id);
const isPlayingNow = computed(() => player.isPlaying.value);

// Длительность считает клиент: читаем метаданные аудиофайла, не скачивая его целиком.
// Поле с сервера — сразу, если оно есть; иначе берём из готового кэша плеера
// или догружаем через плеер (usePodcastPlayer.durationOf).
const duration = computed(() => {
  const fromApi = formatDuration(eventPodcastDuration(props.podcast.audio?.duration));
  if (fromApi) return fromApi;

  const src = podcastAudioSrc(props.podcast);
  const known = src ? player.durations.value[src] : 0;
  return formatDuration(known);
});

// На клиенте подгружаем длительность карточки через метаданные аудио
onMounted(() => {
  void player.durationOf(props.podcast);
});

const toggle = () => {
  if (isCurrent.value) {
    player.toggle();
  }
  else {
    player.play(props.podcast);
  }
};
</script>
