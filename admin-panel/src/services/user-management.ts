/**
 * User Management (Robot avatar) API service.
 * Replace demo data with actual api calls when backend is ready.
 */

import type { UserManagementRecord, UserManagementFilters } from '@/types/user-management';
import { USER_MANAGEMENT_DEMO } from '@/lib/demo-data';

const ENDPOINT = '/users';

export async function fetchUsers(
  filters?: UserManagementFilters,
  page = 1,
  perPage = 10
): Promise<{ data: UserManagementRecord[]; total: number }> {
  // TODO: return api.get<{ data: UserManagementRecord[]; total: number }>(...)
  let data = [...USER_MANAGEMENT_DEMO];
  if (filters?.userId) {
    data = data.filter((r) => String(r.userId).includes(filters.userId!));
  }
  if (filters?.nickname) {
    data = data.filter((r) =>
      r.nickname.toLowerCase().includes(filters.nickname!.toLowerCase())
    );
  }
  if (filters?.robotAvatarOnly) {
    data = data.filter((r) => r.isRobotAvatar);
  }
  const total = data.length;
  const start = (page - 1) * perPage;
  return { data: data.slice(start, start + perPage), total };
}
