import { useApi } from './base';
import { API_ENDPOINTS } from './endpoints';
import type { Game, Genres } from '~~/services/types/game.type';

export const useGameApi = () => {
  const api = useApi();

  return {
    getAllGames: (params?: any) =>
      api.get<Game[]>(API_ENDPOINTS.game, { params: params }),
    getAllGenres: (params?: any) =>
      api.getWithoutPagination<Genres[]>(API_ENDPOINTS.genres, {
        params: params,
      }),
    getOneGames: (id: string, params?: any) =>
      api.getOne<Game>(API_ENDPOINTS.game, id, { params: params }),
  };
};
