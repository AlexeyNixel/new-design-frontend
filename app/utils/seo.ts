/**
 * Превращает HTML из CMS в текст для meta description:
 * убирает теги и сущности, схлопывает пробелы и обрезает по границе слова.
 */
export const toMetaDescription = (html?: string | null, maxLength = 160) => {
  if (!html) return undefined;

  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) return undefined;
  if (text.length <= maxLength) return text;

  const cut = text.slice(0, maxLength - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${lastSpace > 0 ? cut.slice(0, lastSpace) : cut}…`;
};
