import { canonicalHref } from '~~/shared/utils/canonicalPath';
import { useApi } from './base';
import { API_ENDPOINTS } from './endpoints';

export interface NavigationMenuItem {
  id: string | number;
  title: string;
  description?: string;
  icon?: string;
  to?: string;
  target?: string;
  type?: string;
  children?: NavigationMenuItem[];
}

// Ссылки меню ведут на канонический адрес, а не на двойник страницы
const withCanonicalLinks = (items: NavigationMenuItem[]): NavigationMenuItem[] =>
  items.map(item => ({
    ...item,
    to: item.to && canonicalHref(item.to),
    children: item.children && withCanonicalLinks(item.children),
  }));

export const useNavigationApi = () => {
  const api = useApi();

  return {
    getAllNavigation: async () => {
      const items = await api.getWithoutPagination<NavigationMenuItem[]>(
        API_ENDPOINTS.navigationItem,
      );
      return items && withCanonicalLinks(items);
    },
  };
};
