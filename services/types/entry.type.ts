import { File } from './file.type';

export interface Entry {
  id: string;
  oldId: number;
  fileId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  title: string;
  desc: string;
  content: string;
  slug: string;
  published: boolean;
  isDeleted: boolean;
  departmentId: string;
  pinned: boolean;
  preview: File;
}
