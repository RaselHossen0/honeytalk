/**
 * Live Management API service.
 * Replace demo data with actual API calls when backend is ready.
 */

import type {
  PkTimeRule,
  PkTimeRulePayload,
  LiveRoomSoundEffect,
  LiveRoomSoundEffectPayload,
} from '@/types/live';

const PK_RULES_ENDPOINT = '/api/live/pk-time-rules';
const SOUND_EFFECTS_ENDPOINT = '/api/live/sound-effects';

// Demo data for PK Time Rules
const DEMO_PK_RULES: PkTimeRule[] = [
  { id: 1, number: 14, timeMinutes: 60, sort: 6 },
  { id: 2, number: 12, timeMinutes: 30, sort: 5 },
  { id: 3, number: 11, timeMinutes: 15, sort: 3 },
  { id: 4, number: 10, timeMinutes: 10, sort: 2 },
  { id: 5, number: 6, timeMinutes: 5, sort: 1 },
  { id: 6, number: 15, timeMinutes: 1, sort: 1 },
];

// Demo data for Live Room Sound Effects (resourceUrl can be any audio URL; 0 duration = placeholder)
const DEMO_SOUND_EFFECTS: LiveRoomSoundEffect[] = [
  { id: 1, number: 12, name: 'Grand debut', resourceUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', durationSeconds: 7, status: 'Unban', sort: 3 },
  { id: 2, number: 13, name: 'Helicopter', resourceUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', durationSeconds: 5, status: 'Unban', sort: 5 },
  { id: 3, number: 15, name: 'Fireworks', resourceUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', durationSeconds: 6, status: 'Unban', sort: 6 },
  { id: 4, number: 18, name: 'Tiger roar', resourceUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', durationSeconds: 4, status: 'Unban', sort: 7 },
  { id: 5, number: 19, name: 'Magic', resourceUrl: '', durationSeconds: 0, status: 'Unban', sort: 9 },
  { id: 6, number: 21, name: 'Birdsong', resourceUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', durationSeconds: 8, status: 'Unban', sort: 9 },
];

let pkRulesData = [...DEMO_PK_RULES];
let soundEffectsData = [...DEMO_SOUND_EFFECTS];
let nextPkId = 20;
let nextSoundId = 30;

// PK Time Rules
export async function fetchPkTimeRules(): Promise<PkTimeRule[]> {
  // TODO: const res = await api.get(PK_RULES_ENDPOINT); return res.data;
  await new Promise((r) => setTimeout(r, 200));
  return [...pkRulesData];
}

export async function createPkTimeRule(payload: PkTimeRulePayload): Promise<PkTimeRule> {
  // TODO: const res = await api.post(PK_RULES_ENDPOINT, payload); return res.data;
  await new Promise((r) => setTimeout(r, 200));
  const maxNum = Math.max(0, ...pkRulesData.map((r) => r.number));
  const newRule: PkTimeRule = {
    id: nextPkId++,
    number: maxNum + 1,
    timeMinutes: payload.timeMinutes,
    sort: payload.sort,
  };
  pkRulesData.push(newRule);
  return newRule;
}

export async function updatePkTimeRule(id: number, payload: Partial<PkTimeRulePayload>): Promise<void> {
  // TODO: await api.patch(`${PK_RULES_ENDPOINT}/${id}`, payload);
  await new Promise((r) => setTimeout(r, 200));
  pkRulesData = pkRulesData.map((r) => (r.id === id ? { ...r, ...payload } : r));
}

export async function deletePkTimeRule(id: number): Promise<void> {
  // TODO: await api.delete(`${PK_RULES_ENDPOINT}/${id}`);
  await new Promise((r) => setTimeout(r, 200));
  pkRulesData = pkRulesData.filter((r) => r.id !== id);
}

export async function batchDeletePkTimeRules(ids: number[]): Promise<void> {
  // TODO: await api.post(`${PK_RULES_ENDPOINT}/batch-delete`, { ids });
  await new Promise((r) => setTimeout(r, 200));
  pkRulesData = pkRulesData.filter((r) => !ids.includes(r.id));
}

// Live Room Sound Effects
export async function fetchLiveRoomSoundEffects(): Promise<LiveRoomSoundEffect[]> {
  // TODO: const res = await api.get(SOUND_EFFECTS_ENDPOINT); return res.data;
  await new Promise((r) => setTimeout(r, 200));
  return [...soundEffectsData];
}

export async function createLiveRoomSoundEffect(payload: LiveRoomSoundEffectPayload): Promise<LiveRoomSoundEffect> {
  // TODO: const res = await api.post(SOUND_EFFECTS_ENDPOINT, payload); return res.data;
  await new Promise((r) => setTimeout(r, 200));
  const maxNum = Math.max(0, ...soundEffectsData.map((r) => r.number));
  const newEffect: LiveRoomSoundEffect = {
    id: nextSoundId++,
    number: maxNum + 1,
    name: payload.name,
    resourceUrl: payload.resourceUrl,
    durationSeconds: 0,
    status: payload.status ?? 'Unban',
    sort: payload.sort,
  };
  soundEffectsData.push(newEffect);
  return newEffect;
}

export async function updateLiveRoomSoundEffect(
  id: number,
  payload: Partial<LiveRoomSoundEffectPayload>
): Promise<void> {
  // TODO: await api.patch(`${SOUND_EFFECTS_ENDPOINT}/${id}`, payload);
  await new Promise((r) => setTimeout(r, 200));
  soundEffectsData = soundEffectsData.map((r) => (r.id === id ? { ...r, ...payload } : r));
}

export async function deleteLiveRoomSoundEffect(id: number): Promise<void> {
  // TODO: await api.delete(`${SOUND_EFFECTS_ENDPOINT}/${id}`);
  await new Promise((r) => setTimeout(r, 200));
  soundEffectsData = soundEffectsData.filter((r) => r.id !== id);
}

export async function batchDeleteLiveRoomSoundEffects(ids: number[]): Promise<void> {
  // TODO: await api.post(`${SOUND_EFFECTS_ENDPOINT}/batch-delete`, { ids });
  await new Promise((r) => setTimeout(r, 200));
  soundEffectsData = soundEffectsData.filter((r) => !ids.includes(r.id));
}
