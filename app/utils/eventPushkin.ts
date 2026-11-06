import type { Event } from '~~/services/types/event.type';

/**
 * Событие можно оплатить Пушкинской картой.
 * Boolean с бэкенда иногда приходит строкой ('true'/'false'), поэтому сравниваем
 * через String(...) — как isDeleted в афише.
 */
export const isPushkinEvent = (event: Pick<Event, 'isPushkin'>) =>
  String(event.isPushkin).toLowerCase() === 'true';
