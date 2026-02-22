/**
 * Noble Management API service.
 * Replace demo data with actual API calls when backend is ready.
 */

import type {
  NobleType,
  NobleTypePayload,
  NoblePrivilege,
  NoblePrivilegePayload,
  NoblePrivilegeFilters,
  NoblePrivilegeConfig,
  NoblePrivilegeConfigPayload,
} from '@/types/noble';

const NOBLE_TYPES_ENDPOINT = '/api/noble/types';
const NOBLE_PRIVILEGES_ENDPOINT = '/api/noble/privileges';
const NOBLE_PRIVILEGE_CONFIG_ENDPOINT = '/api/noble/privilege';

const PLACEHOLDER_IMG = 'https://placehold.co/48x48/e0e0e0/999?text=+';

const DEMO_NOBLE_TYPES: NobleType[] = [
  { id: 1, number: 1, nobleName: 'Knight', nobleIconUrl: PLACEHOLDER_IMG, nobleInsigniaUrl: PLACEHOLDER_IMG, nobleCardUrl: '', nobleAvatarFrameUrl: PLACEHOLDER_IMG, chatBackgroundColor: '#F225F5', sort: 7, status: 'Unban' },
  { id: 2, number: 2, nobleName: 'Viscount', nobleIconUrl: PLACEHOLDER_IMG, nobleInsigniaUrl: PLACEHOLDER_IMG, nobleCardUrl: '', nobleAvatarFrameUrl: PLACEHOLDER_IMG, chatBackgroundColor: '#2BE8CF', sort: 6, status: 'Unban' },
  { id: 3, number: 3, nobleName: 'Earl', nobleIconUrl: PLACEHOLDER_IMG, nobleInsigniaUrl: PLACEHOLDER_IMG, nobleCardUrl: '', nobleAvatarFrameUrl: PLACEHOLDER_IMG, chatBackgroundColor: '#28B9DA', sort: 5, status: 'Unban' },
  { id: 4, number: 5, nobleName: 'Duke', nobleIconUrl: PLACEHOLDER_IMG, nobleInsigniaUrl: PLACEHOLDER_IMG, nobleCardUrl: '', nobleAvatarFrameUrl: PLACEHOLDER_IMG, chatBackgroundColor: '#EE6148', sort: 4, status: 'Unban' },
  { id: 5, number: 4, nobleName: 'Marquis', nobleIconUrl: PLACEHOLDER_IMG, nobleInsigniaUrl: PLACEHOLDER_IMG, nobleCardUrl: '', nobleAvatarFrameUrl: PLACEHOLDER_IMG, chatBackgroundColor: '#D835E7', sort: 3, status: 'Unban' },
  { id: 6, number: 13, nobleName: 'God', nobleIconUrl: PLACEHOLDER_IMG, nobleInsigniaUrl: PLACEHOLDER_IMG, nobleCardUrl: '', nobleAvatarFrameUrl: PLACEHOLDER_IMG, chatBackgroundColor: '#FC0069', sort: 2, status: 'Unban' },
  { id: 7, number: 6, nobleName: 'Emperor', nobleIconUrl: PLACEHOLDER_IMG, nobleInsigniaUrl: PLACEHOLDER_IMG, nobleCardUrl: '', nobleAvatarFrameUrl: PLACEHOLDER_IMG, chatBackgroundColor: '#EE0349', sort: 1, status: 'Unban' },
];

