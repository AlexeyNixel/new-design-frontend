import { useApi, type ApiQueryParams } from './base';
import { API_ENDPOINTS } from './endpoints';
import type { Game, Genres } from '~~/services/types/game.type';

export const useGameApi = () => {
  const api = useApi();

  return {
    getAllGames: (params?: ApiQueryParams) =>
      api.get<Game[]>(API_ENDPOINTS.game, { params: params }),
    getAllGenres: (params?: ApiQueryParams) =>
      api.getWithoutPagination<Genres[]>(API_ENDPOINTS.genres, {
        params: params,
      }),
    getOneGames: (id: string, params?: ApiQueryParams) =>
      api.getOne<Game>(API_ENDPOINTS.game, id, { params: params }),
  };
};
