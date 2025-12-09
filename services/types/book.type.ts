import { type File } from './file.type';

export interface Book {
  id: string;
  oldId: number;
  title: string;
  desc: string;
  content: string;
  fileId: string;
  createdAt: string;
  isDeleted: false;
  category: string;
  dateOfReceipt: string;
  link: string;
  storagePlace: string;
  isVideo: boolean;
  preview: File;
}

export interface BookCollections {
  id: string;
  label: string;
  isDeleted: boolean;
  previewFileId: string;
  createdAt: string;
  preview: File;
}
