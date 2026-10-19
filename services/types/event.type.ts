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
}
