import type { File } from './file.type';

/** Слайд главной в формате новой админки (admin.infomania.ru → /slide/admin/<id>) */
export interface Slide {
  id: string;
  createdAt: string;
  isDeleted: boolean;
  /** Порядок из админки, по возрастанию */
  slideOrder: number;
  postId: string | null;
  imageFileId: string;
  /** Внешняя ссылка, если слайд не привязан к новости (может быть пустой строкой) */
  url: string;
  image: File;
  post: { id: string; slug: string; title?: string } | null;
}
