/**
 * Какую дату показывать у новости. У анонса мероприятия (заполнено
 * `eventDate`) — дату мероприятия, иначе дату публикации. Порядок в
 * ленте от этого не зависит — сортировка всегда по `publishedAt`.
 *
 * `eventDate` — только дата (бэкенд отдаёт «2026-10-25T00:00:00.000Z»).
 * Возвращаем её как местную полночь «2026-10-25T00:00:00», чтобы dayjs и
 * new Date не сдвинули день в часовом поясе посетителя.
 */
export const postDisplayDate = (post: { publishedAt?: string; eventDate?: string | null }) =>
  post.eventDate ? `${post.eventDate.slice(0, 10)}T00:00:00` : (post.publishedAt ?? '');

/** Новость — анонс мероприятия с указанной датой */
export const isEventAnnouncement = (post: { eventDate?: string | null }) => !!post.eventDate;
