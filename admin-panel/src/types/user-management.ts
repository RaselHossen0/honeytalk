/** API-ready types for User Management (Robot avatar) */

export interface UserManagementRecord {
  id: number;
  userId: number;
  nickname: string;
  avatar?: string;
  isRobotAvatar: boolean;
  country: string;
  countryCode?: string;
  phone: string;
  diamonds: number;
  consumptionAmount: number;
  withdrawableBalance: number;
  coinAccumulated?: number;
  recommended?: boolean;
  certification?: string;
  points?: number;
  follow?: number;
  fans?: number;
  level?: string;
  permanentBan?: boolean;
  fancyNumber?: string;
  totalViewers?: number;
  registerIp?: string;
  loginIp?: string;
  deviceInfo?: string;
  email?: string;
  facebook?: string;
  googleId?: string;
  appleId?: string;
  inviter?: string;
  giftRevenue?: boolean;
  status?: string;
  isVip?: boolean;
  disablePopular?: boolean;
  globallyMuteIm?: boolean;
  loginMethod?: string;
  registrationTime?: string;
  valid?: boolean;
  type?: string;
  vip?: string;
}

export interface UserManagementFilters {
  userId?: string;
  nickname?: string;
  phone?: string;
  robotAvatarOnly?: boolean;
  equipmentNo?: string;
  registerIp?: string;
  email?: string;
  googleId?: string;
  appleId?: string;
  valid?: string;
  type?: string;
  vip?: string;
  country?: string;
  registrationTimeStart?: string;
  registrationTimeEnd?: string;
}
