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
  collections?: BookCollections[];
}

export interface BookCollections {
  id: string;
  label: string;
  isDeleted: boolean;
  previewFileId: string;
  createdAt: string;
  preview: File;
}
