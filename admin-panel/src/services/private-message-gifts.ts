/**
 * Private Message Gift Statistics API service.
 * Replace demo data with actual api calls when backend is ready.
 */

import type {
  PrivateMessageGiftStat,
  PrivateMessageGiftFilters,
  PrivateMessageGiftDetail,
  PrivateMessageGiftDetailFilters,
} from '@/types/private-message-gifts';
import { PRIVATE_MESSAGE_GIFTS_DEMO, PRIVATE_MESSAGE_GIFT_DETAILS_DEMO } from '@/lib/demo-data';

const ENDPOINT = '/users/private-message-gifts';

export async function fetchPrivateMessageGiftStats(
  filters?: PrivateMessageGiftFilters,
  page = 1,
  perPage = 10
): Promise<{ data: PrivateMessageGiftStat[]; total: number }> {
  // TODO: return api.get<{ data: PrivateMessageGiftStat[]; total: number }>(...)
  let data = [...PRIVATE_MESSAGE_GIFTS_DEMO];
  if (filters?.anchorId) {
    data = data.filter((r) => String(r.anchorId).includes(filters.anchorId!));
  }
  if (filters?.anchorNickname) {
    data = data.filter((r) =>
      r.anchorNickname.toLowerCase().includes(filters.anchorNickname!.toLowerCase())
    );
  }
  const total = data.length;
  const start = (page - 1) * perPage;
  return { data: data.slice(start, start + perPage), total };
}

/**
 * Fetch gift details for a specific anchor (users who sent gifts to this anchor).
 */
export async function fetchPrivateMessageGiftDetails(
  anchorId: number,
  filters?: PrivateMessageGiftDetailFilters,
  page = 1,
  perPage = 10
): Promise<{
  data: PrivateMessageGiftDetail[];
  total: number;
  totalRevenue: number;
  totalNumberOfPeople: number;
}> {
  // TODO: return api.get(...)
  let data = PRIVATE_MESSAGE_GIFT_DETAILS_DEMO[anchorId]
    ? [...PRIVATE_MESSAGE_GIFT_DETAILS_DEMO[anchorId]]
    : [];
  if (filters?.userId) {
    data = data.filter((r) => String(r.userId).includes(filters.userId!));
  }
  if (filters?.userNickname) {
    data = data.filter((r) =>
      r.userNickname.toLowerCase().includes(filters.userNickname!.toLowerCase())
    );
  }
  const totalNumberOfPeople = new Set(data.map((r) => r.userId)).size;
  const totalRevenue = data.reduce((sum, r) => sum + r.totalRevenueCoin, 0);
  const total = data.length;
  const start = (page - 1) * perPage;
  return {
    data: data.slice(start, start + perPage),
    total,
    totalRevenue,
    totalNumberOfPeople,
  };
}
