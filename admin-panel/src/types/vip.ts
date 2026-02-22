/** VIP member management types */

export interface VIPPurchaseRule {
  id: number;
  number: number;
  name: string;
  purchaseDays: number;
  price: number;
}

export interface VIPConsumptionRecord {
  id: number;
  number: number;
  user: string;
  userId: number;
  vipName: string;
  consumptionAmount: number;
  time: string;
}
