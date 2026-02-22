/** API-ready types for Revenue Records */

export interface RevenueRecord {
  id: number;
  number: number;
  userId: number;
  userNickname: string;
  coin: number;
  category: string;
  note: string;
  addTime: string;
}

export interface RevenueFilters {
  userTypes?: string[];
  category?: string;
  type?: string;
  startTime?: string;
  endTime?: string;
}
