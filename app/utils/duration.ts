/**
 * Длительность аудио в виде «12:34» или «1:02:03».
 * Нет длительности — пустая строка: карточка просто не показывает время.
 */
export const formatDuration = (seconds?: number | null): string => {
  if (!seconds || !Number.isFinite(seconds) || seconds <= 0) return '';
  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const rest = String(total % 60).padStart(2, '0');
  return hours
    ? `${hours}:${String(minutes).padStart(2, '0')}:${rest}`
    : `${minutes}:${rest}`;
};

/**
 * Секунды из поля File.duration. Поле может прийти без картинки-варианта
 * (старые записи), поэтому null и строки превращаем в число безопасно.
 */
export const eventPodcastDuration = (value?: number | string | null): number | null => {
  const seconds = Number(value);
  return Number.isFinite(seconds) && seconds > 0 ? seconds : null;
};
