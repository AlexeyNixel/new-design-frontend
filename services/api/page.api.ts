import { useApi } from './base';
import type { Page } from '../types/page.type';
import { API_ENDPOINTS } from './endpoints';

export const usePageApi = () => {
  const api = useApi();

  return {
    getOnePage: (slug: string) => api.getOne<Page>(API_ENDPOINTS.page, slug),
  };
};
