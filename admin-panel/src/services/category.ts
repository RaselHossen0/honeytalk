/**
 * Category Management (Live) API service.
 * Replace demo data with actual API calls when backend is ready.
 */

import type { LiveCategory } from '@/types/category';

const ENDPOINT = '/live/categories';

const DEMO_CATEGORIES: LiveCategory[] = [
  { id: 1, number: 7, categoryName: 'Sing', status: 'Valid', sort: 2 },
  { id: 2, number: 9, categoryName: 'Music', status: 'Valid', sort: 1 },
  { id: 3, number: 5, categoryName: 'Dance', status: 'Valid', sort: 3 },
  { id: 4, number: 4, categoryName: 'Chat', status: 'Valid', sort: 4 },
  { id: 5, number: 3, categoryName: 'Gaming', status: 'Invalid', sort: 5 },
];

export async function fetchCategories(): Promise<LiveCategory[]> {
  // TODO: return api.get(ENDPOINT)
  await new Promise((r) => setTimeout(r, 200));
  return [...DEMO_CATEGORIES];
}

export async function deleteCategory(id: number): Promise<void> {
  // TODO: return api.delete(`${ENDPOINT}/${id}`)
  await new Promise((r) => setTimeout(r, 200));
}

export async function updateCategory(
  id: number,
  payload: { categoryName?: string; name?: string; status?: 'Valid' | 'Invalid'; sort?: number }
): Promise<void> {
  // TODO: return api.patch(`${ENDPOINT}/${id}`, payload)
  await new Promise((r) => setTimeout(r, 200));
}

export async function createCategory(payload: {
  categoryName: string;
  name?: string;
  status?: 'Valid' | 'Invalid';
  sort: number;
}): Promise<LiveCategory> {
  // TODO: return api.post(ENDPOINT, payload)
  await new Promise((r) => setTimeout(r, 200));
  const maxId = Math.max(...DEMO_CATEGORIES.map((r) => r.id), 0);
  const maxNum = Math.max(...DEMO_CATEGORIES.map((r) => r.number), 0);
  return {
    id: maxId + 1,
    number: maxNum + 1,
    categoryName: payload.categoryName,
    name: payload.name,
    status: payload.status ?? 'Valid',
    sort: payload.sort,
  };
}
