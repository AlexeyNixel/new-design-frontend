import type { GameStatus } from '~~/services/types/game.type';

/** Человекочитаемая подпись статуса — бэк отдаёт только сам enum-код. */
export const GameStatusLabels: Record<GameStatus, string> = {
  IN_STOCK: 'В фонде',
  ON_HANDS: 'На руках',
  TEMPORARILY_UNAVAILABLE: 'Временно недоступна',
  WRITTEN_OFF: 'Списана',
  LOST: 'Утеряна',
  DAMAGED: 'Пришла в негодность',
};

/** Игру можно посмотреть/забронировать — не списана, не утеряна, не повреждена. */
export function isGameAvailable(status: GameStatus): boolean {
  return status !== 'WRITTEN_OFF' && status !== 'LOST' && status !== 'DAMAGED';
}
