/** API-ready types for Article Category Management */

export type ArticleType = 'Regular article' | 'Announcement article' | 'News announcement';

export interface ArticleCategory {
  id: number;
  number: number;
  categoryName: string;
  articleType: ArticleType;
  status: 'Valid' | 'Invalid';
  sort: number;
}

export interface ArticleCategoryPayload {
  categoryName: string;
  articleType: ArticleType;
  status?: 'Valid' | 'Invalid';
  sort?: number;
}