const DEMO_NOBLE_PRIVILEGES: NoblePrivilege[] = [
  { id: 1, number: 16, nobleName: 'Earl,Marquis,Duke,Emperor,God', nobleType: 'Noble Account', nobleDetailsTitle: 'Noble Account', imageUrl: PLACEHOLDER_IMG, nobleDetails: 'During the validity period of the nobility, you can get the nobility number, no need to buy', sort: 15, status: 'Unban' },
  { id: 2, number: 15, nobleName: 'Earl,Marquis,Duke,Emperor,God', nobleType: 'Invisible in the list', nobleDetailsTitle: 'Invisible in the list', imageUrl: PLACEHOLDER_IMG, nobleDetails: 'Be a low-key and mysterious aristocrat', sort: 14, status: 'Unban' },
  { id: 3, number: 12, nobleName: 'Knight,Viscount,Earl,Marquis,Duke,Emperor,God', nobleType: 'Noble Gift', nobleDetailsTitle: 'Noble Gift', imageUrl: PLACEHOLDER_IMG, nobleDetails: 'A special gift for nobles', sort: 13, status: 'Unban' },
  { id: 4, number: 2, nobleName: 'Knight,Viscount,Earl,Marquis,Duke,Emperor,God', nobleType: 'Turn on notifications', nobleDetailsTitle: 'Turn on notifications', imageUrl: PLACEHOLDER_IMG, nobleDetails: 'The activation/renewal is successful, and the whole station is broadcast on the floating screen', sort: 12, status: 'Unban' },
  { id: 5, number: 6, nobleName: 'Knight,Viscount,Earl,Marquis,Duke,Emperor,God', nobleType: 'Entry Effect', nobleDetailsTitle: 'Entry Effect', imageUrl: PLACEHOLDER_IMG, nobleDetails: 'Approach display, noble cool special effects', sort: 11, status: 'Unban' },
  { id: 6, number: 10, nobleName: 'Knight,Viscount,Earl,Marquis,Duke,Emperor,God', nobleType: 'Rank Top', nobleDetailsTitle: 'Rank Top', imageUrl: PLACEHOLDER_IMG, nobleDetails: 'The avatar of the live broadcast room is in the top', sort: 10, status: 'Unban' },
];

const DEMO_NOBLE_PRIVILEGE_CONFIG: NoblePrivilegeConfig[] = [
  { id: 1, number: 1, nobleType: 'Turn on notifications', iconUrl: PLACEHOLDER_IMG, unselectedIconUrl: PLACEHOLDER_IMG, sort: 15, status: 'Unban' },
  { id: 2, number: 2, nobleType: 'Noble Logo', iconUrl: PLACEHOLDER_IMG, unselectedIconUrl: PLACEHOLDER_IMG, sort: 14, status: 'Unban' },
  { id: 3, number: 5, nobleType: 'Noble Avatar Frame', iconUrl: PLACEHOLDER_IMG, unselectedIconUrl: PLACEHOLDER_IMG, sort: 13, status: 'Unban' },
  { id: 4, number: 3, nobleType: 'Noble Card', iconUrl: PLACEHOLDER_IMG, unselectedIconUrl: PLACEHOLDER_IMG, sort: 12, status: 'Unban' },
  { id: 5, number: 6, nobleType: 'Entry Effect', iconUrl: PLACEHOLDER_IMG, unselectedIconUrl: PLACEHOLDER_IMG, sort: 11, status: 'Unban' },
  { id: 6, number: 4, nobleType: 'Noble Seats', iconUrl: PLACEHOLDER_IMG, unselectedIconUrl: PLACEHOLDER_IMG, sort: 10, status: 'Unban' },
  { id: 7, number: 7, nobleType: 'Exclusive Car', iconUrl: PLACEHOLDER_IMG, unselectedIconUrl: PLACEHOLDER_IMG, sort: 9, status: 'Unban' },
  { id: 8, number: 8, nobleType: 'Public chat background', iconUrl: PLACEHOLDER_IMG, unselectedIconUrl: PLACEHOLDER_IMG, sort: 8, status: 'Unban' },
];

let nobleTypesData = [...DEMO_NOBLE_TYPES];
let noblePrivilegesData = [...DEMO_NOBLE_PRIVILEGES];
let noblePrivilegeConfigData = [...DEMO_NOBLE_PRIVILEGE_CONFIG];

// Noble Types
export async function fetchNobleTypes(): Promise<NobleType[]> {
  await new Promise((r) => setTimeout(r, 200));
  return [...nobleTypesData];
}

