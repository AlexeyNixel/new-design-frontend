import { useApi } from './base';
import { API_ENDPOINTS } from './endpoints';
import type { Notification } from '~~/services/types/notification.type';

export const useNotificationApi = () => {
  const api = useApi();

  return {
    getAllNotifications: (params?: any) =>
      api.get<Notification[]>(API_ENDPOINTS.notification, params),
  };
};
