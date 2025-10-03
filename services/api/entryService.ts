import { useApi } from './base';
import { type Entry } from '../types/entry.type';
import { API_ENDPOINTS } from './endpoints';

export const useEntryApi = () => {
  const api = useApi();

  return {
    getAllEntry: (params?: any) =>
      api.get<Entry[]>(API_ENDPOINTS.entry, { params: params }),

    getBySlugEntry: (slug: string, params?: any) =>
      api.getOne<Entry>(API_ENDPOINTS.entry, slug, { params: params }),
  };
};
