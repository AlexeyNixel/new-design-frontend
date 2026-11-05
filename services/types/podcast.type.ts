import type { File } from './file.type';

export interface Podcast {
  id: string;
  title: string;
  description?: string | null;
  audioFileId?: string | null;
  /** Загруженный в Silo аудиофайл (File.type = AUDIO) */
  audio?: File | null;
  isDeleted?: boolean;
  createdAt?: string;
  /** Прямая ссылка на аудио — для моковых подкастов и записей без загруженного файла */
  audioUrl?: string | null;
}
