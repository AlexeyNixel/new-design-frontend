import type { File } from './file.type';

/** Статус экземпляра игры (наличие в фонде). */
export type GameStatus
  = | 'IN_STOCK'
    | 'ON_HANDS'
    | 'TEMPORARILY_UNAVAILABLE'
    | 'WRITTEN_OFF'
    | 'LOST'
    | 'DAMAGED';

export interface GameGenre {
  id: string;
  tag: string;
  title: string;
}

export interface GameSeries {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  createdAt: string;
}

export interface GameImage {
  id: string;
  gameId: string;
  fileId: string;
  /** Порядок показа в галерее, 0 — первая (обложка). */
  order: number;
  file: File;
}

export interface Game {
  id: string;
  slug: string;
  /** id игры в старой БД (gm120, 393203, gl-178 и т.п.) — только для трассируемости. */
  externalId: string | null;
  title: string;
  shortDescription: string | null;
  description: string | null;
  playerMin: number | null;
  playerMax: number | null;
  playerAge: number | null;
  /** Длительность партии в минутах. durationMax=null — открытый диапазон ("20+ минут"). */
  durationMin: number | null;
  durationMax: number | null;
  year: number | null;
  status: GameStatus;
  place: string | null;
  comment: string | null;
  isDeleted: boolean;
  /** Ссылка на видео (YouTube/VK/RuTube и т.п.), не файл. */
  videoUrl: string | null;
  seriesId: string | null;
  rulesFileId: string | null;
  createdAt: string;
  updatedAt: string;
  /** До 3 изображений, отсортированы по order. */
  images: GameImage[];
  genres: Array<{ genre: GameGenre }>;
  series: GameSeries | null;
  rulesFile: File | null;
}

/** Query-параметры GET /games — см. GamesController/GamesService на бэке. */
export interface GameQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  /** id жанров (GameGenre.id) — все перечисленные должны присутствовать у игры. */
  genres?: string[];
  /** Игра подходит, если playerMin <= players <= playerMax. */
  players?: number;
  ageMin?: number;
  ageMax?: number;
  /** Верхняя граница длительности партии в минутах. */
  maxDuration?: number;
  yearFrom?: number;
  yearTo?: number;
  /** Другие игры той же серии — для блока "Смотрите также". */
  seriesId?: string;
  /** Скрыть списанные/утерянные/повреждённые игры. */
  availableOnly?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
