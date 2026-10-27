import type { File } from '~~/services/types/file.type';

/**
 * Выставка — HTML-пакет в MinIO: `path` ведёт на `.../index.html`,
 * рядом лежит обложка `cover.jpg` (на ней уже есть название, тип и возраст).
 */
export const exhibitionCover = (exhibition: Pick<File, 'path'>) =>
  exhibition.path.replace(/index\.html$/, 'cover.jpg');

/** Слаг — имя папки пакета: `/dev/exhibitions/v_kohl_sep_oct/index.html` → `v_kohl_sep_oct` */
export const exhibitionSlug = (exhibition: Pick<File, 'path'>) =>
  exhibition.path.split('/').at(-2) ?? '';

/** Страница выставки на сайте: пакет открывается во фрейме, в шапке и подвале сайта */
export const exhibitionPage = (exhibition: Pick<File, 'path'>) =>
  `/page/exhibition/${exhibitionSlug(exhibition)}`;
