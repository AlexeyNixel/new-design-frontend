import dayjs from 'dayjs';

/** Часовой пояс библиотеки — Новосибирск, UTC+7 */
const LIBRARY_OFFSET_MS = 7 * 60 * 60 * 1000;

/**
 * «Сейчас» по новосибирским часам — в тех же наивных координатах, что время
 * событий из API (см. useParseEventTime). Не зависит от пояса машины:
 * сервер в контейнере живёт в UTC, браузер — в UTC+7, а `dayjs()` у них разный.
 * Если параметры запроса считать через `dayjs()`, ключи useFetch на сервере
 * и в браузере не совпадут — данные запросятся заново и гидратация упадёт.
 */
export const libraryNow = () =>
  dayjs(new Date(Date.now() + LIBRARY_OFFSET_MS).toISOString().slice(0, 19));

/** Дата для фильтров API событий: «2026-10-19T00:00:00Z» — так API хранит время */
export const toEventApiDate = (date: dayjs.Dayjs) => `${date.format('YYYY-MM-DDTHH:mm:ss')}Z`;

export const useParseEventTime = () => {
  return (date: Date | string) => dayjs(date.toString().slice(0, 19));
};

/**
 * «Сегодня» / «Завтра» по новосибирскому календарю, для остальных дней — null.
 * Принимает время события в координатах API (как useParseEventTime).
 */
export const eventDayBadge = (date: Date | string) => {
  const day = dayjs(date.toString().slice(0, 19)).startOf('day');
  const today = libraryNow().startOf('day');
  if (day.isSame(today, 'day')) return 'Сегодня';
  if (day.isSame(today.add(1, 'day'), 'day')) return 'Завтра';
  return null;
};
