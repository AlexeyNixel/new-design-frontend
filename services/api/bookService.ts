import { useApi, type ApiQueryParams } from './base';
import type { Book, BookCollections } from '../types/book.type';
import { API_ENDPOINTS } from './endpoints';

export const useBookApi = () => {
  const api = useApi();

  return {
    getAllBooks: (params?: ApiQueryParams) =>
      api.get<Book[]>(API_ENDPOINTS.book, { params: params }),

    getOneBook: (id: string, params?: ApiQueryParams) =>
      api.getOne<Book>(API_ENDPOINTS.book, id, { params: params }),

    getAllCollections: (params?: ApiQueryParams) =>
      api.get<BookCollections[]>(API_ENDPOINTS.bookCollection, { params }),
  };
};
