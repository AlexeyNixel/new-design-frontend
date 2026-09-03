import { useApi, type ApiQueryParams } from './base';
import type { Post } from '../types/post.type';
import { API_ENDPOINTS } from './endpoints';
import type { Tag } from '~~/services/types/tag.type';

export const useEntryApi = () => {
  const api = useApi();

  return {
    getAllEntry: (params?: ApiQueryParams) =>
      api.get<Post[]>(API_ENDPOINTS.post, { params: params }),

    getBySlugEntry: (slug: string, params?: ApiQueryParams) =>
      api.getOne<Post>(API_ENDPOINTS.post, slug, { params: params }),

    getAllTags: (params?: ApiQueryParams) =>
      api.get<Tag[]>(API_ENDPOINTS.tag, { params: params }),
  };
};
