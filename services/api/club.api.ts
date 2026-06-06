import { useApi } from './base';
import type { Club } from '../types/club.type';
import { API_ENDPOINTS } from './endpoints';

export const useClubApi = () => {
  const api = useApi();

  return {
    getAllClubs: (params: any) =>
      api.get<Club[]>(API_ENDPOINTS.club, { params: params }),
  };
};
