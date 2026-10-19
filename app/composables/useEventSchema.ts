import type { Event } from '~~/services/types/event.type';
import { IBillboardPlaces } from '~/constants/billboardPlaces';

/** Часовой пояс библиотеки: API хранит время события «как на часах», с фиктивным Z */
const LIBRARY_UTC_OFFSET = '+07:00';

/** Текст без HTML — для description и разметки */
export const stripHtml = (html?: string | null) =>
  (html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

/** Обрезает текст по границе слова, чтобы description не обрывался посреди слова */
export const truncateText = (text: string, max = 160) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,.;:—-]+$/, '')}…`;
};

/** Название помещения по коду из API */
export const eventPlaceName = (event: Pick<Event, 'place'>) =>
  IBillboardPlaces[event.place as keyof typeof IBillboardPlaces] ?? '';

/**
 * Объект schema.org `Event` для события афиши.
 * Выездные события без адреса не размечаем: без location разметка невалидна.
 */
export const useEventSchema = () => {
  const toAbsolute = useAbsoluteUrl();
  const parseEventTime = useParseEventTime();
  const siteUrl = toAbsolute('/');

  return (event: Event) => {
    if (event.place === 'out') return undefined;

    const isOnline = event.place === 'virt';
    const room = eventPlaceName(event);
    const description = truncateText(stripHtml(event.content), 300);

    return {
      '@type': 'Event',
      'name': event.title,
      'url': toAbsolute(`/afisha/${event.id}`),
      'startDate':
        parseEventTime(event.eventTime).format('YYYY-MM-DDTHH:mm:ss')
        + LIBRARY_UTC_OFFSET,
      'eventStatus': 'https://schema.org/EventScheduled',
      'eventAttendanceMode': isOnline
        ? 'https://schema.org/OnlineEventAttendanceMode'
        : 'https://schema.org/OfflineEventAttendanceMode',
      'location': isOnline
        ? { '@type': 'VirtualLocation', 'url': siteUrl }
        : {
            '@type': 'Place',
            'name': room ? `${LIBRARY_INFO.name}, ${room}` : LIBRARY_INFO.name,
            'address': { '@type': 'PostalAddress', ...LIBRARY_INFO.address },
          },
      'description': description || undefined,
      'image': [toAbsolute(DEFAULT_OG_IMAGE)],
      'typicalAgeRange': Number(event.age) ? `${Number(event.age)}-` : undefined,
      'organizer': { '@id': `${siteUrl}#organization` },
    };
  };
};
