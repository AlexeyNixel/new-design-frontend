/*
 * Таблицы мероприятий в новостях (например, «Пушкинская карта»): редакторы
 * ведут их в админке обычной таблицей, а сайт показывает карточками.
 *
 * Формат строки (как в редакторе): дата и время | название (возраст),
 * ссылка «приобрести билет», описание | стоимость | отдел, телефон.
 * Строка «2026 год» задаёт год для строк ниже. Если таблица не похожа на
 * такую — она остаётся обычной таблицей.
 */

export interface TableEvent {
  id: string;
  title: string;
  age?: number;
  /** Даты проведения, «YYYY-MM-DD» — бывает несколько («25 сентября, 2 апреля») */
  dates: string[];
  timeStart?: string;
  timeEnd?: string;
  description: string;
  ticketUrl?: string;
  price?: number;
  department?: string;
  phone?: string;
}

export type ContentSegment
  = | { type: 'html'; html: string }
    | { type: 'events'; events: TableEvent[] };

const MONTHS = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

const DATE_SOURCE = `(\\d{1,2})\\s+(${MONTHS.join('|')})`;
const DATE_RE = new RegExp(DATE_SOURCE, 'gi');
const HAS_DATE_RE = new RegExp(DATE_SOURCE, 'i');
const TIME_RE = /(\d{1,2})[:.](\d{2})(?:\s*[-–—]\s*(\d{1,2})[:.](\d{2}))?/;
const YEAR_ROW_RE = /^\D*(\d{4})\s*год/i;

/** Минимум строк-мероприятий, чтобы считать таблицу афишей */
const MIN_EVENT_ROWS = 2;

const decodeEntities = (text: string) =>
  text
    .replace(/&nbsp;/g, ' ')
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));

/** Текст без тегов; абзацы и переносы — через \n */
const toText = (html: string) =>
  decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<[^>]+>/g, ''),
  )
    .split('\n')
    .map(line => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');

const pad = (value: number | string) => String(value).padStart(2, '0');

const cellsOf = (row: string) => [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(match => match[1] ?? '');

const parseDates = (text: string, year: number) =>
  [...text.matchAll(DATE_RE)].map(([, day, month]) => {
    const monthIndex = MONTHS.indexOf(month!.toLowerCase()) + 1;
    return `${year}-${pad(monthIndex)}-${pad(day!)}`;
  });

const parseRow = (cells: string[], year: number, index: number): TableEvent | null => {
  const [whenHtml = '', infoHtml = '', priceHtml = '', contactHtml = ''] = cells;
  const whenText = toText(whenHtml);
  const dates = parseDates(whenText, year);
  if (!dates.length) return null;

  const time = whenText.match(TIME_RE);

  // Строки (абзацы и <br>) до ссылки на билет — название, после — описание
  const lines = infoHtml
    .split(/<\/p>|<br\s*\/?>/i)
    .filter(line => toText(line));
  const linkIndex = lines.findIndex(line => /<a\s|приобрести билет/i.test(line));
  const titleParts = (linkIndex >= 0 ? lines.slice(0, linkIndex) : lines.slice(0, 1)).map(toText);
  const descriptionParts = (linkIndex >= 0 ? lines.slice(linkIndex + 1) : lines.slice(1)).map(toText);

  let title = titleParts.join(' ').replace(/\s+/g, ' ').trim();
  const ageMatch = title.match(/\(?\s*(\d{1,2})\s*\+\s*\)?/);
  if (ageMatch) title = title.replace(ageMatch[0], '').replace(/[\s:]+$/, '').trim();
  if (!title) return null;

  const ticketUrl = infoHtml.match(/href="(https?:\/\/[^"]+)"/i)?.[1];
  const priceMatch = toText(priceHtml).match(/(\d[\d\s]*)\s*руб/i);
  const contactText = toText(contactHtml);
  const phone = contactText.match(/тел\.?\s*([\d\s()-]{5,})/i)?.[1]?.trim();
  const department = contactText
    .split('\n')
    .filter(line => !/тел\./i.test(line))
    .join(' ')
    .replace(/[,\s]+$/, '')
    .trim();

  return {
    id: `${dates[0]}-${index}`,
    title,
    age: ageMatch ? Number(ageMatch[1]) : undefined,
    dates,
    timeStart: time ? `${pad(time[1]!)}:${time[2]}` : undefined,
    timeEnd: time?.[3] ? `${pad(time[3])}:${time[4]}` : undefined,
    description: descriptionParts.filter(Boolean).join('\n'),
    ticketUrl: ticketUrl ? decodeEntities(ticketUrl) : undefined,
    price: priceMatch ? Number(priceMatch[1]!.replace(/\s/g, '')) : undefined,
    department: department || undefined,
    phone,
  };
};

/** Таблица → мероприятия, или null, если это не таблица мероприятий */
const parseEventTable = (tableHtml: string, fallbackYear: number): TableEvent[] | null => {
  const rows = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(match => match[1] ?? '');
  let year = fallbackYear;
  const events: TableEvent[] = [];

  rows.forEach((row, index) => {
    const cells = cellsOf(row);
    const rowText = toText(row);
    const yearMatch = rowText.match(YEAR_ROW_RE);
    if (yearMatch && !HAS_DATE_RE.test(rowText)) {
      year = Number(yearMatch[1]);
      return;
    }
    if (cells.length < 2) return;
    const event = parseRow(cells, year, index);
    if (event) events.push(event);
  });

  return events.length >= MIN_EVENT_ROWS ? events : null;
};

/**
 * Делит HTML новости на куски: обычный HTML и таблицы мероприятий.
 * Без таблиц мероприятий возвращает один HTML-кусок.
 */
export const splitEventTables = (html: string, fallbackYear = new Date().getFullYear()): ContentSegment[] => {
  const segments: ContentSegment[] = [];
  let cursor = 0;

  for (const match of html.matchAll(/<table[\s\S]*?<\/table>/gi)) {
    const events = parseEventTable(match[0], fallbackYear);
    if (!events) continue;
    const start = match.index ?? 0;
    if (start > cursor) segments.push({ type: 'html', html: html.slice(cursor, start) });
    segments.push({ type: 'events', events });
    cursor = start + match[0].length;
  }

  if (cursor < html.length) segments.push({ type: 'html', html: html.slice(cursor) });
  return segments.length ? segments : [{ type: 'html', html }];
};
