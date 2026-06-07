import { useApi } from './base';
import { API_ENDPOINTS } from './endpoints';

export const useNavigationApi = () => {
  const api = useApi();

  return {
    getAllNavigation: () =>
      api.getWithoutPagination<any>(API_ENDPOINTS.navigationItem),
  };
};
