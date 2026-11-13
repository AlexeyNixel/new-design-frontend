/**
 * Выставка в календаре на главной — анонс физической выставки в библиотеке
 * («сейчас можно прийти посмотреть картины»).
 *
 * Это не виртуальная выставка (`services/api/exhibitionsService.ts`, файлы
 * iSpring в `/page/exhibition/<slug>`): у анонса нет своей страницы и обложки,
 * только период показа и пара строк описания.
 */
export interface LibraryExhibition {
  id: string;
  title: string;
  /** Пара строк пояснения в списке дня */
  description?: string | null;
  /** Первый день показа */
  startsAt: Date | string;
  /** Последний день показа включительно */
  endsAt: Date | string;
}
