/** API-ready types for Category Management (Live) */

export interface LiveCategory {
  id: number;
  number: number;
  categoryName: string;
  name?: string;
  status: 'Valid' | 'Invalid';
  sort: number;
}
