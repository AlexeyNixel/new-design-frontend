export interface Menu {
  id: string;
  oldId: number;
  title: string;
  isDeleted: boolean;
  menuType: string;
  menuItems: unknown[];
}
