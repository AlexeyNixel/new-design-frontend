export interface Event {
  id: string;
  title: string;
  content: string;
  phone: string;
  age: number;
  place: string;
  eventTime: Date;
  /** Тип события, который указал редактор; null — не указан (старые события) */
  category?: 'MASTER' | 'MUSIC' | 'GAME' | 'TALK' | null;
  isDeleted: boolean;
  createdAt: Date;
  /** Ссылка на покупку билета (касса); null — не указана */
  ticketUrl?: string | null;
  /** Билет можно купить по Пушкинской карте; с API иногда приходит строкой — проверять через isPushkinEvent() */
  isPushkin?: boolean | string;
}
