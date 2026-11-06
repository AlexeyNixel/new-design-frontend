import type { Event } from '~~/services/types/event.type';
import { isPushkinEvent } from '~/utils/eventPushkin';

/**
 * Условия посещения события, найденные в его тексте.
 * Сначала — поля из админки (ticketUrl, isPushkin), а текст описания остаётся
 * фолбэком для старых событий: редакторы писали «Купить билет» со ссылкой
 * на кассу, «по Пушкинской карте» или «Вход свободный».
 * Собирать их вместе — eventTicketInfo() внизу файла.
 */
export interface EventTicket {
  /** Ссылка на покупку билета */
  url?: string;
  /** Можно купить по Пушкинской карте */
  pushkin: boolean;
  /** Вход свободный / бесплатно */
  free: boolean;
  /** Цена из текста, например «300 ₽» или «от 300 ₽» */
  price?: string;
}

// «300 руб.», «от 300 ₽», «стоимость: 300»
const PRICE_RE = [
  /(от\s+)?(\d[\d\s]{0,6}\d|\d)\s*(?:руб|₽|р\.)/i,
  /(?:стоимость|цена)[^\d]{0,20}(от\s+)?(\d[\d\s]{0,6}\d|\d)/i,
];

const ticketPrice = (text: string) => {
  for (const re of PRICE_RE) {
    const match = text.match(re);
    if (match?.[2]) return `${match[1] ? 'от ' : ''}${match[2].replace(/\s+/g, ' ')} ₽`;
  }
  return undefined;
};

const TICKET_HOSTS = /(?:^|\.)(kassir\.ru|culture\.ru|quicktickets\.ru|ticketland\.ru|radario\.ru|intickets\.ru|timepad\.ru)$/i;

const ticketUrl = (html: string) => {
  for (const [, href = ''] of html.matchAll(/href\s*=\s*["']([^"']+)["']/gi)) {
    try {
      if (TICKET_HOSTS.test(new URL(href.replace(/&amp;/g, '&')).hostname)) return href;
    }
    catch {
      // относительная или битая ссылка — не касса
    }
  }
  return undefined;
};

export const eventTicket = (event: Pick<Event, 'content'>): EventTicket => {
  const html = event.content ?? '';
  const text = html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');
  const url = ticketUrl(html);

  return {
    url,
    pushkin: /пушкинск\S* карт/i.test(text),
    // Со ссылкой на кассу событие платное, даже если в тексте есть «бесплатн…»
    free: !url && /вход\s+(?:свободный|бесплатный)|бесплатн/i.test(text),
    price: ticketPrice(text),
  };
};

/**
 * Строка про стоимость на плакате события.
 * Цены и Пушкинской карты нет — считаем вход бесплатным; но если есть ссылка
 * на кассу, событие платное, просто цена не указана.
 * Пусто — про стоимость говорит только строка «Пушкинская карта».
 */
/**
 * Билет события: сначала поля из админки (ticketUrl, isPushkin), затем — как фолбэк
 * для старых событий — поиск ссылки на кассу и упоминания карты в тексте.
 * Источник цены и бесплатного входа — только текст описания.
 */
export const eventTicketInfo = (
  event: Pick<Event, 'content' | 'ticketUrl' | 'isPushkin'>,
): EventTicket => {
  const parsed = eventTicket(event);
  return {
    ...parsed,
    url: event.ticketUrl?.trim() || parsed.url,
    pushkin: isPushkinEvent(event) || parsed.pushkin,
  };
};

export const eventPriceLabel = (ticket: EventTicket) => {
  if (ticket.price) return ticket.price;
  if (ticket.url) return 'Вход по билету';
  return ticket.pushkin ? '' : 'Бесплатно';
};
