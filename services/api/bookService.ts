import { useApi } from './base';
import { type Book } from '../types/book.type';
import { API_ENDPOINTS } from './endpoints';

export const useBookApi = () => {
  const api = useApi();

  return {
    getAllBooks: (params?: any) =>
      api.get<Book[]>(API_ENDPOINTS.book, { params: params }),
  };
};
