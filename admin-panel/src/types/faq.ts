/** API-ready types for Frequently Asked Questions */

export type FaqGroup = 'Account' | 'Frequent' | 'Livestream' | 'Recharge' | 'Report';

export interface FaqItem {
  id: number;
  number: number;
  group: FaqGroup;
  question: string;
  answer: string;
  imageUrl?: string;
  frontEndDisplay: 'Yes' | 'No';
  sort: number;
  status: 'Valid' | 'Invalid';
}

export interface FaqPayload {
  group: FaqGroup;
  question: string;
  answer: string;
  imageUrl?: string;
  frontEndDisplay?: 'Yes' | 'No';
  sort?: number;
  status?: 'Valid' | 'Invalid';
}
