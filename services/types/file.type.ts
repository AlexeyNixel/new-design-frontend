export interface File {
  id: string;
  originalName: string;
  mimeType: string;
  hash: string;
  type: string;
  path: string;
  preview: string;
  createdAt: string;
  /** Размеры оригинала (у старых файлов могут быть 0) */
  width?: number | null;
  height?: number | null;
  /** Уменьшенные копии для srcset: { "400": "/dev/variants/...-w400.webp", ... } */
  variants?: Record<string, string> | null;
}
