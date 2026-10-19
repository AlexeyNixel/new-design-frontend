import type { BookCollections } from '~~/services/types/book.type';

/**
 * Подборки, которые стоит показывать посетителю: есть хотя бы одна книга.
 * Старый API не отдаёт bookCount — тогда не показываем ничего,
 * чтобы не было пустых карточек «0 книг».
 */
export const nonEmptyCollections = (list?: BookCollections[] | null) =>
  (list ?? []).filter(collection => (collection.bookCount ?? 0) > 0);
