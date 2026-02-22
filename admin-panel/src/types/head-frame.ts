/** Head Frame Management API-ready types */

export interface HeadFrame {
  id: number;
  number: number;
  name: string;
  price: number;
  timeDays: number;
  imageUrl: string;
  unban: 'Yes' | 'No';
  sort: number;
}

export interface HeadFrameConsumptionRecord {
  id: number;
  number: number;
  userId: number;
  regularUser: string;
  name: string;
  type: string;
  status: string;
  consumptionAmount: number;
  addTime: string;
  endTime: string;
}

export interface HeadFrameGiftRecord {
  id: number;
  number: number;
  userId: number;
  regularUser: string;
  type: string;
  giftedTimeDays: number;
  note: string;
  addTime: string;
}
