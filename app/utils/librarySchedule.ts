/** Часы работы библиотеки по дням недели (0 — воскресенье, как в Date.getDay) */
export const LIBRARY_HOURS: Record<number, { open: number; close: number } | null> = {
  0: { open: 10, close: 19 },
  1: null,
  2: { open: 10, close: 20 },
  3: { open: 10, close: 20 },
  4: { open: 10, close: 20 },
  5: { open: 10, close: 20 },
  6: { open: 10, close: 19 },
};

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

/** Последняя пятница месяца — санитарный день */
const isSanitaryDay = (day: Date) => {
  if (day.getUTCDay() !== 5) return false;
  const nextWeek = new Date(day);
  nextWeek.setUTCDate(day.getUTCDate() + 7);
  return nextWeek.getUTCMonth() !== day.getUTCMonth();
};

const hoursFor = (day: Date) =>
  isSanitaryDay(day) ? null : LIBRARY_HOURS[day.getUTCDay()];

export interface LibraryStatus {
  isOpen: boolean;
  /** Готовая фраза для интерфейса */
  text: string;
  /** День недели сегодня (0 — воскресенье) */
  today: number;
  isSanitaryToday: boolean;
}

/** Открыта ли библиотека сейчас и когда откроется/закроется */
export const getLibraryStatus = (date = new Date()): LibraryStatus => {
  const { day, minutes } = nowInNovosibirsk(date);
  const today = day.getUTCDay();
  const isSanitaryToday = isSanitaryDay(day);
  const hours = hoursFor(day);

  if (hours && minutes >= hours.open * 60 && minutes < hours.close * 60) {
    return { isOpen: true, text: `Открыто до ${hours.close}:00`, today, isSanitaryToday };
  }

  if (hours && minutes < hours.open * 60) {
    return {
      isOpen: false,
      text: `Закрыто, откроемся сегодня в ${hours.open}:00`,
      today,
      isSanitaryToday,
    };
  }

  // Ищем ближайший рабочий день
  for (let offset = 1; offset <= 8; offset++) {
    const next = new Date(day);
    next.setUTCDate(day.getUTCDate() + offset);
    const nextHours = hoursFor(next);
    if (!nextHours) continue;

    const when = offset === 1 ? 'завтра' : WEEKDAY_ACCUSATIVE[next.getUTCDay()];
    const reason = isSanitaryToday ? 'Санитарный день' : 'Закрыто';
    return {
      isOpen: false,
      text: `${reason}, откроемся ${when} в ${nextHours.open}:00`,
      today,
      isSanitaryToday,
    };
  }

  return { isOpen: false, text: 'Закрыто', today, isSanitaryToday };
};
