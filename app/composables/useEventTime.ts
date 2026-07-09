import dayjs from 'dayjs';

// Бэкенд отдаёт eventTime со суффиксом "Z" (будто это UTC), хотя по факту
// это локальное время библиотеки без смещения часового пояса. dayjs(date)
// в этом случае конвертирует значение в часовой пояс браузера/сервера и
// время "уезжает" на несколько часов. Обрезаем строку до
// "YYYY-MM-DDTHH:mm:ss", чтобы dayjs распознал её как локальное время
// без конвертации.
export const useParseEventTime = () => {
  return (date: Date | string) => dayjs(date.toString().slice(0, 19));
};
