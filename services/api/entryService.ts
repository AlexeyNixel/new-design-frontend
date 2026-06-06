import { useApi } from './base';
import { type Post } from '../types/post.type';
import { API_ENDPOINTS } from './endpoints';
import type { Tag } from '~~/services/types/tag.type';

export const useEntryApi = () => {
  const api = useApi();

  return {
    getAllEntry: (params?: any) =>
      api.get<Post[]>(API_ENDPOINTS.post, { params: params }),

    getBySlugEntry: (slug: string, params?: any) =>
      api.getOne<Post>(API_ENDPOINTS.post, slug, { params: params }),

    getAllTags: (params?: any) =>
      api.get<Tag[]>(API_ENDPOINTS.tag, { params: params }),
  };
};
