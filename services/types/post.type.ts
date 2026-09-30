import type { File } from './file.type';
import type { Tag } from '~~/services/types/tag.type';

export interface Post {
  id: string;
  previewFileId: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  title: string;
  description: string;
  content: string;
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
