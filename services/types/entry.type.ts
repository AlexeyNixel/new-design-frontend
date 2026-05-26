import { type File } from './file.type';
import type { Tag } from '~~/services/types/tag.type';

export interface Entry {
  id: string;
  fileId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  title: string;
  description: string;
  content: string;
  slug: string;
  published: boolean;
  isDeleted: boolean;
  departmentId: string;
  pinned: boolean;
  preview: File;
  tags: Tag[];
  department: {
    title: string;
    id: string;
  };
}
