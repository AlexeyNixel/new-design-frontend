import { useApi, type ApiQueryParams } from './base';
import { API_ENDPOINTS } from './endpoints';
import type { Event } from '~~/services/types/event.type';

export const useEventApi = () => {
  const api = useApi();

  return {
    getAllEvents: (params?: ApiQueryParams) =>
      api.get<Event[]>(API_ENDPOINTS.event, { params: params }),
    // API заворачивает событие в { status, data }; на 404 отвечает { status, message }.
    // Разворачиваем только успешный ответ — тогда getOne сам отдаст 404.
    getOneEvent: (id: string) =>
      api.getOne<Event>(API_ENDPOINTS.event, id, {
        transform: (response: unknown) => {
          const typed = response as { data?: Event } | null;
          return typed?.data ?? response;
        },
      }),
  };
};
