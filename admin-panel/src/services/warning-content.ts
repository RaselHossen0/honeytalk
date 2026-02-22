/**
 * Warning Content List API service.
 * Replace demo data with actual API calls when backend is ready.
 */

import type { WarningContent } from '@/types/warning-content';

const ENDPOINT = '/live/warning-content';

const DEMO_DATA: WarningContent[] = [
  { id: 1, number: 1, content: 'Please do not use pornographic content in the live broadcast', status: 'Valid' },
  { id: 2, number: 2, content: 'No hate speech or discriminatory content', status: 'Valid' },
  { id: 3, number: 3, content: 'Do not share personal information of others', status: 'Valid' },
  { id: 4, number: 4, content: 'Prohibited promotional content', status: 'Invalid' },
];

export async function fetchWarningContent(keyword?: string): Promise<WarningContent[]> {
  // TODO: return api.get(ENDPOINT, { params: { keyword } })
  await new Promise((r) => setTimeout(r, 200));
  if (keyword) {
    const k = keyword.toLowerCase();
    return DEMO_DATA.filter((r) => r.content.toLowerCase().includes(k));
  }
  return [...DEMO_DATA];
}

export async function deleteWarningContent(id: number): Promise<void> {
  // TODO: return api.delete(`${ENDPOINT}/${id}`)
  await new Promise((r) => setTimeout(r, 200));
}
