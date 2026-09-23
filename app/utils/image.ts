import type { File } from '~~/services/types/file.type';

/**
 * srcset из уменьшенных копий картинки (File.variants, создаются бэкендом при загрузке).
 * Оригинал добавляется кандидатом, только если он шире всех копий (у картинок до 1600px
 * бэкенд сам делает WebP-копию в исходном размере — она легче оригинала).
 * Нет копий — возвращает undefined, и браузер просто берёт src (оригинал).
 */
export const imageSrcset = (file?: Pick<File, 'path' | 'width' | 'variants'> | null) => {
  const variants = Object.entries(file?.variants ?? {});
  if (!file || !variants.length) return undefined;

  const candidates = variants.map(([width, path]) => `${path} ${width}w`);
  const widestVariant = Math.max(...variants.map(([width]) => Number(width)));
  if (file.width && file.width > widestVariant) {
    candidates.push(`${file.path} ${file.width}w`);
  }

  return candidates.join(', ');
};
