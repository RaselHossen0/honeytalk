/** API-ready types for Invitation Management */

export interface InvitationRecord {
  id: number;
  userId: number;
  inviteUserNickname: string;
  totalInvitedUsers: number;
  totalRevenue: number;
  invitationRemainingBalance: number;
  superiorInviter?: string;
  inviterFromSuperior?: string;
}

export interface InvitationFilters {
  invitingUsersId?: string;
  secondLevelInviterId?: string;
  thirdLevelInviterId?: string;
}

/** Subordinate/invited user record (for View Details page) */
export interface InvitationSubordinateRecord {
  id: number;
  userId: number;
  userNickname: string;
  inviterNickname: string;
  inviterId: number;
  inviterRewardDiamond: number;
  totalRechargeAmount: number;
  rechargeRewardDiamond: number;
  joiningTime: string;
}
