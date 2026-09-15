import type { File } from './file.type';

export interface ComicGenre {
  id: string;
  tag: string;
  title: string;
}

export interface ComicSeries {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  createdAt: string;
}

export interface ComicImage {
  id: string;
  comicId: string;
  fileId: string;
  /** Порядок показа в галерее, 0 — первая (обложка). */
  order: number;
  file: File;
}

export interface Comic {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: string | null;
  author: string | null;
  illustrator: string | null;
  volumeNumber: number | null;
  year: number | null;
  ageRating: number | null;
  externalLink: string | null;
  isDeleted: boolean;
  seriesId: string | null;
  createdAt: string;
  updatedAt: string;
  /** До 3 изображений, отсортированы по order. */
  images: ComicImage[];
  genres: Array<{ genre: ComicGenre }>;
  series: ComicSeries | null;
}

/** Query-параметры GET /comics — см. ComicsController/ComicsService на бэке. */
export interface ComicQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  /** id жанров (ComicGenre.id) — все перечисленные должны присутствовать у комикса. */
  genres?: string[];
  /** Верхняя граница возрастного рейтинга. */
  ageMax?: number;
  yearFrom?: number;
  yearTo?: number;
  /** Другие тома той же серии — для блока "Другие тома серии". */
  seriesId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
