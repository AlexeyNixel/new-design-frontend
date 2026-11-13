import type { LibraryExhibition } from '~~/services/types/libraryExhibition.type';
import { useLibraryExhibitionApi } from '~~/services/api/libraryExhibitionService';

/**
 * Выставки в календаре афиши.
 *
 * Выставка — период в несколько недель, поэтому в календаре она не точка в дне:
 * в сетке у дней показа рисуется отдельный цветной кружок, а в списке дня —
 * раскрывающийся блок «Выставки» с названием и описанием. Больше ничего:
 * выставка не засоряет сетку месяца и не смешивается со счётчиком событий дня.
 *
 * Источник данных — API `GET /api/library-exhibition/calendar`.
 * `exhibitionsOnDay` о формате источника не знает.
 */

const DAY = 'YYYY-MM-DD';

/** Запрос выставок. Ошибка источника — пустой список, календарь работает и без них. */
export const useExhibitionsCalendar = async (): Promise<LibraryExhibition[]> => {
  try {
    const { data } = await useLibraryExhibitionApi().getCalendarExhibitions();
    return Array.isArray(data) ? data : [];
  }
  catch {
    return [];
  }
};

/** Выставки, которые идут в конкретный день (ключ `YYYY-MM-DD`) */
export const exhibitionsOnDay = (
  exhibitions: LibraryExhibition[],
  dayKey: string,
  parseDate: (value: Date | string) => dayjs.Dayjs,
): LibraryExhibition[] =>
  exhibitions.filter((exhibition) => {
    const start = parseDate(exhibition.startsAt).format(DAY);
    const end = parseDate(exhibition.endsAt).format(DAY);
    const last = end < start ? start : end;
    return dayKey >= start && dayKey <= last;
  });
