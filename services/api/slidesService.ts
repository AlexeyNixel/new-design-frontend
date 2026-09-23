import { omitListFields, POST_HEAVY_FIELDS, useApi } from './base';
import { API_ENDPOINTS } from './endpoints';
import type { Slide } from '~~/services/types/slide.type';

interface Params {
  pageSize: number;
  orderBy: string;
  include: string;
}

export const useSlides = () => {
  const api = useApi();

  return {
    getAllSlides: (params?: Partial<Params>) =>
      api.get<Slide[]>(API_ENDPOINTS.slides, {
        params: params,
        // Слайду от поста нужен только slug для ссылки
        transform: omitListFields(POST_HEAVY_FIELDS, 'post'),
      }),
  };
};
