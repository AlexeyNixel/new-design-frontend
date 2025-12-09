import { type File } from './file.type';

export interface Entry {
  id: string;
  oldId: number;
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
  department: {
    title: string;
    id: string;
  };
}
