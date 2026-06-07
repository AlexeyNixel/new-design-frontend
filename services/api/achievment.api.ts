import { useApi } from './base';
import type { Achievement } from '../types/achievment.type';
import { API_ENDPOINTS } from './endpoints';

export const useAchievements = () => {
  const api = useApi();

  return {
    getAllAchievements: () =>
      api.getWithoutPagination<Achievement[]>(API_ENDPOINTS.achievements),
  };
};
