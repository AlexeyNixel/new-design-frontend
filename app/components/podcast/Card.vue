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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Podcast } from '~~/services/types/podcast.type';

const props = defineProps<{
  podcast: Podcast;
}>();

const player = usePodcastPlayer();

const isCurrent = computed(() => player.current.value?.id === props.podcast.id);
const isPlayingNow = computed(() => player.isPlaying.value);

const toggle = () => {
  if (isCurrent.value) {
    player.toggle();
  } else {
    player.play(props.podcast);
  }
};
</script>

<style scoped></style>
