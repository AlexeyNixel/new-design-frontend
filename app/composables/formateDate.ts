import dayjs from 'dayjs';

export const useFormateDate = () => {
  return (date: string) => dayjs(date).format('DD.MM.YYYY');
};
