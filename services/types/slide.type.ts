export interface SlideImage {
  path: string;
  preview?: string;
}

export interface Slide {
  createdAt: string;
  desc: string;
  entry: unknown;
  entryId: string;
  fileId: string;
  id: string;
  image: SlideImage;
  imageMobile?: SlideImage;
  isDeleted: boolean;
  oldId: number;
  position: number;
  title: string;
  url: string;
  post: { slug: string } | null;
}
