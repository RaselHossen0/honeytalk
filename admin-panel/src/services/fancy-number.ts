/**
 * Fancy Number Management API service.
 * Replace demo data with actual API calls when backend is ready.
 */

import type {
  FancyNumber,
  FancyNumberFilters,
  FancyNumberPayload,
  FancyNumberConsumptionRecord,
  FancyNumberConsumptionFilters,
} from '@/types/fancy-number';

const FANCY_NUMBERS_ENDPOINT = '/api/fancy-numbers';
const CONSUMPTION_ENDPOINT = '/api/fancy-numbers/consumption';

let fancyNumbersData: FancyNumber[] = [
  { id: 1, fancyNumber: '33334444', userId: 168748, anchorNickname: '『BS』 DOLL G😊ツ', purchased: true, price: 3, type: 'Ordinary' },
  { id: 2, fancyNumber: '88888888', userId: 0, anchorNickname: '-', purchased: false, price: 888, type: 'Noble' },
  { id: 3, fancyNumber: '66666666', userId: 0, anchorNickname: '-', purchased: false, price: 666, type: 'Ordinary' },
  { id: 4, fancyNumber: '12345678', userId: 168781, anchorNickname: 'ZETSU ☄', purchased: false, price: 100, type: 'Ordinary' },
  { id: 5, fancyNumber: '99999999', userId: 0, anchorNickname: '-', purchased: false, price: 999, type: 'Noble' },
  { id: 6, fancyNumber: '11112222', userId: 166586, anchorNickname: 'DOLLAR', purchased: false, price: 50, type: 'Ordinary' },
  { id: 7, fancyNumber: '55555555', userId: 0, anchorNickname: '-', purchased: false, price: 555, type: 'Noble' },
  { id: 8, fancyNumber: '77777777', userId: 0, anchorNickname: '-', purchased: false, price: 777, type: 'Ordinary' },
  { id: 9, fancyNumber: '44444444', userId: 168800, anchorNickname: 'User168800', purchased: false, price: 200, type: 'Ordinary' },
  { id: 10, fancyNumber: '22223333', userId: 0, anchorNickname: '-', purchased: false, price: 80, type: 'Ordinary' },
];

const DEMO_CONSUMPTION_RECORDS: FancyNumberConsumptionRecord[] = [
  { id: 80571, number: 80571, user: '『ßs』 DOLL Gツ', userId: 168748, purchasingGoodAccountName: '33334444', consumptionAmount: 3, time: '2026-01-20 07:41:27' },
  { id: 80377, number: 80377, user: 'ZETSU ☄', userId: 168781, purchasingGoodAccountName: '3', consumptionAmount: 200, time: '2025-12-29 03:28:52' },
  { id: 80300, number: 80300, user: 'DOLLAR', userId: 166586, purchasingGoodAccountName: '94', consumptionAmount: 1000, time: '2025-12-15 14:22:10' },
  { id: 80250, number: 80250, user: 'User166590', userId: 166590, purchasingGoodAccountName: '1111', consumptionAmount: 1111, time: '2025-12-10 09:15:33' },
  { id: 80199, number: 80199, user: 'StarAnchor', userId: 167001, purchasingGoodAccountName: '2222', consumptionAmount: 2000, time: '2025-12-05 18:40:00' },
  { id: 80050, number: 80050, user: 'Mr.Gx777', userId: 166586, purchasingGoodAccountName: '66666666', consumptionAmount: 600000, time: '2025-11-28 11:20:15' },
  { id: 79900, number: 79900, user: 'Nisha', userId: 166789, purchasingGoodAccountName: '88888888', consumptionAmount: 888, time: '2025-11-20 16:55:42' },
  { id: 79850, number: 79850, user: 'Demo User A', userId: 167002, purchasingGoodAccountName: '12345678', consumptionAmount: 100, time: '2025-11-15 08:30:00' },
  { id: 79800, number: 79800, user: 'Demo User B', userId: 166600, purchasingGoodAccountName: '55555555', consumptionAmount: 555, time: '2025-11-10 13:45:22' },
  { id: 79750, number: 79750, user: 'Snow', userId: 166589, purchasingGoodAccountName: '77777777', consumptionAmount: 777, time: '2025-11-05 10:10:10' },
];

