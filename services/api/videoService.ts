import { useApi, type ApiQueryParams } from './base';
import { API_ENDPOINTS } from './endpoints';

export const useVideoApi = () => {
  const api = useApi();

  return {
    getAllVideo: (params?: ApiQueryParams) =>
      api.get(API_ENDPOINTS.video, { params: params }),
  };
};
