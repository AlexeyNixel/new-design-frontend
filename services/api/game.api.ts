import { useApi, type ApiQueryParams } from './base';
import { API_ENDPOINTS } from './endpoints';
import type {
  Game,
  GameGenre,
  GameQueryParams,
  GameSeries,
} from '~~/services/types/game.type';

export const useGameApi = () => {
  const api = useApi();

  return {
    getAllGames: (params?: GameQueryParams) =>
      api.get<Game[]>(API_ENDPOINTS.game, { params }),
    getAllGenres: (params?: ApiQueryParams) =>
      api.getWithoutPagination<GameGenre[]>(API_ENDPOINTS.genres, {
        params,
      }),
    getAllSeries: (params?: ApiQueryParams) =>
      api.getWithoutPagination<GameSeries[]>(API_ENDPOINTS.gameSeries, {
        params,
      }),
    getOneGames: (idOrSlug: string, params?: ApiQueryParams) =>
      api.getOne<Game>(API_ENDPOINTS.game, idOrSlug, { params }),
  };
};
