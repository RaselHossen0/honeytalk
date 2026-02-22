/** API-ready types for Fancy Number Management */

export interface FancyNumber {
  id: number;
  fancyNumber: string;
  userId: number;
  anchorNickname: string;
  purchased: boolean;
  price: number;
  type: 'Ordinary' | 'Noble';
}

export interface FancyNumberFilters {
  fancyNumberId?: string;
  userNickname?: string;
  userId?: string;
  uid?: string;
  purchased?: string;
  type?: string;
}

export interface FancyNumberPayload {
  fancyNumber: string;
  price: number;
  type: 'Ordinary' | 'Noble';
}

export interface FancyNumberConsumptionRecord {
  id: number;
  number: number;
  user: string;
  userId: number;
  purchasingGoodAccountName: string;
  consumptionAmount: number;
  time: string;
}

export interface FancyNumberConsumptionFilters {
  userId?: string;
}
