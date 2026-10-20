import type { File } from './file.type';
import type { Tag } from '~~/services/types/tag.type';

export interface Post {
  id: string;
  previewFileId: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  /** Дата мероприятия у новости-анонса (только дата); показывается вместо publishedAt */
  eventDate?: string | null;
  title: string;
  description: string;
  content: string;
  /** Текст поста без HTML-разметки */
  contentText?: string;
  slug: string;
  isPublished: boolean;
  isDeleted: boolean;
  departmentId: string;
  isPinned: boolean;
  preview: File;
  tags: [{ tag: Tag }];
  department: {
    title: string;
    id: string;
  };
}
