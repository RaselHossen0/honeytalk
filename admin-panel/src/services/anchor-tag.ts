/**
 * Anchor Tags API service.
 * Replace demo data with actual api calls when backend is ready.
 */

import type { AnchorTag, AnchorTagCreate, AnchorTagUpdate } from '@/types/anchor-tag';
import { ANCHOR_TAGS_DEMO } from '@/lib/demo-data';

const ENDPOINT = '/users/anchor-tags';

export async function fetchAnchorTags(
  page = 1,
  perPage = 10
): Promise<{ data: AnchorTag[]; total: number }> {
  // TODO: return api.get<{ data: AnchorTag[]; total: number }>(...)
  const data = [...ANCHOR_TAGS_DEMO];
  const total = data.length;
  const start = (page - 1) * perPage;
  return { data: data.slice(start, start + perPage), total };
}

export async function createAnchorTag(body: AnchorTagCreate): Promise<AnchorTag> {
  // TODO: return api.post<AnchorTag>(ENDPOINT, body, token)
  const id = Math.max(...ANCHOR_TAGS_DEMO.map((r) => r.id), 0) + 1;
  return { id, ...body };
}

export async function updateAnchorTag(id: number, body: AnchorTagUpdate): Promise<AnchorTag> {
  // TODO: return api.put<AnchorTag>(`${ENDPOINT}/${id}`, body, token)
  const existing = ANCHOR_TAGS_DEMO.find((r) => r.id === id) ?? ANCHOR_TAGS_DEMO[0];
  return { ...existing, ...body };
}

export async function deleteAnchorTag(id: number): Promise<void> {
  // TODO: await api.delete(`${ENDPOINT}/${id}`, token)
}
