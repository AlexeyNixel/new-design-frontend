import type { File } from './file.type';

export interface Club {
  id: string;
  name: string;
  description: string;
  member: string;
  worktime: string;
  workDirection: object;
  previewFileId: string;
  preview: File;
}
