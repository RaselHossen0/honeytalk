/**
 * Family Management API service.
 * Replace demo data with actual API calls when backend is ready.
 */

import type {
  Family,
  FamilyMember,
  AnchorPerformanceRecord,
  FamilyPerformanceExportRow,
  FamilyFilters,
} from '@/types/family';

const ENDPOINT = '/users/family';

const DEMO_FAMILIES: Omit<Family, 'number'>[] = [
  {
    id: 65,
    familyName: 'girls',
    familyLeaderId: 166589,
    familyLeaderNickname: 'Snow',
    familyManifesto: "Let's be beautiful together",
    familyUserNumber: 4,
    familyIncome: 668818659,
    patriarchName: 'Snow',
    creationTime: '2022-07-11 12:13:38',
    status: 'Approved',
  },
  {
    id: 77,
    familyName: 'OA',
    familyLeaderId: 166586,
    familyLeaderNickname: 'DOLLAR',
    familyManifesto: 'popo',
    familyUserNumber: 1,
    familyIncome: 344295447,
    patriarchName: 'DOLLAR',
    creationTime: '2022-07-07 08:48:15',
    status: 'Approved',
  },
  {
    id: 85,
    familyName: 'Agency',
    familyLeaderId: 168777,
    familyLeaderNickname: 'Mr.Gx777',
    familyManifesto: 'Localization Support Agency',
    familyUserNumber: 0,
    familyIncome: 25821601,
    patriarchName: 'Mr.Gx777',
    creationTime: '2022-07-11 15:59:07',
    status: 'Approved',
  },
  {
    id: 92,
    familyName: 'Relief Family',
    familyLeaderId: 166600,
    familyLeaderNickname: 'Wang Han',
    familyManifesto: 'Relieve worries and sorrows',
    familyUserNumber: 3,
    familyIncome: 11487,
    patriarchName: 'Wang Han',
    creationTime: '2023-01-15 09:20:00',
    status: 'Approved',
  },
  {
    id: 95,
    familyName: 'test',
    familyLeaderId: 166610,
    familyLeaderNickname: 'MîShÃL MüGÅL',
    familyManifesto: 'hhhh',
    familyUserNumber: 2,
    familyIncome: 4285,
    patriarchName: 'MîShÃL MüGÅL',
    creationTime: '2023-03-20 14:30:00',
    status: 'Approved',
  },
  {
    id: 98,
    familyName: 'yyy',
    familyLeaderId: 166620,
    familyLeaderNickname: 'xxxp',
    familyManifesto: 'yyy',
    familyUserNumber: 1,
    familyIncome: 7,
    patriarchName: 'xxxp',
    creationTime: '2023-05-10 11:00:00',
    status: 'Approved',
  },
  {
    id: 100,
    familyName: 'ivanoo',
    familyLeaderId: 166624,
    familyLeaderNickname: 'Account number166624',
    familyManifesto: 'ivanoo1',
    familyUserNumber: 0,
    familyIncome: 0,
    patriarchName: 'Account number166624',
    creationTime: '2023-06-01 16:45:22',
    note: 'ivanoo',
    status: 'Approved',
  },
];

const DEMO_MEMBERS: FamilyMember[] = [
  { id: 104, number: 104, userId: 168530, userNickname: 'M33R', addTime: '2025-09-28 16:42:42', note: '168530 Application to join', stat: 'Has quit the family' },
  { id: 103, number: 103, userId: 166999, userNickname: 'Prince', addTime: '2025-08-04 08:15:36', note: '166999Apply to join', stat: 'Approved' },
  { id: 101, number: 101, userId: 168236, userNickname: 'ABRAM', addTime: '2025-06-02 20:14:40', note: '168236Apply to join', stat: 'Approved' },
  { id: 98, number: 98, userId: 166589, userNickname: 'Snow', addTime: '2025-03-01 08:34:03', stat: 'Approved' },
  { id: 96, number: 96, userId: 166596, userNickname: '', addTime: '2024-10-17 09:35:45', note: '166596Apply to join', stat: 'Rejected' },
  { id: 92, number: 92, userId: 166599, userNickname: 'Scythe', addTime: '2024-04-06 03:33:57', note: '166599Apply to join', stat: 'Has quit the family' },
  { id: 93, number: 93, userId: 166725, userNickname: 'MiSHÄL MÜGåL', addTime: '2024-02-28 07:35:25', note: '166725Apply to join', stat: 'Rejected' },
  { id: 91, number: 91, userId: 166835, userNickname: 'HAZY MAN', addTime: '2024-02-20 03:35:46', note: '166835Apply to join', stat: 'Has quit the family' },
];

