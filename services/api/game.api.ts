import { useApi } from './base';
import { API_ENDPOINTS } from './endpoints';

export const useGameApi = () => {
  const api = useApi();

  return {
    getAllGames: (params?: any) =>
      api.get<any>(API_ENDPOINTS.game, { params: params }),
  };
};
