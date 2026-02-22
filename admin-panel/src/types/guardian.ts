/** Guardian Management API-ready types */

export interface GuardianCategory {
  id: number;
  number: number;
  name: string;
  imageUrl: string;
  privileges: string;
  sort: number;
}

export interface GuardianPriceConfig {
  id: number;
  number: number;
  guardianTypeName: string;
  guardianDays: number;
  consumptionAmount: number;
  guardianCategory: string;
  sort: number;
}

export interface GuardianPrivilege {
  id: number;
  number: number;
  name: string;
  selectedIconUrl: string;
  defaultIconUrl: string;
  sort: number;
}

export interface GuardianRecord {
  id: number;
  number: number;
  userId: number;
  userNickname: string;
  guardianTypeName: string;
  daysGuarded: number;
  consumptionAmount: number;
  anchorId: number;
  anchorNickname: string;
  startTime: string;
  endTime: string;
  status: string;
}
