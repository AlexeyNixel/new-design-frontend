import { useApi } from './base';
import { API_ENDPOINTS } from './endpoints';
import type { LibraryExhibition } from '~~/services/types/libraryExhibition.type';

export const useLibraryExhibitionApi = () => {
  const api = useApi();

  return {
    /** Выставки-анонсы для календаря: без параметров — все видимые */
    getCalendarExhibitions: (params?: { from?: string; to?: string }) =>
      api.get<LibraryExhibition[]>(API_ENDPOINTS.libraryExhibitionsCalendar, {
        params,
      }),
  };
};
