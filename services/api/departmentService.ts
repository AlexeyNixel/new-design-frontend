import { useApi } from './base';
import { API_ENDPOINTS } from './endpoints';
import type { Department } from '~~/services/types/department.type';

export const useDepartmentApi = () => {
  const api = useApi();

  return {
    getAllDepartments: (params?: any) =>
      api.get<Department[]>(API_ENDPOINTS.department, { params: params }),
  };
};
