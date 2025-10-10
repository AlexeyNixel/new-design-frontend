import { useApi } from './base';
import { API_ENDPOINTS } from './endpoints';
import type { MenuItem } from '~~/services/types/menu-item.type';

export const useDocumentApi = () => {
  const api = useApi();

  return {
    getAllDocuments: (params?: any) =>
      api.get(API_ENDPOINTS.document, { params: params }),

    getBySlugDocument: (slug: string, params?: any) =>
      api.getOne<MenuItem>(API_ENDPOINTS.menuItem, slug, { params: params }),
  };
};
