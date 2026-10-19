/** Средняя скорость чтения на русском, слов в минуту */
const WORDS_PER_MINUTE = 180;

/** Текст без HTML: теги и сущности (&nbsp; и т.п.) заменяем пробелами */
const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, ' ').replace(/&[#\w]+;/g, ' ');

/**
 * Время чтения в минутах (не меньше 1). `text` — готовый текст без разметки
 * (contentText с бэкенда), если его нет — считаем по HTML без тегов.
 */
export const readingMinutes = (text?: string | null, html?: string | null) => {
  const plain = text?.trim() ? text : stripHtml(html ?? '');
  const words = plain.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
};
