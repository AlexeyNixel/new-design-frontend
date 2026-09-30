export interface Achievement {
  id: string;
  label: string;
  count: string;
  /** Ссылка из админки (если появится); иначе ссылка подбирается по label */
  url?: string | null;
  createdAt: string;
  isDeleted: boolean;
}
