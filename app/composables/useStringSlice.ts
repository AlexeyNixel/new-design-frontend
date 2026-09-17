export const useStringSlice = (value: string, limit = 128) => {
  return value.length > limit ? value.slice(0, limit) + '...' : value;
};
