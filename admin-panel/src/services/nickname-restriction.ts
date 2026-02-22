/**
 * Nickname Restriction API service.
 * Replace demo data with actual api calls when backend is ready.
 */

import type { NicknameRestriction, NicknameRestrictionCreate, NicknameRestrictionFilters } from '@/types/nickname-restriction';
import { NICKNAME_RESTRICTIONS_DEMO } from '@/lib/demo-data';

const ENDPOINT = '/system/nickname-restrictions';

/** Use demo data. Replace with: api.get<{ data: NicknameRestriction[]; total: number }>(...) */
export async function fetchNicknameRestrictions(
  filters?: NicknameRestrictionFilters,
  page = 1,
  perPage = 10
): Promise<{ data: NicknameRestriction[]; total: number }> {
  // TODO: const token = useAuthStore.getState().token;
  // TODO: return api.get<{ data: NicknameRestriction[]; total: number }>(`${ENDPOINT}?page=${page}&perPage=${perPage}&nickname=${filters?.nickname ?? ''}&id=${filters?.id ?? ''}`, token)
  let data = [...NICKNAME_RESTRICTIONS_DEMO];
  if (filters?.nickname) {
    data = data.filter((r) => r.nickname.toLowerCase().includes(filters.nickname!.toLowerCase()));
  }
  if (filters?.id) {
    data = data.filter((r) => String(r.id).includes(filters.id!));
  }
  const total = data.length;
  const start = (page - 1) * perPage;
  data = data.slice(start, start + perPage);
  return { data, total };
}

/** Use demo data. Replace with: return api.post<NicknameRestriction>(ENDPOINT, body, token) */
export async function createNicknameRestriction(body: NicknameRestrictionCreate): Promise<NicknameRestriction> {
  // TODO: const token = useAuthStore.getState().token;
  // TODO: return api.post<NicknameRestriction>(ENDPOINT, body, token)
  const id = Math.max(...NICKNAME_RESTRICTIONS_DEMO.map((r) => r.id), 0) + 1;
  return { id, nickname: body.nickname };
}

/** Use demo data. Replace with: await api.delete(`${ENDPOINT}/${id}`, token) */
export async function deleteNicknameRestriction(id: number): Promise<void> {
  // TODO: const token = useAuthStore.getState().token;
  // TODO: await api.delete(`${ENDPOINT}/${id}`, token)
}
