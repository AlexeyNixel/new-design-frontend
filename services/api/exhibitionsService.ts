import { useApi, type ApiQueryParams } from './base';
import { API_ENDPOINTS } from './endpoints';
import type { File } from '../types/file.type';

/** Виртуальная выставка — загруженный в CMS HTML-пакет (File с type=EXHIBITION) */
export type Exhibition = File;

export const useExhibitionApi = () => {
  const api = useApi();

  return {
    /** Параметры: page, limit, sortOrder ('asc' | 'desc', по дате загрузки) */
    getAllExhibitions: (params?: ApiQueryParams) =>
      api.get<Exhibition[]>(API_ENDPOINTS.exhibitions, { params }),
  };
};
