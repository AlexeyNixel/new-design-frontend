import type { Podcast } from '~~/services/types/podcast.type';

// Тестовые подкасты для демонстрации вкладки «Подкасты» на главной,
// пока в админке не загружены реальные аудиофайлы. Ссылки ведут на
// общедоступные демо-треки SoundHelix (MP3).
export const MOCK_PODCASTS: Podcast[] = [
  {
    id: 'mock-podcast-1',
    title: 'Выпуск №1. Как полюбить чтение',
    description:
      'Демонстрационный подкаст. Настоящие выпуски появятся после загрузки аудиофайлов в админке.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 'mock-podcast-2',
    title: 'Выпуск №2. Новинки библиотеки',
    description:
      'Тестовая запись: показывает, что плеер продолжает играть при переходе по страницам сайта.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 'mock-podcast-3',
    title: 'Выпуск №3. Книжный клуб',
    description:
      'Ещё один демонстрационный трек. Кнопка «Выключить» останавливает воспроизведение.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];
