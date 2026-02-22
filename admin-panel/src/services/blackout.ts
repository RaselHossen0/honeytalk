/**
 * Blackout Records API service.
 * Replace demo data with actual api calls when backend is ready.
 */

import type { BlackoutRecord, BlackoutFilters } from '@/types/blackout';
import { BLACKOUT_RECORDS_DEMO } from '@/lib/demo-data';

const ENDPOINT = '/users/blackout';

export async function fetchBlackoutRecords(
  filters?: BlackoutFilters,
  page = 1,
  perPage = 10
): Promise<{ data: BlackoutRecord[]; total: number }> {
  // TODO: return api.get<{ data: BlackoutRecord[]; total: number }>(...)
  let data = [...BLACKOUT_RECORDS_DEMO];
  if (filters?.userId) {
    data = data.filter(
      (r) =>
        String(r.userId).includes(filters.userId!) ||
        r.userNickname.toLowerCase().includes(filters.userId!.toLowerCase())
    );
  }
  if (filters?.identifying) {
    data = data.filter((r) =>
      r.identifying.toLowerCase().includes(filters.identifying!.toLowerCase())
    );
  }
  if (filters?.type && filters.type !== 'all') {
    data = data.filter((r) => r.ipOrDevice === filters.type);
  }
  if (filters?.status && filters.status !== 'all') {
    data = data.filter((r) => r.status === filters.status);
  }
  const total = data.length;
  const start = (page - 1) * perPage;
  return { data: data.slice(start, start + perPage), total };
}
