import dayjs from 'dayjs';

export const useParseEventTime = () => {
  return (date: Date | string) => dayjs(date.toString().slice(0, 19));
};
