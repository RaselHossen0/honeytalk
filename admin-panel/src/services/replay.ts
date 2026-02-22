/**
 * Replay List API service.
 * Replace demo data with actual API calls when backend is ready.
 */

import type { Replay, ReplayFilters } from '@/types/replay';

const ENDPOINT = '/live/replays';

const DEMO_ROWS: Replay[] = [
  {
    id: 1,
    roomNumber: 14285,
    anchorId: 167034,
    anchorNickname: 'king',
    liveStreamTitle: 'Sing with me',
    actualNumberOfViewers: 0,
    totalNumberOfPeople: 0,
    type: 'Interactive chat room',
    isCharged: 'No',
    login: 'No',
    creationTime: '2026-02-14 12:35:20',
    endTime: '2026-02-14 12:38:46',
  },
  {
    id: 2,
    roomNumber: 14284,
    anchorId: 167120,
    anchorNickname: 'ib2030',
    liveStreamTitle: 'Language Exchange Café',
    actualNumberOfViewers: 1,
    totalNumberOfPeople: 1,
    type: 'Interactive chat room',
    isCharged: 'No',
    login: 'No',
    creationTime: '2026-02-14 12:30:15',
    endTime: '2026-02-14 13:15:45',
  },
  {
    id: 3,
    roomNumber: 14283,
    anchorId: 168781,
    anchorNickname: 'ZETSU',
    liveStreamTitle: 'Global Friends Hub',
    actualNumberOfViewers: 2,
    totalNumberOfPeople: 2,
    type: 'Interactive chat room',
    isCharged: 'No',
    login: 'No',
    creationTime: '2026-02-14 11:20:00',
    endTime: '2026-02-14 12:05:22',
  },
  {
    id: 4,
    roomNumber: 14282,
    anchorId: 166588,
    anchorNickname: 'Silent 👑king',
    liveStreamTitle: 'Ask Me Anything LIVE',
    actualNumberOfViewers: 5,
    totalNumberOfPeople: 8,
    type: 'Interactive chat room',
    isCharged: 'No',
    login: 'No',
    creationTime: '2025-11-26 08:40:39',
  },
  {
    id: 5,
    roomNumber: 14281,
    anchorId: 167123,
    anchorNickname: 'Bogo167123',
    liveStreamTitle: 'Good Day',
    actualNumberOfViewers: 3,
    totalNumberOfPeople: 12,
    type: 'Interactive chat room',
    isCharged: 'No',
    login: 'No',
    creationTime: '2025-11-25 14:22:10',
  },
  {
    id: 6,
    roomNumber: 14280,
    anchorId: 166600,
    anchorNickname: 'Sameer Gairhe',
    liveStreamTitle: 'Music Party',
    actualNumberOfViewers: 4,
    totalNumberOfPeople: 6,
    type: 'Interactive chat room',
    isCharged: 'No',
    login: 'No',
    creationTime: '2025-11-24 19:15:33',
  },
  ...Array.from({ length: 10 }, (_, i): Replay => ({
    id: 7 + i,
    roomNumber: 14279 - i,
    anchorId: 166600 + i,
    anchorNickname: `User${i}`,
    liveStreamTitle: `Replay ${i + 1}`,
    actualNumberOfViewers: i,
    totalNumberOfPeople: i + 2,
    type: 'Interactive chat room',
    isCharged: 'No',
    login: 'No',
    creationTime: `2025-11-2${3 - Math.floor(i / 5)} ${10 + i}:00:00`,
    endTime: `2025-11-2${3 - Math.floor(i / 5)} ${11 + i}:00:00`,
  })),
];

export async function fetchReplays(
  filters?: ReplayFilters,
  page = 1,
  perPage = 10
): Promise<{ data: Replay[]; total: number }> {
  // TODO: return api.get(`${ENDPOINT}?page=${page}&perPage=${perPage}`, { params: filters })
  await new Promise((r) => setTimeout(r, 300));

  let data = [...DEMO_ROWS];
  if (filters?.roomNumber) {
    data = data.filter((r) => String(r.roomNumber).includes(filters.roomNumber!));
  }
  if (filters?.anchorId) {
    data = data.filter((r) => String(r.anchorId).includes(filters.anchorId!));
  }
  if (filters?.anchorNickname) {
    const k = filters.anchorNickname.toLowerCase();
    data = data.filter((r) => r.anchorNickname.toLowerCase().includes(k));
  }
  if (filters?.anchorTitle) {
    const k = filters.anchorTitle.toLowerCase();
    data = data.filter((r) => r.liveStreamTitle.toLowerCase().includes(k));
  }
  if (filters?.login && filters.login !== 'all') {
    data = data.filter((r) => r.login === filters.login);
  }
  if (filters?.creationTimeStart) {
    data = data.filter((r) => r.creationTime >= `${filters.creationTimeStart} 00:00:00`);
  }
  if (filters?.creationTimeEnd) {
    data = data.filter((r) => r.creationTime <= `${filters.creationTimeEnd} 23:59:59`);
  }

  const total = data.length;
  const start = (page - 1) * perPage;
  return { data: data.slice(start, start + perPage), total };
}

export async function deleteReplay(id: number): Promise<void> {
  // TODO: return api.delete(`${ENDPOINT}/${id}`)
  await new Promise((r) => setTimeout(r, 200));
}