export async function createNobleType(payload: NobleTypePayload): Promise<NobleType> {
  await new Promise((r) => setTimeout(r, 200));
  const maxNum = Math.max(0, ...nobleTypesData.map((r) => r.number));
  const newItem: NobleType = {
    id: 100 + nobleTypesData.length,
    number: maxNum + 1,
    nobleName: payload.nobleName,
    nobleIconUrl: payload.nobleIconUrl,
    nobleInsigniaUrl: payload.nobleInsigniaUrl,
    nobleCardUrl: payload.nobleCardUrl,
    nobleAvatarFrameUrl: payload.nobleAvatarFrameUrl,
    chatBackgroundColor: payload.chatBackgroundColor,
    sort: payload.sort,
    status: payload.status ?? 'Unban',
  };
  nobleTypesData.push(newItem);
  return newItem;
}

export async function updateNobleType(id: number, payload: Partial<NobleTypePayload>): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  nobleTypesData = nobleTypesData.map((r) => (r.id === id ? { ...r, ...payload } : r));
}

export async function deleteNobleType(id: number): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  nobleTypesData = nobleTypesData.filter((r) => r.id !== id);
}

export async function toggleNobleTypeStatus(id: number): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  nobleTypesData = nobleTypesData.map((r) =>
    r.id === id ? { ...r, status: r.status === 'Unban' ? 'Ban' : 'Unban' } : r
  );
}

// Noble Privileges
export async function fetchNoblePrivileges(filters?: NoblePrivilegeFilters): Promise<NoblePrivilege[]> {
  await new Promise((r) => setTimeout(r, 200));
  let data = [...noblePrivilegesData];
  if (filters?.nobleClassification) {
    data = data.filter((r) => r.nobleName.includes(filters.nobleClassification!));
  }
  if (filters?.noblePrivilege) {
    data = data.filter((r) => r.nobleType.includes(filters.noblePrivilege!));
  }
  return data;
}

export async function createNoblePrivilege(payload: NoblePrivilegePayload): Promise<NoblePrivilege> {
  await new Promise((r) => setTimeout(r, 200));
  const maxNum = Math.max(0, ...noblePrivilegesData.map((r) => r.number));
  const newItem: NoblePrivilege = {
    id: 100 + noblePrivilegesData.length,
    number: maxNum + 1,
    ...payload,
    status: payload.status ?? 'Unban',
  };
  noblePrivilegesData.push(newItem);
  return newItem;
}

export async function updateNoblePrivilege(id: number, payload: Partial<NoblePrivilegePayload>): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  noblePrivilegesData = noblePrivilegesData.map((r) => (r.id === id ? { ...r, ...payload } : r));
}

export async function deleteNoblePrivilege(id: number): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  noblePrivilegesData = noblePrivilegesData.filter((r) => r.id !== id);
}

// Noble Privilege (icon config)
export async function fetchNoblePrivilegeConfig(): Promise<NoblePrivilegeConfig[]> {
  await new Promise((r) => setTimeout(r, 200));
  return [...noblePrivilegeConfigData];
}

export async function createNoblePrivilegeConfig(payload: NoblePrivilegeConfigPayload): Promise<NoblePrivilegeConfig> {
  await new Promise((r) => setTimeout(r, 200));
  const maxNum = Math.max(0, ...noblePrivilegeConfigData.map((r) => r.number));
  const newItem: NoblePrivilegeConfig = {
    id: 100 + noblePrivilegeConfigData.length,
    number: maxNum + 1,
    nobleType: payload.nobleType,
    iconUrl: payload.iconUrl,
    unselectedIconUrl: payload.unselectedIconUrl,
    sort: payload.sort,
    status: payload.status ?? 'Unban',
  };
  noblePrivilegeConfigData.push(newItem);
  return newItem;
}

export async function updateNoblePrivilegeConfig(id: number, payload: Partial<NoblePrivilegeConfigPayload>): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  noblePrivilegeConfigData = noblePrivilegeConfigData.map((r) => (r.id === id ? { ...r, ...payload } : r));
}

export async function deleteNoblePrivilegeConfig(id: number): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  noblePrivilegeConfigData = noblePrivilegeConfigData.filter((r) => r.id !== id);
}

export async function toggleNoblePrivilegeConfigStatus(id: number): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  noblePrivilegeConfigData = noblePrivilegeConfigData.map((r) =>
    r.id === id ? { ...r, status: r.status === 'Unban' ? 'Ban' : 'Unban' } : r
  );
}
