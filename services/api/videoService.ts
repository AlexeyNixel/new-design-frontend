import { useApi } from './base';
import { API_ENDPOINTS } from './endpoints';

export const useVideoApi = () => {
  const api = useApi();

  return {
    getAllVideo: (params?: any) =>
      api.get(API_ENDPOINTS.video, { params: params }),
  };
};
