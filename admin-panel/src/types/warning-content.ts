/** API-ready types for Warning Content List */

export interface WarningContent {
  id: number;
  number: number;
  content: string;
  status: 'Valid' | 'Invalid';
}
