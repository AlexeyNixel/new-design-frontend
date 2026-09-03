import { useApi } from './base';
import { API_ENDPOINTS } from './endpoints';

export interface NavigationMenuItem {
  id: string | number;
  title: string;
  icon?: string;
  to?: string;
  target?: string;
  type?: string;
  children?: NavigationMenuItem[];
}

export const useNavigationApi = () => {
  const api = useApi();

  return {
    getAllNavigation: () =>
      api.getWithoutPagination<NavigationMenuItem[]>(
        API_ENDPOINTS.navigationItem,
      ),
  };
};
