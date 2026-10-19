/**
 * Серии публикаций: у ежегодных конкурсов и проектов название в кавычках
 * повторяется из года в год — «БУК-симпатия», «Краткий слог», «Если тебе весна…».
 * По нему связываем анонс этого года с итогами прошлых.
 */

/** Разные написания одного проекта в разные годы → одно */
const ALIASES: [RegExp, string][] = [
  [/book-симпатия/g, 'бук-симпатия'],
];

const normalize = (text: string) => {
  let result = text
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[«»"“”„'’]/g, ' ')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
  for (const [pattern, value] of ALIASES) result = result.replace(pattern, value);
  return result;
};

export interface PostSeries {
  /** Название как в заголовке: «БУК-симпатия» — для поиска и подписи */
  name: string;
  /** Нормализованный ключ для сравнения заголовков */
  key: string;
}

/**
 * Серия по заголовку: первое название в кавычках, без номера сезона и года
 * в конце («Если тебе весна-4» → «Если тебе весна», «Большие юбилеи»-2026 → «Большие юбилеи»).
 */
export const seriesFromTitle = (title: string): PostSeries | null => {
  const quoted = title.match(/[«"“„]([^»"”“]{4,80})[»"”]/)?.[1];
  if (!quoted) return null;

  const name = quoted
    .replace(/[\s\-–—]*(?:\d{1,4}|[IVXLC]{1,6})\s*[!.]?\s*$/, '')
    .replace(/[!.,:;…\s]+$/, '')
    .trim();
  const key = normalize(name);
  // Короткие и слишком общие названия («Книга», «Итоги») дают ложные серии
  if (key.length < 5) return null;

  return { name, key };
};

export const isInSeries = (title: string, series: PostSeries) => normalize(title).includes(series.key);
