import { useApi } from './base';
import { type Book, type BookCollections } from '../types/book.type';
import { API_ENDPOINTS } from './endpoints';

export const useBookApi = () => {
  const api = useApi();

  return {
    getAllBooks: (params?: any) =>
      api.get<Book[]>(API_ENDPOINTS.book, { params: params }),

    getOneBook: (id: string, params?: any) =>
      api.getOne<Book>(API_ENDPOINTS.book, id, { params: params }),

    getAllCollections: (params?: any) =>
      api.get<BookCollections[]>(API_ENDPOINTS.bookCollection, { params }),
  };
};