export async function fetchFancyNumbers(
  filters?: FancyNumberFilters,
  page = 1,
  perPage = 10
): Promise<{ data: FancyNumber[]; total: number }> {
  // TODO: const res = await api.get(FANCY_NUMBERS_ENDPOINT, { params: { ...filters, page, perPage } });
  await new Promise((r) => setTimeout(r, 300));

  let data = [...fancyNumbersData];
  if (filters?.fancyNumberId) {
    data = data.filter((r) => r.fancyNumber.includes(filters.fancyNumberId!));
  }
  if (filters?.userNickname) {
    const k = filters.userNickname.toLowerCase();
    data = data.filter((r) => r.anchorNickname.toLowerCase().includes(k));
  }
  if (filters?.userId) {
    data = data.filter((r) => String(r.userId).includes(filters.userId!));
  }
  if (filters?.uid) {
    data = data.filter((r) => String(r.userId).includes(filters.uid!));
  }
  if (filters?.purchased && filters.purchased !== 'all') {
    const isPurchased = filters.purchased === 'yes';
    data = data.filter((r) => r.purchased === isPurchased);
  }
  if (filters?.type && filters.type !== 'all') {
    data = data.filter((r) => r.type === filters.type);
  }

  const total = data.length;
  const start = (page - 1) * perPage;
  const slice = data.slice(start, start + perPage);
  return { data: slice, total };
}

export async function createFancyNumber(payload: FancyNumberPayload): Promise<FancyNumber> {
  // TODO: const res = await api.post(FANCY_NUMBERS_ENDPOINT, payload); return res.data;
  await new Promise((r) => setTimeout(r, 200));
  const newItem: FancyNumber = {
    id: 100 + Math.floor(Math.random() * 1000),
    fancyNumber: payload.fancyNumber,
    userId: 0,
    anchorNickname: '-',
    purchased: false,
    price: payload.price,
    type: payload.type,
  };
  fancyNumbersData.push(newItem);
  return newItem;
}

export async function updateFancyNumber(id: number, payload: Partial<FancyNumberPayload>): Promise<void> {
  // TODO: await api.patch(`${FANCY_NUMBERS_ENDPOINT}/${id}`, payload);
  await new Promise((r) => setTimeout(r, 200));
  fancyNumbersData = fancyNumbersData.map((r) => (r.id === id ? { ...r, ...payload } : r));
}

export async function deleteFancyNumber(id: number): Promise<void> {
  // TODO: await api.delete(`${FANCY_NUMBERS_ENDPOINT}/${id}`);
  await new Promise((r) => setTimeout(r, 200));
  fancyNumbersData = fancyNumbersData.filter((r) => r.id !== id);
}

export async function recycleFancyNumber(id: number): Promise<void> {
  // TODO: await api.post(`${FANCY_NUMBERS_ENDPOINT}/${id}/recycle`);
  await new Promise((r) => setTimeout(r, 200));
  fancyNumbersData = fancyNumbersData.map((r) =>
    r.id === id ? { ...r, purchased: false, userId: 0, anchorNickname: '-' } : r
  );
}

export async function sellFancyNumber(id: number): Promise<void> {
  // TODO: await api.post(`${FANCY_NUMBERS_ENDPOINT}/${id}/sell`);
  await new Promise((r) => setTimeout(r, 200));
  fancyNumbersData = fancyNumbersData.map((r) => (r.id === id ? { ...r, purchased: true } : r));
}

export async function fetchFancyNumberConsumption(
  filters?: FancyNumberConsumptionFilters,
  page = 1,
  perPage = 10
): Promise<{ data: FancyNumberConsumptionRecord[]; total: number }> {
  // TODO: const res = await api.get(CONSUMPTION_ENDPOINT, { params: { ...filters, page, perPage } });
  await new Promise((r) => setTimeout(r, 300));

  let data = [...DEMO_CONSUMPTION_RECORDS];
  if (filters?.userId) {
    data = data.filter((r) => String(r.userId).includes(filters.userId!));
  }

  const total = 199; // Demo shows "Total 199"
  const start = (page - 1) * perPage;
  const slice = data.slice(start, start + perPage);
  return { data: slice, total };
}
