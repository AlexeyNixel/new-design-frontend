export interface Slide {
  createdAt: string;
  desc: string;
  entry: any;
  entryId: string;
  fileId: string;
  id: string;
  image: any;
  /** Мобильный формат изображения (портретный кроп). Пока бэкенд его не отдаёт —
   *  используется как необязательное поле, слайдер сам подставляет image как фолбэк. */
  imageMobile?: any;
  isDeleted: boolean;
  oldId: number;
  position: number;
  title: string;
  url: string;
  post: any;
}
