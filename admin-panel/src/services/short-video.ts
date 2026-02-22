/**
 * Short Video Management API service.
 * Replace demo data with actual API calls when backend is ready.
 */

import type {
  ShortVideo,
  ShortVideoFilters,
  ShortVideoComment,
  ShortVideoCommentFilters,
} from '@/types/short-video';

const VIDEOS_ENDPOINT = '/api/videos';
const COMMENTS_ENDPOINT = '/api/videos/comments';

const PLACEHOLDER = 'https://placehold.co/160x90/e0e0e0/666?text=Video';

const DEMO_VIDEOS: ShortVideo[] = [
  { id: 577, number: 577, publisherId: 166589, publisher: 'Snow', type: 'Video updates', publishContent: 'beautiful and sassy', videoThumbnailUrl: PLACEHOLDER, status: 'Valid', giftRevenue: 18720, recommended: 'Yes', releaseTime: '2022-07-11 10:17:28', review: 'Approved' },
  { id: 578, number: 578, publisherId: 166591, publisher: 'Gina', type: 'Video updates', publishContent: "let's dance", videoThumbnailUrl: PLACEHOLDER, status: 'Valid', giftRevenue: 520, recommended: 'Yes', releaseTime: '2022-07-12 14:22:10', review: 'Approved' },
  { id: 579, number: 579, publisherId: 166592, publisher: 'kurdei', type: 'Video updates', publishContent: 'Beauty Collection', videoThumbnailUrl: PLACEHOLDER, status: 'Valid', giftRevenue: 666, recommended: 'Yes', releaseTime: '2022-07-13 09:15:00', review: 'Approved' },
  { id: 580, number: 580, publisherId: 166593, publisher: 'Sweet', type: 'Video updates', publishContent: 'Cross-dressing video', videoThumbnailUrl: PLACEHOLDER, status: 'Valid', giftRevenue: null, recommended: 'Yes', releaseTime: '2022-07-14 16:30:45', review: 'Approved' },
  { id: 581, number: 581, publisherId: 166594, publisher: 'Ivanoo0', type: 'Video updates', publishContent: 'record your appearance', videoThumbnailUrl: PLACEHOLDER, status: 'Valid', giftRevenue: 1200, recommended: 'Yes', releaseTime: '2022-07-15 11:20:33', review: 'Approved' },
  { id: 582, number: 582, publisherId: 166595, publisher: 'User166595', type: 'Video updates', publishContent: 'street shot', videoThumbnailUrl: PLACEHOLDER, status: 'Valid', giftRevenue: 0, recommended: 'Yes', releaseTime: '2022-07-16 08:45:12', review: 'Approved' },
  { id: 583, number: 583, publisherId: 166596, publisher: 'Creator', type: 'Video updates', publishContent: "do you like me like this?", videoThumbnailUrl: PLACEHOLDER, status: 'Valid', giftRevenue: 3500, recommended: 'Yes', releaseTime: '2022-07-17 13:10:00', review: 'Approved' },
  { id: 584, number: 584, publisherId: 166597, publisher: 'Traveler', type: 'Video updates', publishContent: "Let's travel together", videoThumbnailUrl: PLACEHOLDER, status: 'Valid', giftRevenue: 890, recommended: 'Yes', releaseTime: '2022-07-18 17:55:22', review: 'Approved' },
  { id: 585, number: 585, publisherId: 166598, publisher: 'Vacation', type: 'Video updates', publishContent: 'my vacation', videoThumbnailUrl: PLACEHOLDER, status: 'Valid', giftRevenue: null, recommended: 'Yes', releaseTime: '2022-07-19 10:00:00', review: 'Approved' },
];

