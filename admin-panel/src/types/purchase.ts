/** API-ready types for Purchase Rule List */

export interface PurchaseRule {
  id: string | number;
  number: number;
  name: string;
  diamonds: number;
  price: number;
  applePayDiamonds: number;
  applePayPrice: number;
  appleProjectId: string;
  diamondGifting: number;
  googlePay?: string;
  sort: number;
  status: 'Valid' | 'Invalid';
}

export interface PurchaseRuleCreate {
  name: string;
  diamonds: number;
  price: number;
  applePayDiamonds: number;
  applePayPrice: number;
  appleProjectId: string;
  diamondGifting: number;
  googlePay?: string;
  sort: number;
  status?: 'Valid' | 'Invalid';
}

export interface PurchaseRuleUpdate extends Partial<PurchaseRuleCreate> {}
