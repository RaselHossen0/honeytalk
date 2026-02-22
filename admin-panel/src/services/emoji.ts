/**
 * Emoji Management API service.
 * Replace demo data with actual API calls when backend is ready.
 */

import type {
  EmojiClassification,
  EmojiClassificationPayload,
  Emoji,
  EmojiPayload,
  EmojiFilters,
} from '@/types/emoji';

const CLASSIFICATION_ENDPOINT = '/api/emoji/classification';
const EMOJI_LIST_ENDPOINT = '/api/emoji/list';

const PLACEHOLDER = 'https://placehold.co/48x48/e0e0e0/999?text=😀';

const DEMO_CLASSIFICATIONS: EmojiClassification[] = [
  { id: 1, number: 3, categoryName: 'Emotions', imageUrl: PLACEHOLDER, status: 'Unban', sort: 6 },
  { id: 2, number: 4, categoryName: 'Heart', imageUrl: PLACEHOLDER, status: 'Unban', sort: 5 },
  { id: 3, number: 5, categoryName: 'Food and drink', imageUrl: PLACEHOLDER, status: 'Unban', sort: 2 },
  { id: 4, number: 6, categoryName: 'Activities and events', imageUrl: PLACEHOLDER, status: 'Unban', sort: 1 },
  { id: 5, number: 7, categoryName: 'Animals', imageUrl: PLACEHOLDER, status: 'Unban', sort: 3 },
  { id: 6, number: 8, categoryName: 'Flag', imageUrl: PLACEHOLDER, status: 'Unban', sort: 4 },
];

const DEMO_EMOJIS: Emoji[] = [
  { id: 1, number: 118, name: 'Slot-machine', imageUrl: PLACEHOLDER, categoryName: 'Activities and events', status: 'Unban', sort: 31 },
  { id: 2, number: 99, name: 'Wrapped-gift', imageUrl: PLACEHOLDER, categoryName: 'Activities and events', status: 'Unban', sort: 30 },
  { id: 3, number: 98, name: 'Softball', imageUrl: PLACEHOLDER, categoryName: 'Activities and events', status: 'Unban', sort: 29 },
  { id: 4, number: 97, name: 'Volcano', imageUrl: PLACEHOLDER, categoryName: 'Activities and events', status: 'Unban', sort: 28 },
  { id: 5, number: 96, name: 'Flying-saucer', imageUrl: PLACEHOLDER, categoryName: 'Activities and events', status: 'Unban', sort: 27 },
  { id: 6, number: 95, name: 'Rose', imageUrl: PLACEHOLDER, categoryName: 'Activities and events', status: 'Unban', sort: 26 },
  { id: 7, number: 94, name: 'Heart eyes', imageUrl: PLACEHOLDER, categoryName: 'Emotions', status: 'Unban', sort: 25 },
  { id: 8, number: 93, name: 'Red heart', imageUrl: PLACEHOLDER, categoryName: 'Heart', status: 'Unban', sort: 24 },
  { id: 9, number: 92, name: 'Wine glass', imageUrl: PLACEHOLDER, categoryName: 'Food and drink', status: 'Unban', sort: 23 },
];

let classificationData = [...DEMO_CLASSIFICATIONS];
let emojiData = [...DEMO_EMOJIS];

// Emoji Classification
export async function fetchEmojiClassifications(): Promise<EmojiClassification[]> {
  await new Promise((r) => setTimeout(r, 200));
  return [...classificationData];
}

export async function createEmojiClassification(payload: EmojiClassificationPayload): Promise<EmojiClassification> {
  await new Promise((r) => setTimeout(r, 200));
  const maxNum = Math.max(0, ...classificationData.map((r) => r.number));
  const newItem: EmojiClassification = {
    id: 100 + classificationData.length,
    number: maxNum + 1,
    categoryName: payload.categoryName,
    imageUrl: payload.imageUrl,
    status: payload.status ?? 'Unban',
    sort: payload.sort,
  };
  classificationData.push(newItem);
  return newItem;
}

export async function updateEmojiClassification(id: number, payload: Partial<EmojiClassificationPayload>): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  classificationData = classificationData.map((r) => (r.id === id ? { ...r, ...payload } : r));
}

export async function deleteEmojiClassification(id: number): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  classificationData = classificationData.filter((r) => r.id !== id);
}

export async function toggleEmojiClassificationStatus(id: number): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  classificationData = classificationData.map((r) =>
    r.id === id ? { ...r, status: r.status === 'Unban' ? 'Ban' : 'Unban' } : r
  );
}

// Emoji List
export async function fetchEmojis(
  filters?: EmojiFilters,
  page = 1,
  perPage = 10
): Promise<{ data: Emoji[]; total: number }> {
  await new Promise((r) => setTimeout(r, 200));
  let data = [...emojiData];
  if (filters?.name) {
    const k = filters.name.toLowerCase();
    data = data.filter((r) => r.name.toLowerCase().includes(k));
  }
  if (filters?.categoryName && filters.categoryName !== 'all') {
    data = data.filter((r) => r.categoryName === filters.categoryName);
  }
  if (filters?.status && filters.status !== 'all') {
    data = data.filter((r) => r.status === filters.status);
  }
  const total = data.length;
  const start = (page - 1) * perPage;
  const slice = data.slice(start, start + perPage);
  return { data: slice, total };
}

export async function createEmoji(payload: EmojiPayload): Promise<Emoji> {
  await new Promise((r) => setTimeout(r, 200));
  const maxNum = Math.max(0, ...emojiData.map((r) => r.number));
  const newItem: Emoji = {
    id: 200 + emojiData.length,
    number: maxNum + 1,
    name: payload.name,
    imageUrl: payload.imageUrl,
    categoryName: payload.categoryName,
    status: payload.status ?? 'Unban',
    sort: payload.sort,
  };
  emojiData.push(newItem);
  return newItem;
}

export async function updateEmoji(id: number, payload: Partial<EmojiPayload>): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  emojiData = emojiData.map((r) => (r.id === id ? { ...r, ...payload } : r));
}

export async function deleteEmoji(id: number): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  emojiData = emojiData.filter((r) => r.id !== id);
}

export async function getEmojiCategories(): Promise<string[]> {
  const cats = await fetchEmojiClassifications();
  return cats.map((c) => c.categoryName);
}
