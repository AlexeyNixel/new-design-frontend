import type { Podcast } from '~~/services/types/podcast.type';

// Элемент <audio> живёт вне компонентов (иначе при смене страницы он бы пропадал),
// поэтому храним его в модульной переменной, а не в состоянии Nuxt.
let audio: HTMLAudioElement | null = null;

/** Адрес аудио: относительный путь в хранилище либо полный (резервный внешний) */
export const podcastAudioSrc = (podcast?: Podcast | null): string => {
  if (!podcast) return '';
  return podcast.audio?.path || podcast.audioUrl || '';
};

/** Длительность трека в секундах: сначала из метаданных, иначе — из API */
export const podcastDurationSeconds = (podcast?: Podcast | null): number => {
  if (!podcast) return 0;
  const fromApi = Number(podcast.audio?.duration);
  if (Number.isFinite(fromApi) && fromApi > 0) return fromApi;
  return 0;
};

/**
 * Глобальный аудио-плеер подкастов.
 *
 * Состояние (какой трек играет, идёт ли воспроизведение) — в useState, чтобы одно и то же
 * показывали карточки и плавающий плеер. Текущее время и длительность — тоже useState:
 * они меняются часто, компоненты подписываются через computed.
 */
export const usePodcastPlayer = () => {
  const current = useState<Podcast | null>('podcast-current', () => null);
  const isPlaying = useState<boolean>('podcast-playing', () => false);
  const currentTime = useState<number>('podcast-time', () => 0);
  const duration = useState<number>('podcast-duration', () => 0);

  /**
   * Длительности, прочитанные из метаданных аудио: ключ — адрес файла.
   * Чтобы карточки знали время до запуска плеера, каждый звук один раз
   * открывается в отдельном <audio preload="metadata"> — скачивается только заголовок файла.
   */
  const durations = useState<Record<string, number>>('podcast-durations', () => ({}));

  const rememberDuration = (src: string, seconds: number) => {
    if (!src || !Number.isFinite(seconds) || seconds <= 0) return;
    const value = Math.floor(seconds);
    if (durations.value[src] === value) return;
    durations.value = { ...durations.value, [src]: value };
  };

  /** Узнать длительность подкаста до его запуска (клиент) */
  const durationOf = (podcast?: Podcast | null): Promise<number> => {
    if (import.meta.server) return Promise.resolve(0);

    const src = podcastAudioSrc(podcast);
    const known = durations.value[src];
    if (!src || known) return Promise.resolve(known ?? 0);

    return new Promise((resolve) => {
      const probe = new Audio();
      probe.preload = 'metadata';
      const finish = (value: number) => {
        probe.removeAttribute('src');
        probe.load();
        resolve(value);
      };
      probe.addEventListener('loadedmetadata', () => {
        const value = probe.duration;
        if (!Number.isFinite(value) || value <= 0) {
          finish(0);
          return;
        }
        rememberDuration(src, value);
        finish(Math.floor(value));
      });
      probe.addEventListener('error', () => finish(0));
      probe.src = src;
      probe.load();
    });
  };

  const syncDuration = () => {
    const meta = audio?.duration;
    const total = Number.isFinite(meta) && (meta ?? 0) > 0
      ? Math.floor(meta as number)
      : podcastDurationSeconds(current.value);
    duration.value = total;
    if (audio?.src) rememberDuration(audio.src, total);
  };

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
      currentTime.value = audio?.duration ?? duration.value;
    });
    audio.addEventListener('loadedmetadata', () => {
      syncDuration();
    });
    audio.addEventListener('durationchange', () => {
      syncDuration();
    });
    audio.addEventListener('timeupdate', () => {
      currentTime.value = audio?.currentTime ?? 0;
    });
    return audio;
  };

  /** Запустить подкаст; повторный вызов того же трека — пауза/продолжение */
  const play = (podcast: Podcast) => {
    const el = ensureAudio();
    if (!el) return;

    const src = podcastAudioSrc(podcast);
    if (!src) return;

    if (current.value?.id === podcast.id && el.src) {
      if (el.paused) {
        el.play().catch(() => {});
      }
      else {
        el.pause();
      }
      return;
    }

    current.value = podcast;
    currentTime.value = 0;
    duration.value = podcastDurationSeconds(podcast);
    el.src = src;
    el.play().catch(() => {});
  };

  /** Полностью остановить воспроизведение и свернуть плеер */
  const stop = () => {
    current.value = null;
    isPlaying.value = false;
    currentTime.value = 0;
    duration.value = 0;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  /** Пауза/продолжить текущий трек */
  const toggle = () => {
    const el = ensureAudio();
    if (!el || !current.value) return;
    if (el.paused) {
      el.play().catch(() => {});
    }
    else {
      el.pause();
    }
  };

  /** Перемотка на абсолютную секунду */
  const seek = (seconds: number) => {
    const el = ensureAudio();
    if (!el || !Number.isFinite(seconds)) return;
    const max = Number.isFinite(el.duration) && el.duration > 0
      ? el.duration
      : duration.value;
    const next = Math.min(Math.max(0, seconds), max || seconds);
    el.currentTime = next;
    currentTime.value = next;
  };

  /** Перемотка вперёд/назад на N секунд */
  const skip = (delta: number) => {
    seek((audio?.currentTime ?? currentTime.value) + delta);
  };

  const durationSeconds = computed(() => duration.value || podcastDurationSeconds(current.value));

  return {
    current,
    isPlaying,
    currentTime,
    duration: durationSeconds,
    currentDuration: durationSeconds,
    durations,
    durationOf,
    play,
    stop,
    toggle,
    seek,
    skip,
  };
};
