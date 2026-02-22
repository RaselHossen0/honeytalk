/** API-ready types for Article Management */

export interface Article {
  id: number;
  number: number;
  articleTitle: string;
  category: string;
  status: 'Valid' | 'Invalid';
  content: string;
  creationTime: string;
  updateTime: string;
  sort: number;
  clickCount: number;
}

export interface ArticlePayload {
  articleTitle: string;
  category: string;
  content?: string;
  status?: 'Valid' | 'Invalid';
  sort?: number;
}
