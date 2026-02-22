/** API-ready types for Third Party Games */

export interface GameConfig {
  id: number;
  number: number;
  gameName: string;
  gameId: number;
  merchantId: string;
  gameIconUrl?: string;
  backgroundImageUrl?: string;
  type: string;
  frontendDomainUrl: string;
  status: 'Unban' | 'Ban';
  bannerDisplay: 'Unban' | 'Ban';
  sort: number;
  time: string;
}

export interface GameConfigPayload {
  gameName: string;
  gameId: number;
  merchantId: string;
  gameIconUrl?: string;
  backgroundImageUrl?: string;
  type: string;
  frontendDomainUrl: string;
  status?: 'Unban' | 'Ban';
  bannerDisplay?: 'Unban' | 'Ban';
  sort: number;
}

export interface GameRecord {
  id: number;
  number: number;
  gameName: string;
  identification: string;
  consumptionAmount: number;
  rewardAmount: number;
  platformRevenue: number;
  gameVictoryResult: string;
  time: string;
}

export interface GameRecordFilters {
  type?: string;
  identification?: string;
  timeStart?: string;
  timeEnd?: string;
}

export interface GameCoinRecord {
  id: number;
  number: number;
  userNickname: string;
  userId: number;
  gameName: string;
  identification: string;
  consumptionAmount: number;
  rewardAmount: number;
  gameVictoryResult: string;
  time: string;
}

export interface GameCoinRecordFilters {
  type?: string;
  userId?: string;
  identification?: string;
  timeStart?: string;
  timeEnd?: string;
}
