import type { Event } from '~~/services/types/event.type';

/**
 * Тип события для афиши. Его выбирает редактор (поле `category` в API).
 * У старых событий типа нет — для них угадываем по названию.
 */
export type EventCategory = 'master' | 'music' | 'game' | 'talk';

export const EVENT_CATEGORIES: Record<
  EventCategory,
  {
    label: string;
    poster: string;
    swatch: string;
    /** Бейдж «Сегодня» / «Завтра» — контрастный к плакату */
    badge: string;
  }
> = {
  master: {
    label: 'Мастер-классы',
    poster: 'bg-[#F2B632] text-[#0d2a30]',
    swatch: 'bg-[#F2B632]',
    badge: 'bg-[#0d2a30] text-white',
  },
  music: {
    label: 'Музыка',
    poster: 'bg-[#7B3F8C] text-white',
    swatch: 'bg-[#7B3F8C]',
    badge: 'bg-white text-[#7B3F8C]',
  },
  game: {
    label: 'Игры и квесты',
    poster: 'bg-[#157486] text-white',
    swatch: 'bg-[#157486]',
    badge: 'bg-white text-[#157486]',
  },
  talk: {
    label: 'Встречи и лекции',
    poster: 'bg-white text-[#0d2a30] ring-1 ring-[#0d4954]/15',
    swatch: 'bg-white ring-1 ring-[#0d4954]/30',
    badge: 'bg-[#F2B632] text-[#0d2a30]',
  },
};

/**
 * Запасной вариант для событий без типа.
 * Порядок правил важен: «Литературно-музыкальная программа» — это музыка,
 * а «мастер-класс в игротеке» — мастер-класс.
 */
const RULES: [EventCategory, RegExp][] = [
  ['master', /мастер[-\s]?класс|практикум|своими руками/i],
  ['music', /концерт|музык|винил|jazzium|джаз|меломан|гостиная/i],
  ['game', /игр|квиз|квест|викторин|турнир|штурм|чемпионат/i],
];

export const eventCategory = (
  event: Pick<Event, 'title' | 'category'>,
): EventCategory =>
  (event.category?.toLowerCase() as EventCategory | undefined)
  ?? RULES.find(([, rule]) => rule.test(event.title))?.[0]
  ?? 'talk';
