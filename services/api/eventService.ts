import { useApi } from './base';
import { API_ENDPOINTS } from './endpoints';
import { type Event } from '~~/services/types/event.type';

export const useEventApi = () => {
  const api = useApi();

  return {
    getAllEvents: (params?: any) =>
      api.get<Event[]>(API_ENDPOINTS.event, { params: params }),
  };
};
