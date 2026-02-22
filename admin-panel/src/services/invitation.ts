/**
 * Invitation Management API service.
 * Replace demo data with actual API calls when backend is ready.
 */

import type {
  InvitationRecord,
  InvitationFilters,
  InvitationSubordinateRecord,
} from '@/types/invitation';

const ENDPOINT = '/users/invitations';

/** Demo: subordinate users invited by each inviter. Key = inviter userId */
const DEMO_SUBORDINATES: Record<number, InvitationSubordinateRecord[]> = {
  166586: [
    { id: 1, userId: 168530, userNickname: 'M33R', inviterNickname: 'DOLLAR', inviterId: 166586, inviterRewardDiamond: 0, totalRechargeAmount: 0, rechargeRewardDiamond: 0, joiningTime: '2025-11-14 18:37:02' },
    { id: 2, userId: 168531, userNickname: 'User2', inviterNickname: 'DOLLAR', inviterId: 166586, inviterRewardDiamond: 50, totalRechargeAmount: 500, rechargeRewardDiamond: 25, joiningTime: '2025-11-15 10:20:00' },
  ],
  166630: [
    { id: 3, userId: 168100, userNickname: 'ViyaSub1', inviterNickname: 'viya', inviterId: 166630, inviterRewardDiamond: 10, totalRechargeAmount: 100, rechargeRewardDiamond: 5, joiningTime: '2025-11-10 08:00:00' },
  ],
};

const DEMO_ROWS: InvitationRecord[] = [
  { id: 1, userId: 166586, inviteUserNickname: 'DOLLAR', totalInvitedUsers: 1, totalRevenue: 0.00, invitationRemainingBalance: 0.00 },
  { id: 2, userId: 166630, inviteUserNickname: 'viya', totalInvitedUsers: 7, totalRevenue: 36.00, invitationRemainingBalance: 186.00 },
  { id: 3, userId: 166968, inviteUserNickname: 'Mr_Rahu 🌍', totalInvitedUsers: 3, totalRevenue: 500.00, invitationRemainingBalance: 1000.00 },
  { id: 4, userId: 166977, inviteUserNickname: 'KING 🦙', totalInvitedUsers: 2, totalRevenue: 120.50, invitationRemainingBalance: 250.00 },
  { id: 5, userId: 167081, inviteUserNickname: 'Nasro', totalInvitedUsers: 5, totalRevenue: 89.00, invitationRemainingBalance: 0.00 },
  { id: 6, userId: 167132, inviteUserNickname: 'MR. Ǝ €lix00/', totalInvitedUsers: 4, totalRevenue: 256.75, invitationRemainingBalance: 520.00 },
  { id: 7, userId: 167200, inviteUserNickname: 'StarGazer', totalInvitedUsers: 1, totalRevenue: 15.00, invitationRemainingBalance: 15.00 },
  { id: 8, userId: 167255, inviteUserNickname: 'OceanView', totalInvitedUsers: 9, totalRevenue: 420.00, invitationRemainingBalance: 800.00 },
  { id: 9, userId: 167310, inviteUserNickname: 'SkyWalker', totalInvitedUsers: 6, totalRevenue: 0.00, invitationRemainingBalance: 0.00 },
  { id: 10, userId: 167380, inviteUserNickname: 'FireDragon', totalInvitedUsers: 2, totalRevenue: 75.25, invitationRemainingBalance: 150.00 },
];

export async function fetchInvitationRecords(
  filters?: InvitationFilters,
  page = 1,
  perPage = 10
): Promise<{ data: InvitationRecord[]; total: number }> {
  // TODO: return api.get<{ data: InvitationRecord[]; total: number }>(`${ENDPOINT}?page=${page}&perPage=${perPage}`, token)
  await new Promise((r) => setTimeout(r, 300));

  let data = [...DEMO_ROWS];
  if (filters?.invitingUsersId) {
    data = data.filter((r) => String(r.userId).includes(filters.invitingUsersId!));
  }
  if (filters?.secondLevelInviterId) {
    data = data.filter((r) => r.superiorInviter?.includes(filters.secondLevelInviterId!));
  }
  if (filters?.thirdLevelInviterId) {
    data = data.filter((r) => r.inviterFromSuperior?.includes(filters.thirdLevelInviterId!));
  }

  const total = data.length;
  const start = (page - 1) * perPage;
  return { data: data.slice(start, start + perPage), total };
}

/**
 * Fetch subordinate/invited users for a specific inviter (View Details).
 */
export async function fetchInvitationSubordinates(
  inviterId: number,
  filters?: { userId?: string },
  page = 1,
  perPage = 10
): Promise<{ data: InvitationSubordinateRecord[]; total: number }> {
  // TODO: return api.get(`${ENDPOINT}/${inviterId}/subordinates`, { params: { ...filters, page, perPage } })
  await new Promise((r) => setTimeout(r, 200));
  let data = DEMO_SUBORDINATES[inviterId] ?? [];
  if (filters?.userId) {
    data = data.filter((r) => String(r.userId).includes(filters.userId!));
  }
  const total = data.length;
  const start = (page - 1) * perPage;
  return { data: data.slice(start, start + perPage), total };
}