const DEMO_ANCHOR_PERF: AnchorPerformanceRecord[] = [
  { time: '2025-12-02', userNickname: 'M33R', userId: 168530, liveStreamingDuration: '0:00:55', totalRevenue: 0 },
  { time: '2025-12-01', userNickname: 'M33R', userId: 168530, liveStreamingDuration: '0:00:00', totalRevenue: 301779.2 },
  { time: '2025-11-30', userNickname: 'M33R', userId: 168530, liveStreamingDuration: '0:02:18', totalRevenue: 239200 },
  { time: '2025-11-29', userNickname: 'M33R', userId: 168530, liveStreamingDuration: '0:09:38', totalRevenue: 2147483.0 },
  { time: '2025-11-28', userNickname: 'M33R', userId: 168530, liveStreamingDuration: '0:04:30', totalRevenue: 4716.4 },
  { time: '2025-11-27', userNickname: 'M33R', userId: 168530, liveStreamingDuration: '0:06:00', totalRevenue: 0 },
  { time: '2025-11-26', userNickname: 'M33R', userId: 168530, liveStreamingDuration: '0:35:03', totalRevenue: 0 },
  { time: '2025-11-25', userNickname: 'M33R', userId: 168530, liveStreamingDuration: '0:43:36', totalRevenue: 160 },
];

export async function fetchFamilies(
  filters?: FamilyFilters,
  page = 1,
  perPage = 10
): Promise<{ data: Family[]; total: number }> {
  await new Promise((r) => setTimeout(r, 300));
  let data = DEMO_FAMILIES.map((r, i) => ({ ...r, number: 100 - i }));
  if (filters?.familyName) {
    data = data.filter((r) => r.familyName.toLowerCase().includes(filters.familyName!.toLowerCase()));
  }
  if (filters?.patriarchName) {
    data = data.filter((r) => r.patriarchName.toLowerCase().includes(filters.patriarchName!.toLowerCase()));
  }
  if (filters?.familyId) {
    data = data.filter((r) => String(r.id).includes(filters.familyId!));
  }
  if (filters?.familyLeaderId) {
    data = data.filter((r) => String(r.familyLeaderId).includes(filters.familyLeaderId!));
  }
  if (filters?.status && filters.status !== 'all') {
    data = data.filter((r) => r.status === filters.status);
  }
  const total = data.length;
  const start = (page - 1) * perPage;
  const slice = data.slice(start, start + perPage).map((r, i) => ({ ...r, number: total - start - i }));
  return { data: slice as Family[], total };
}

export async function fetchFamilyMembers(
  familyId: number,
  filters?: { userId?: string; status?: string }
): Promise<FamilyMember[]> {
  await new Promise((r) => setTimeout(r, 200));
  let data = [...DEMO_MEMBERS];
  if (filters?.userId) {
    data = data.filter((r) => String(r.userId).includes(filters.userId!));
  }
  if (filters?.status && filters.status !== 'all') {
    data = data.filter((r) => r.stat.toLowerCase().includes(filters.status!.toLowerCase()));
  }
  return data;
}

export async function fetchAnchorPerformance(
  userId: number,
  _guildUid?: string,
  _guild?: string,
  _dateStart?: string,
  _dateEnd?: string
): Promise<{ data: AnchorPerformanceRecord[]; totalRevenue: number; liveStreamingDuration: string; valid: number }> {
  await new Promise((r) => setTimeout(r, 200));
  return {
    data: DEMO_ANCHOR_PERF,
    totalRevenue: 2696756.6,
    liveStreamingDuration: '4:06:22',
    valid: 0,
  };
}

export async function updateFamily(id: number, payload: Partial<Family>): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
}

export async function dissolveFamily(id: number): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
}

export async function clearFamilyIncome(): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
}

const DEMO_EXPORT_ROWS: Record<string, Omit<FamilyPerformanceExportRow, 'no' | 'guild'>[]> = {
  girls: [
    { userId: 166999, userNickname: 'Prince', totalRevenue: 0, valid: 0, liveStreamingDuration: '0:00:00' },
    { userId: 166803, userNickname: 'Bogo166803', totalRevenue: 0, valid: 0, liveStreamingDuration: '0:00:00' },
    { userId: 166589, userNickname: 'Snow', totalRevenue: 0, valid: 0, liveStreamingDuration: '0:00:00' },
    { userId: 168236, userNickname: 'ABRAM ♡', totalRevenue: 0, valid: 0, liveStreamingDuration: '0:00:00' },
  ],
};

export async function fetchFamilyPerformanceReport(
  _familyId: number,
  familyName: string,
  _dateStart: string,
  _dateEnd: string
): Promise<FamilyPerformanceExportRow[]> {
  // TODO: return api.get(`/users/family/${familyId}/performance-report?dateStart=...&dateEnd=...`)
  await new Promise((r) => setTimeout(r, 300));
  const rows = DEMO_EXPORT_ROWS[familyName] ?? DEMO_MEMBERS.filter((m) => m.stat === 'Approved').map((m) => ({
    userId: m.userId,
    userNickname: m.userNickname || `User ${m.userId}`,
    totalRevenue: 0,
    valid: 0,
    liveStreamingDuration: '0:00:00',
  }));
  return rows.map((r, i) => ({
    no: i + 1,
    ...r,
    guild: familyName,
  }));
}