const DEMO_COMMENTS: ShortVideoComment[] = [
  { id: 1, number: 80571, miniVideoId: 577, userId: 168781, userNickname: 'ZETSU', content: 'Love that car', releaseTime: '2026-01-28 09:11:34' },
  { id: 2, number: 80570, miniVideoId: 577, userId: 166589, userNickname: 'Snow', content: 'great job 👍', releaseTime: '2026-01-27 14:22:10' },
  { id: 3, number: 80569, miniVideoId: 578, userId: 168748, userNickname: 'DOLL', content: 'demo', releaseTime: '2026-01-26 11:30:00' },
  { id: 4, number: 80568, miniVideoId: 578, userId: 166586, userNickname: 'Dollar', content: 'Amazing video!', releaseTime: '2026-01-25 16:45:22' },
  { id: 5, number: 80567, miniVideoId: 579, userId: 167001, userNickname: 'Star', content: 'So beautiful', releaseTime: '2026-01-24 09:15:33' },
  { id: 6, number: 80566, miniVideoId: 579, userId: 166600, userNickname: 'Wang', content: 'Nice work', releaseTime: '2026-01-23 12:20:00' },
  { id: 7, number: 80565, miniVideoId: 580, userId: 168530, userNickname: 'M33R', content: '🔥', releaseTime: '2026-01-22 18:10:45' },
  { id: 8, number: 80564, miniVideoId: 580, userId: 166789, userNickname: 'Nisha', content: 'Love it!', releaseTime: '2026-01-21 10:55:12' },
  { id: 9, number: 80563, miniVideoId: 581, userId: 167002, userNickname: 'Li', content: 'Great content', releaseTime: '2026-01-20 14:30:00' },
  { id: 10, number: 80562, miniVideoId: 582, userId: 166590, userNickname: 'User166590', content: 'Cool', releaseTime: '2026-01-19 09:00:00' },
];

let videosData = [...DEMO_VIDEOS];
let commentsData = [...DEMO_COMMENTS];

export async function fetchShortVideos(
  filters?: ShortVideoFilters,
  page = 1,
  perPage = 10
): Promise<{ data: ShortVideo[]; total: number }> {
  await new Promise((r) => setTimeout(r, 300));
  let data = videosData;
  if (filters?.miniVideoId) {
    data = data.filter((r) => String(r.id).includes(filters.miniVideoId!));
  }
  if (filters?.publisherId) {
    data = data.filter((r) => String(r.publisherId).includes(filters.publisherId!));
  }
  if (filters?.status && filters.status !== 'all') {
    data = data.filter((r) => r.status === filters.status);
  }
  if (filters?.recommended && filters.recommended !== 'all') {
    data = data.filter((r) => r.recommended === filters.recommended);
  }
  if (filters?.review && filters.review !== 'all') {
    data = data.filter((r) => r.review === filters.review);
  }
  if (filters?.releaseTimeStart) {
    data = data.filter((r) => r.releaseTime >= filters.releaseTimeStart!);
  }
  if (filters?.releaseTimeEnd) {
    data = data.filter((r) => r.releaseTime <= filters.releaseTimeEnd! + ' 23:59:59');
  }
  const total = data.length;
  const start = (page - 1) * perPage;
  const slice = data.slice(start, start + perPage);
  return { data: slice, total };
}

export async function deleteShortVideo(id: number): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  videosData = videosData.filter((r) => r.id !== id);
}

export async function fetchShortVideoComments(
  filters?: ShortVideoCommentFilters,
  page = 1,
  perPage = 10
): Promise<{ data: ShortVideoComment[]; total: number }> {
  await new Promise((r) => setTimeout(r, 300));
  let data = commentsData;
  if (filters?.userId) {
    data = data.filter((r) => String(r.userId).includes(filters.userId!));
  }
  if (filters?.miniVideoId) {
    data = data.filter((r) => String(r.miniVideoId).includes(filters.miniVideoId!));
  }
  if (filters?.keyword) {
    const k = filters.keyword.toLowerCase();
    data = data.filter((r) => r.content.toLowerCase().includes(k));
  }
  if (filters?.replyCommentNumber) {
    data = data.filter((r) => String(r.number).includes(filters.replyCommentNumber!));
  }
  const total = 281;
  const start = (page - 1) * perPage;
  const slice = data.slice(start, start + perPage);
  return { data: slice, total };
}

export async function deleteShortVideoComment(id: number): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  commentsData = commentsData.filter((r) => r.id !== id);
}

export async function batchDeleteShortVideoComments(ids: number[]): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  commentsData = commentsData.filter((r) => !ids.includes(r.id));
}
