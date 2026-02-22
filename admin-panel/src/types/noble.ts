/** API-ready types for Noble Management */

export interface NobleType {
  id: number;
  number: number;
  nobleName: string;
  nobleIconUrl?: string;
  nobleInsigniaUrl?: string;
  nobleCardUrl?: string;
  nobleAvatarFrameUrl?: string;
  chatBackgroundColor: string;
  sort: number;
  status: 'Unban' | 'Ban';
}

export interface NobleTypePayload {
  nobleName: string;
  nobleIconUrl?: string;
  nobleInsigniaUrl?: string;
  nobleCardUrl?: string;
  nobleAvatarFrameUrl?: string;
  chatBackgroundColor: string;
  sort: number;
  status?: 'Unban' | 'Ban';
}

export interface NoblePrivilege {
  id: number;
  number: number;
  nobleName: string;
  nobleType: string;
  nobleDetailsTitle: string;
  imageUrl?: string;
  nobleDetails: string;
  sort: number;
  status: 'Unban' | 'Ban';
}

export interface NoblePrivilegePayload {
  nobleName: string;
  nobleType: string;
  nobleDetailsTitle: string;
  imageUrl?: string;
  nobleDetails: string;
  sort: number;
  status?: 'Unban' | 'Ban';
}

export interface NoblePrivilegeFilters {
  nobleClassification?: string;
  noblePrivilege?: string;
}

export interface NoblePrivilegeConfig {
  id: number;
  number: number;
  nobleType: string;
  iconUrl?: string;
  unselectedIconUrl?: string;
  sort: number;
  status: 'Unban' | 'Ban';
}

export interface NoblePrivilegeConfigPayload {
  nobleType: string;
  iconUrl?: string;
  unselectedIconUrl?: string;
  sort: number;
  status?: 'Unban' | 'Ban';
}

export interface NobleRecharge {
  id: number;
  number: number;
  amount: number;
  time: string;
  name: string;
  sort: number;
  status: string;
}

export interface NobleRechargeRecord {
  id: number;
  number: number;
  userId: number;
  userNickname: string;
  nobleName: string;
  consumptionAmount: number;
  addTime: string;
}

export interface NobleGiftRecord {
  id: number;
  number: number;
  userId: number;
  regularUser: string;
  type: string;
  giftedTimeDays: number;
  note: string;
  addTime: string;
}
