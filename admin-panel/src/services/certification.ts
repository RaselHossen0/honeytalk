/**
 * Certification Management API service.
 * Replace demo data with actual API calls when backend is ready.
 * Example API integration:
 *   - fetchAnchorCertifications: GET /api/certification/anchor
 *   - updateAnchorCertification: PATCH /api/certification/anchor/:id
 *   - batchApproveCertifications: POST /api/certification/anchor/batch-approve
 */

import type {
  AnchorCertification,
  AnchorCertificationFilters,
  UpdateCertificationPayload,
  VerifiedNameItem,
} from '@/types/certification';

const ANCHOR_ENDPOINT = '/api/certification/anchor';

// Demo data - structured to match expected API response
const DEMO_ANCHOR_CERTIFICATIONS: AnchorCertification[] = [
  {
    id: 166593,
    userId: 166593,
    anchorNickname: 'Ffffewe',
    avatar: 'https://i.pravatar.cc/80?img=11',
    certificationName: 'Official certification',
    realName: 'PhotoBar',
    contact: '111',
    holdingIdCardImage: 'https://i.pravatar.cc/150?img=1',
    frontIdCardImage: 'https://i.pravatar.cc/150?img=2',
    backIdCardImage: 'https://i.pravatar.cc/150?img=3',
    fans: 9,
    coin: 13004450,
    level: 78,
    type: 'Ordinary member',
    status: 'Pending review',
  },
  {
    id: 167120,
    userId: 167120,
    anchorNickname: 'prem official',
    avatar: 'https://i.pravatar.cc/80?img=12',
    certificationName: 'Official certification',
    realName: 'Haha',
    contact: '8000030177',
    holdingIdCardImage: 'FAILED',
    frontIdCardImage: 'FAILED',
    backIdCardImage: 'FAILED',
    fans: 2,
    coin: 5804,
    level: 45,
    type: 'Ordinary member',
    status: 'Certification',
  },
  {
    id: 166586,
    userId: 166586,
    anchorNickname: 'Mr.Gx777',
    avatar: 'https://i.pravatar.cc/80?img=13',
    certificationName: 'Official certification',
    realName: 'Lu Xianren',
    contact: '23457889999',
    holdingIdCardImage: 'https://i.pravatar.cc/150?img=4',
    frontIdCardImage: 'FAILED',
    backIdCardImage: 'https://i.pravatar.cc/150?img=6',
    fans: 11,
    coin: 9800000,
    level: 100,
    type: 'Ordinary member',
    status: 'Pending review',
  },
  {
    id: 166789,
    userId: 166789,
    anchorNickname: 'DOLLAR',
    avatar: 'https://i.pravatar.cc/80?img=14',
    certificationName: 'Official certification',
    realName: 'Nisha',
    contact: '9876543210',
    holdingIdCardImage: 'https://i.pravatar.cc/150?img=7',
    frontIdCardImage: 'https://i.pravatar.cc/150?img=8',
    backIdCardImage: 'https://i.pravatar.cc/150?img=9',
    fans: 25,
    coin: 22000000,
    level: 80,
    type: 'Ordinary member',
    status: 'Audit failed',
  },
  {
    id: 167001,
    userId: 167001,
    anchorNickname: 'StarAnchor',
    avatar: 'https://i.pravatar.cc/80?img=15',
    certificationName: 'Official certification',
    realName: 'Li Ming',
    contact: '5556667777',
    holdingIdCardImage: 'https://i.pravatar.cc/150?img=10',
    frontIdCardImage: 'https://i.pravatar.cc/150?img=11',
    backIdCardImage: 'https://i.pravatar.cc/150?img=12',
    fans: 50,
    coin: 45000000,
    level: 69,
    type: 'Ordinary member',
    status: 'Certification',
  },
];

export async function fetchAnchorCertifications(
  filters?: AnchorCertificationFilters,
  page = 1,
  perPage = 10
): Promise<{ data: AnchorCertification[]; total: number }> {
  // TODO: Replace with: const res = await api.get(ANCHOR_ENDPOINT, { params: { ...filters, page, perPage } });
  await new Promise((r) => setTimeout(r, 300));

  let data = [...DEMO_ANCHOR_CERTIFICATIONS];
  if (filters?.userId) {
    data = data.filter((r) => String(r.userId).includes(filters.userId!));
  }
  if (filters?.userNickname) {
    const k = filters.userNickname.toLowerCase();
    data = data.filter((r) => r.anchorNickname.toLowerCase().includes(k));
  }
  if (filters?.status && filters.status !== 'all') {
    data = data.filter((r) => r.status === filters.status);
  }

  const total = data.length;
  const start = (page - 1) * perPage;
  const slice = data.slice(start, start + perPage);
  return { data: slice, total };
}

export async function updateAnchorCertification(
  id: number,
  payload: UpdateCertificationPayload
): Promise<void> {
  // TODO: Replace with: await api.patch(`${ANCHOR_ENDPOINT}/${id}`, payload);
  await new Promise((r) => setTimeout(r, 200));
}

export async function batchApproveCertifications(ids: number[]): Promise<void> {
  // TODO: Replace with: await api.post(`${ANCHOR_ENDPOINT}/batch-approve`, { ids });
  await new Promise((r) => setTimeout(r, 200));
}

// Verified Name List (certification name types)
const VERIFIED_ENDPOINT = '/api/certification/verified-names';

const DEMO_VERIFIED_NAMES: VerifiedNameItem[] = [
  { id: 1, number: 12, name: 'Official certification', sort: 2 },
  { id: 2, number: 11, name: 'Premium certification', sort: 1 },
  { id: 3, number: 10, name: 'Standard certification', sort: 3 },
  { id: 4, number: 9, name: 'VIP certification', sort: 4 },
];

export async function fetchVerifiedNames(): Promise<{ data: VerifiedNameItem[]; total: number }> {
  // TODO: Replace with: const res = await api.get(VERIFIED_ENDPOINT);
  await new Promise((r) => setTimeout(r, 200));

  const data = [...DEMO_VERIFIED_NAMES];
  return { data, total: data.length };
}

export async function deleteVerifiedName(id: number): Promise<void> {
  // TODO: await api.delete(`${VERIFIED_ENDPOINT}/${id}`)
  await new Promise((r) => setTimeout(r, 200));
}

export async function updateVerifiedName(id: number, payload: { name: string; sort: number }): Promise<void> {
  // TODO: await api.patch(`${VERIFIED_ENDPOINT}/${id}`, payload)
  await new Promise((r) => setTimeout(r, 200));
}

export async function createVerifiedName(payload: { name: string; sort: number }): Promise<VerifiedNameItem> {
  // TODO: const res = await api.post(VERIFIED_ENDPOINT, payload); return res.data
  await new Promise((r) => setTimeout(r, 200));
  const maxId = Math.max(...DEMO_VERIFIED_NAMES.map((r) => r.id), 0);
  const maxNumber = Math.max(...DEMO_VERIFIED_NAMES.map((r) => r.number), 0);
  return { id: maxId + 1, number: maxNumber + 1, name: payload.name, sort: payload.sort };
}
