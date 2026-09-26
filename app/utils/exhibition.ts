import type { File } from '~~/services/types/file.type';

/**
 * Выставка — HTML-пакет в MinIO: `path` ведёт на `.../index.html`,
 * рядом лежит обложка `cover.jpg` (на ней уже есть название, тип и возраст).
 */
export const exhibitionCover = (exhibition: Pick<File, 'path'>) =>
  exhibition.path.replace(/index\.html$/, 'cover.jpg');

/** Адрес самой выставки (открывается в новой вкладке — это полноэкранный HTML) */
export const exhibitionUrl = (exhibition: Pick<File, 'path'>) => exhibition.path;
