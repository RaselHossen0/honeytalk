/**
 * Bonus Receive & Receive Validation API service.
 * Replace demo data with actual API calls when backend is ready.
 */

import type { BonusReceiveRecord, ReceiveValidationRecord } from '@/types/bonus-receive';

const DEMO_BONUS_RECEIVE: BonusReceiveRecord[] = [
  { id: 1, anchorId: 246890, anchorName: 'demo', agentId: 2564, coin: 100000 },
  { id: 2, anchorId: 571157, anchorName: 'Priyadarshini Saha', agentId: 2654, coin: 986541 },
  { id: 3, anchorId: 608116, anchorName: 'Anjali Shaw', agentId: 2654, coin: 215468 },
  { id: 4, anchorId: 168422, anchorName: 'Bogo168422', agentId: 2564, coin: 50000 },
  { id: 5, anchorId: 166586, anchorName: 'DOLLAR', agentId: 2654, coin: 75000 },
  { id: 6, anchorId: 167902, anchorName: 'prem official', agentId: 2564, coin: 320000 },
  { id: 7, anchorId: 168530, anchorName: 'M33R', agentId: 2654, coin: 125000 },
];

const DEMO_RECEIVE_VALIDATION: ReceiveValidationRecord[] = [
  { id: 1, receiveFromId: 563256, receiveFromName: 'Zentro', receiveType: 'Lucky Gift', anchorId: 246890, anchorName: 'demo', coin: 152, action: 'Valid' },
  { id: 2, receiveFromId: 569854, receiveFromName: 'Nexora', receiveType: 'call', anchorId: 246890, anchorName: 'demo', coin: 4216, action: 'Valid' },
  { id: 3, receiveFromId: 568012, receiveFromName: 'Velora', receiveType: 'gift', anchorId: 246890, anchorName: 'demo', coin: 2145, action: 'Invalid' },
  { id: 4, receiveFromId: 570123, receiveFromName: 'Astra', receiveType: 'Luxary gift', anchorId: 246890, anchorName: 'demo', coin: 5000, action: 'Valid' },
  { id: 5, receiveFromId: 571234, receiveFromName: 'Lumina', receiveType: 'gift', anchorId: 246890, anchorName: 'demo', coin: 800, action: 'Invalid' },
  { id: 6, receiveFromId: 572345, receiveFromName: 'Nova', receiveType: 'call', anchorId: 246890, anchorName: 'demo', coin: 3500, action: 'Valid' },
  { id: 7, receiveFromId: 573456, receiveFromName: 'Orion', receiveType: 'Lucky Gift', anchorId: 571157, anchorName: 'Priyadarshini Saha', coin: 1234, action: 'Valid' },
  { id: 8, receiveFromId: 574567, receiveFromName: 'Stella', receiveType: 'gift', anchorId: 571157, anchorName: 'Priyadarshini Saha', coin: 5678, action: 'Invalid' },
];

export async function fetchBonusReceiveList(): Promise<BonusReceiveRecord[]> {
  await new Promise((r) => setTimeout(r, 200));
  return [...DEMO_BONUS_RECEIVE];
}

export async function fetchReceiveValidationList(
  filters?: { anchorId?: number; agentId?: number }
): Promise<ReceiveValidationRecord[]> {
  await new Promise((r) => setTimeout(r, 200));
  let data = [...DEMO_RECEIVE_VALIDATION];
  if (filters?.anchorId) {
    data = data.filter((r) => r.anchorId === filters.anchorId);
  }
  return data;
}

export async function updateReceiveValidationAction(
  id: number,
  action: 'Valid' | 'Invalid'
): Promise<void> {
  await new Promise((r) => setTimeout(r, 150));
  // In real app: return api.patch(`/receive-validation/${id}`, { action });
}
