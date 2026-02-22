/** API-ready types for Income and Expenditure Records */

export interface IncomeExpenditureRecord {
  id: number;
  number: number;
  userId: number;
  userNickname: string;
  numberOfChanges: number;
  content: string;
  category: string;
  addTime: string;
}

export interface IncomeExpenditureFilters {
  userId?: string;
  user?: string;
  startTime?: string;
  endTime?: string;
  category?: string;
  type?: string;
}
