type DayHours = { open: number; close: number } | null;

/** Часы работы по дням недели (0 — воскресенье, как в Date.getDay) */
type WeekHours = Record<number, DayHours>;

const REGULAR_HOURS: WeekHours = {
  0: { open: 10, close: 19 },
  1: null,
  2: { open: 10, close: 20 },
  3: { open: 10, close: 20 },
  4: { open: 10, close: 20 },
  5: { open: 10, close: 20 },
  6: { open: 10, close: 19 },
};

const SUMMER_HOURS: WeekHours = {
  0: null,
  1: { open: 10, close: 19 },
  2: { open: 10, close: 19 },
  3: { open: 10, close: 19 },
  4: { open: 10, close: 19 },
  5: { open: 10, close: 19 },
  6: { open: 10, close: 19 },
};

/** Летнее расписание действует с 1 июня по 31 августа, остальное время — обычное */
export const LIBRARY_SCHEDULES = {
  regular: { label: 'С 1 сентября по 31 мая', hours: REGULAR_HOURS },
  summer: { label: 'С 1 июня по 31 августа', hours: SUMMER_HOURS },
} as const;

export type LibrarySeason = keyof typeof LIBRARY_SCHEDULES;

/** Месяцы летнего расписания (0 — январь): июнь, июль, август */
const SUMMER_MONTHS = [5, 6, 7];

/** Порядок дней в неделе для отображения: с понедельника */
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

export const WEEKDAY_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

/** «во вторник», «в среду» — для фразы «откроемся во вторник» */
const WEEKDAY_ACCUSATIVE = [
  'в воскресенье',
  'в понедельник',
  'во вторник',
  'в среду',
  'в четверг',
  'в пятницу',
  'в субботу',
];

const TIMEZONE = 'Asia/Novosibirsk';

/** Текущие дата и время в Новосибирске — независимо от часового пояса посетителя */
const nowInNovosibirsk = (date = new Date()) => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: TIMEZONE,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hourCycle: 'h23',
    })
      .formatToParts(date)
      .map(part => [part.type, Number(part.value)]),
  );
  // Дата без часового пояса: дальше считаем только календарь
  return {
    day: new Date(Date.UTC(parts.year!, parts.month! - 1, parts.day!)),
    minutes: parts.hour! * 60 + parts.minute!,
  };
};

/** Последний день месяца — технический день */
const isTechnicalDay = (day: Date) => {
  const tomorrow = new Date(day);
  tomorrow.setUTCDate(day.getUTCDate() + 1);
  return tomorrow.getUTCMonth() !== day.getUTCMonth();
};

const seasonOf = (day: Date): LibrarySeason =>
  SUMMER_MONTHS.includes(day.getUTCMonth()) ? 'summer' : 'regular';

const hoursFor = (day: Date) =>
  isTechnicalDay(day)
    ? null
    : LIBRARY_SCHEDULES[seasonOf(day)].hours[day.getUTCDay()];

/** Какое расписание действует сейчас (по дате в Новосибирске) */
export const getLibrarySeason = (date = new Date()): LibrarySeason =>
  seasonOf(nowInNovosibirsk(date).day);

/** Неделя с понедельника для показа; hours = null — выходной */
export const getWeekSchedule = (season: LibrarySeason) =>
  WEEK_ORDER.map(index => ({
    index,
    hours: LIBRARY_SCHEDULES[season].hours[index] ?? null,
  }));

export interface LibraryStatus {
  isOpen: boolean;
  /** Готовая фраза для интерфейса */
  text: string;
  /** День недели сегодня (0 — воскресенье) */
  today: number;
  /** Расписание, которое действует сегодня */
  season: LibrarySeason;
  isTechnicalToday: boolean;
}

/** Открыта ли библиотека сейчас и когда откроется/закроется */
export const getLibraryStatus = (date = new Date()): LibraryStatus => {
  const { day, minutes } = nowInNovosibirsk(date);
  const today = day.getUTCDay();
  const isTechnicalToday = isTechnicalDay(day);
  const hours = hoursFor(day);
  const season = seasonOf(day);

  if (hours && minutes >= hours.open * 60 && minutes < hours.close * 60) {
    return {
      isOpen: true,
      text: `Открыто до ${hours.close}:00`,
      today,
      season,
      isTechnicalToday,
    };
  }

  if (hours && minutes < hours.open * 60) {
    return {
      isOpen: false,
      text: `Закрыто, откроемся сегодня в ${hours.open}:00`,
      today,
      season,
      isTechnicalToday,
    };
  }

  // Ищем ближайший рабочий день
  for (let offset = 1; offset <= 8; offset++) {
    const next = new Date(day);
    next.setUTCDate(day.getUTCDate() + offset);
    const nextHours = hoursFor(next);
    if (!nextHours) continue;

    const when = offset === 1 ? 'завтра' : WEEKDAY_ACCUSATIVE[next.getUTCDay()];
    const reason = isTechnicalToday ? 'Технический день' : 'Закрыто';
    return {
      isOpen: false,
      text: `${reason}, откроемся ${when} в ${nextHours.open}:00`,
      today,
      season,
      isTechnicalToday,
    };
  }

  return { isOpen: false, text: 'Закрыто', today, season, isTechnicalToday };
};
