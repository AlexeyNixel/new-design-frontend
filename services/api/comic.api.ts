import { useApi, type ApiQueryParams } from './base';
import { API_ENDPOINTS } from './endpoints';
import type {
  Comic,
  ComicGenre,
  ComicQueryParams,
  ComicSeries,
} from '~~/services/types/comic.type';

export const useComicApi = () => {
  const api = useApi();

  return {
    getAllComics: (params?: ComicQueryParams) =>
      api.get<Comic[]>(API_ENDPOINTS.comic, { params }),
    getAllGenres: (params?: ApiQueryParams) =>
      api.getWithoutPagination<ComicGenre[]>(API_ENDPOINTS.comicGenres, {
        params,
      }),
    getAllSeries: (params?: ApiQueryParams) =>
      api.getWithoutPagination<ComicSeries[]>(API_ENDPOINTS.comicSeries, {
        params,
      }),
    getOneComic: (idOrSlug: string, params?: ApiQueryParams) =>
      api.getOne<Comic>(API_ENDPOINTS.comic, idOrSlug, { params }),
  };
};
