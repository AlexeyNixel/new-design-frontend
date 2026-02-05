import { useApi } from './base';
import { API_ENDPOINTS } from './endpoints';
import type { Game } from '~~/services/types/game.type';

export const useGameApi = () => {
  const api = useApi();

  return {
    getAllGames: (params?: any) =>
      api.get<Game[]>(API_ENDPOINTS.game, { params: params }),
  };
};
