export interface Article {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  imageHint: string;
  category: string;
  publishedAt: string;
  views: number;
  isUrgent: boolean;
}
