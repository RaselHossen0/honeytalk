/** API-ready types for Lucky Gift Management */

export interface LuckyGift {
  id: string | number;
  number: number;
  giftName: string;
  imageUrl?: string;
  giftPrice: number | string;
  prizePoolBalance: number | string;
  winningProbability: string;
  winningMultiple: string;
  status: 'Valid' | 'Invalid' | string;
  creationTime: string;
}
