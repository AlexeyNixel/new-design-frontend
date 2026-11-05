import { useApi, type ApiQueryParams } from './base';
import type { Podcast } from '../types/podcast.type';
import { API_ENDPOINTS } from './endpoints';

export const usePodcastApi = () => {
  const api = useApi();

  return {
    getAllPodcasts: (params?: ApiQueryParams) =>
      api.get<Podcast[]>(API_ENDPOINTS.podcast, { params }),

    getOnePodcast: (id: string, params?: ApiQueryParams) =>
      api.getOne<Podcast>(API_ENDPOINTS.podcast, id, { params }),
  };
};
