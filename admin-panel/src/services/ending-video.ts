/**
 * Live Ending Video API service.
 * Replace demo data with actual API calls when backend is ready.
 */

import type { LiveEndingVideo, LiveEndingVideoFilters } from '@/types/ending-video';

const ENDPOINT = '/live/ending-video';

const DEMO_ROWS: LiveEndingVideo[] = [
  {
    id: 1,
    roomNumber: 14285,
    anchorId: 167034,
    anchorNickname: 'king',
    liveStreamTitle: 'Sing with me',
    totalNumberOfPeople: 0,
    coin: 0,
    status: 'Live stream ended',
    type: 'Interactive chat room',
    category: 'Live room.',
    isCharged: 'No',
    creationTime: '2026-02-14 12:35:20',
    endTime: '2026-01-12 03:36:41',
    liveStreamingDuration: '00:02:26',
  },
  {
    id: 2,
    roomNumber: 14284,
    anchorId: 167120,
    anchorNickname: 'ib2030',
    liveStreamTitle: 'Language Exchange Café',
    totalNumberOfPeople: 1,
    coin: 14380,
    status: 'Live stream ended',
    type: 'Interactive chat room',
    category: 'Voice room',
    isCharged: 'No',
    creationTime: '2026-02-14 12:30:15',
    endTime: '2026-02-14 13:15:45',
    liveStreamingDuration: '00:43:30',
  },
  {
    id: 3,
    roomNumber: 14283,
    anchorId: 168781,
    anchorNickname: 'ZETSU',
    liveStreamTitle: 'Global Friends Hub',
    totalNumberOfPeople: 2,
    coin: 500,
    status: 'Live stream ended',
    type: 'Interactive chat room',
    category: 'Live room.',
    isCharged: 'No',
    creationTime: '2026-02-14 11:20:00',
    endTime: '2026-02-14 12:05:22',
    liveStreamingDuration: '00:45:22',
  },
  {
    id: 4,
    roomNumber: 14282,
    anchorId: 166593,
    anchorNickname: 'Ffffewe',
    liveStreamTitle: 'হওকক',
    totalNumberOfPeople: 0,
    coin: 0,
    status: 'Live stream ended',
    type: 'Interactive chat room',
    category: 'Voice room',
    isCharged: 'No',
    creationTime: '2026-02-13 18:45:10',
    endTime: '2026-02-13 19:10:33',
    liveStreamingDuration: '00:25:23',
  },
  {
    id: 5,
    roomNumber: 14281,
    anchorId: 166586,
    anchorNickname: 'DOLLAR',
    liveStreamTitle: 'Music & Chill',
    totalNumberOfPeople: 3,
    coin: 2500,
    status: 'Live stream ended',
    type: 'Interactive chat room',
    category: 'Live room.',
    isCharged: 'No',
    creationTime: '2026-02-13 15:00:00',
    endTime: '2026-02-13 16:22:15',
    liveStreamingDuration: '01:22:15',
  },
];

export async function fetchLiveEndingVideos(
  filters?: LiveEndingVideoFilters,
  page = 1,
  perPage = 10
): Promise<{ data: LiveEndingVideo[]; total: number }> {
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
  if (filters?.liveStreamTitle) {
    const k = filters.liveStreamTitle.toLowerCase();
    data = data.filter((r) => r.liveStreamTitle.toLowerCase().includes(k));
  }
  if (filters?.category && filters.category !== 'all') {
    data = data.filter((r) => r.category.toLowerCase().includes(filters.category!.toLowerCase()));
  }

  const total = data.length;
  const start = (page - 1) * perPage;
  return { data: data.slice(start, start + perPage), total };
}
