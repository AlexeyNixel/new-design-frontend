import type { File } from './file.type';

export interface Book {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  previewFileId: string;
  createdAt: string;
  isDeleted: boolean;
  place: string;
  isVideo: boolean;
  litresLink?: string;
  preview: File;
  /** Подборки книги — только на странице книги */
  collections?: Pick<BookCollections, 'id' | 'slug' | 'label' | 'isDeleted'>[];
}

export interface BookCollections {
  id: string;
  /** Адрес страницы подборки: /books/collections/<slug> */
  slug: string;
  label: string;
  /** Пара предложений о подборке */
  description?: string | null;
  isDeleted: boolean;
  previewFileId?: string | null;
  createdAt: string;
  /** Картинка для соцсетей (необязательная) */
  preview?: File | null;
  /** Число книг в подборке */
  bookCount?: number;
  /** Обложки первых книг — для веера на карточке (в списке подборок) */
  covers?: Pick<Book, 'id' | 'title' | 'preview'>[];
  /** Книги по порядку (только на странице подборки) */
  books?: Book[];
}
