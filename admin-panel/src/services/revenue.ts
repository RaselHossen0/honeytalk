/**
 * Revenue Records API service.
 * Replace demo data with actual API calls when backend is ready.
 */

import type { RevenueRecord, RevenueFilters } from '@/types/revenue';

const ENDPOINT = '/users/revenue';

const DEMO_ROWS: Omit<RevenueRecord, 'id' | 'number'>[] = [
  { userId: 168781, userNickname: 'ZETSU', coin: 50, category: 'Gift', note: '1IndividualRomance', addTime: '2026-02-14 23:51:38' },
  { userId: 168748, userNickname: '『BS』 DOLL G☺ツ', coin: 30, category: 'Gift', note: '1IndividualA', addTime: '2026-02-14 23:51:28' },
  { userId: 168712, userNickname: 'Heart beat', coin: 100, category: 'Gift', note: '1IndividualHeart beat', addTime: '2026-02-14 23:50:15' },
  { userId: 168690, userNickname: 'Lucky Star', coin: 25, category: 'Gift', note: 'Romantic Gift', addTime: '2026-02-14 23:48:02' },
  { userId: 168655, userNickname: 'Sunshine', coin: 75, category: 'Gift', note: '1IndividualSun', addTime: '2026-02-14 23:45:30' },
  { userId: 168620, userNickname: 'Moonlight', coin: 120, category: 'Gift', note: 'Premium Gift', addTime: '2026-02-14 23:42:18' },
  { userId: 168588, userNickname: 'StarGazer', coin: 45, category: 'Gift', note: '1IndividualStar', addTime: '2026-02-14 23:40:05' },
  { userId: 168550, userNickname: 'OceanView', coin: 80, category: 'Gift', note: 'Beach Gift', addTime: '2026-02-14 23:38:42' },
  { userId: 168512, userNickname: 'SkyWalker', coin: 60, category: 'Gift', note: '1IndividualSky', addTime: '2026-02-14 23:35:20' },
  { userId: 168480, userNickname: 'FireDragon', coin: 90, category: 'Gift', note: 'Dragon Gift', addTime: '2026-02-14 23:32:10' },
];

export async function fetchRevenueRecords(
  filters?: RevenueFilters,
  page = 1,
  perPage = 10
): Promise<{ data: RevenueRecord[]; total: number }> {
  // TODO: return api.get<{ data: RevenueRecord[]; total: number }>(`${ENDPOINT}?page=${page}&perPage=${perPage}`, token)
  await new Promise((r) => setTimeout(r, 400));

  const total = 177954;
  const start = (page - 1) * perPage;
  const data: RevenueRecord[] = Array.from({ length: perPage }, (_, i) => {
    const row = DEMO_ROWS[i % DEMO_ROWS.length];
    const number = total - start - i;
    return {
      id: start + i + 1,
      number,
      ...row,
    };
  });

  return { data, total };
}
