import type { Podcast } from '~~/services/types/podcast.type';

// Элемент <audio> живёт вне компонентов (один на всё приложение на клиенте),
// поэтому воспроизведение не прерывается при переходах между страницами Nuxt.
let audio: HTMLAudioElement | null = null;

/** Адрес аудио: загруженный в Silo файл либо прямая ссылка (моковые данные) */
export const podcastAudioSrc = (podcast?: Podcast | null): string => {
  if (!podcast) return '';
  return podcast.audio?.path || podcast.audioUrl || '';
};

/**
 * Глобальный аудио-плеер подкастов.
 *
 * Реактивное состояние («что играет» / «играет ли») — в useState с общим ключом:
 * его видят и карточки подкастов, и плавающий плеер в шапке страницы.
 */
export const usePodcastPlayer = () => {
  const current = useState<Podcast | null>('podcast-current', () => null);
  const isPlaying = useState<boolean>('podcast-playing', () => false);

  const ensureAudio = (): HTMLAudioElement | null => {
    if (import.meta.server) return null;
    if (audio) return audio;

    audio = new Audio();
    audio.preload = 'metadata';
    audio.addEventListener('play', () => {
      isPlaying.value = true;
    });
    audio.addEventListener('pause', () => {
      isPlaying.value = false;
    });
    audio.addEventListener('ended', () => {
      isPlaying.value = false;
    });
    return audio;
  };

  /** Запустить подкаст; повторный вызов по тому же подкасту — пауза/продолжить */
  const play = (podcast: Podcast) => {
    const el = ensureAudio();
    if (!el) return;

    const src = podcastAudioSrc(podcast);
    if (!src) return;

    if (current.value?.id === podcast.id && el.src) {
      if (el.paused) {
        el.play().catch(() => {});
      } else {
        el.pause();
      }
      return;
    }

    current.value = podcast;
    el.src = src;
    el.play().catch(() => {});
  };

  /** Полностью остановить воспроизведение и убрать плеер */
  const stop = () => {
    current.value = null;
    isPlaying.value = false;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  /** Пауза/продолжить текущего подкаста */
  const toggle = () => {
    const el = ensureAudio();
    if (!el || !current.value) return;
    if (el.paused) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  };

  return { current, isPlaying, play, stop, toggle };
};
