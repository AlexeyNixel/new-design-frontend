// Какие файлы по ссылке можно открыть в модальном окне (см. app/plugins/file-preview.client.ts)

export type FilePreviewKind = 'pdf' | 'office' | 'text';

const KIND_BY_EXT: Record<string, FilePreviewKind> = {
  pdf: 'pdf',
  doc: 'office',
  docx: 'office',
  xls: 'office',
  xlsx: 'office',
  ppt: 'office',
  pptx: 'office',
  txt: 'text',
  csv: 'text',
};

/** Расширение файла из пути ссылки (без query и hash), в нижнем регистре */
export const fileExtension = (pathname: string) =>
  pathname.match(/\.([a-z0-9]{2,5})$/i)?.[1]?.toLowerCase() ?? '';

export const filePreviewKind = (pathname: string): FilePreviewKind | null =>
  KIND_BY_EXT[fileExtension(pathname)] ?? null;

/** Имя файла для подписи в модалке, если у ссылки нет внятного текста */
export const fileNameFromPath = (pathname: string) =>
  decodeURIComponent(pathname.split('/').pop() || 'Документ');
