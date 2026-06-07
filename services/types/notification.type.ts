export interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'error' | 'warning';
  postId: string;
}
