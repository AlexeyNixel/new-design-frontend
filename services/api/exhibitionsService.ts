import { useApi } from './base';
import { API_ENDPOINTS } from './endpoints';
import { type File } from '../types/file.type';

export const useExhibitionApi = () => {
  const api = useApi();

  return {
    getAllExhibition: (params?: any) =>
      api.get<File[]>(API_ENDPOINTS.file, {
        params: {
          searchByField: 'type=EXHIBITION',
          ...params,
        },
      }),

    // getOneBook: (id: string, params?: any) =>
    //   api.getOne<Book>(API_ENDPOINTS.book, id, { params: params }),
  };
};
