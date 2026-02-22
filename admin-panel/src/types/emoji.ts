/** API-ready types for Emoji Management */

export interface EmojiClassification {
  id: number;
  number: number;
  categoryName: string;
  imageUrl?: string;
  status: 'Unban' | 'Ban';
  sort: number;
}

export interface EmojiClassificationPayload {
  categoryName: string;
  imageUrl?: string;
  status?: 'Unban' | 'Ban';
  sort: number;
}

export interface Emoji {
  id: number;
  number: number;
  name: string;
  imageUrl?: string;
  categoryName: string;
  status: 'Unban' | 'Ban';
  sort: number;
}

export interface EmojiPayload {
  name: string;
  imageUrl?: string;
  categoryName: string;
  status?: 'Unban' | 'Ban';
  sort: number;
}

export interface EmojiFilters {
  name?: string;
  categoryName?: string;
  status?: string;
}
