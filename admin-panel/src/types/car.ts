/** Types for Car Management (Prop Management) */

export interface Car {
  id: number;
  number: number;
  vehicleName: string;
  vehicleCover: string;
  sort: number;
  status: 'Unban' | 'Ban';
  svgaUrl?: string;
}

export interface CarPrice {
  id: number;
  number: number;
  vehicleName: string;
  diamond: number;
  days: string;
  points: number;
  sort: number;
  status: 'Valid' | 'Invalid';
}

export interface CarPurchaseRecord {
  id: number;
  number: number;
  userNickname: string;
  userId: number;
  purchasedVehicle: string;
  consumptionAmount: number;
  time: string;
  expirationTime: string;
}

export interface CarGiftRecord {
  id: number;
  number: number;
  regularUser: string;
  userId: number;
  type: string;
  giftedTimeDays: number;
  note: string;
  addTime: string;
}
