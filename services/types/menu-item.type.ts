export interface MenuItem {
  document: Document;
  id: string;
  isDeleted: boolean;
  link: string;
  menuId: string;
  menuItemType: string;
  oldId: number;
  position: number;
  slug: string;
  title: string;
}

export interface Document {
  content: string;
  fileId: string;
  id: string;
  isDeleted: boolean;
  menuItemId: string;
  oldId: number;
  title: string;
}
