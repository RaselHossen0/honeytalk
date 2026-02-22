/** API-ready types for Exchange Rules */

export interface ExchangeRule {
  id: string | number;
  number: number;
  diamonds: number;
  coin: number;
  status: 'Valid' | 'Invalid';
}

export interface ExchangeRuleCreate {
  diamonds: number;
  coin: number;
  status?: 'Valid' | 'Invalid';
}

export interface ExchangeRuleUpdate extends Partial<ExchangeRuleCreate> {}
