/**
 * Family Level List API service.
 * Replace demo data with actual API calls when backend is ready.
 */

import type { FamilyLevel } from '@/types/family-level';

const ENDPOINT = '/users/family/levels';

const DEMO_LEVELS: Omit<FamilyLevel, 'number'>[] = [
  { id: 1, levelName: 'Lv1', level: 1, requiredIntegralValue: 10 },
  { id: 2, levelName: 'Lv2', level: 2, requiredIntegralValue: 60 },
  { id: 3, levelName: 'Lv3', level: 3, requiredIntegralValue: 120 },
  { id: 5, levelName: 'Lv5', level: 5, requiredIntegralValue: 280 },
  { id: 6, levelName: 'Lv6', level: 6, requiredIntegralValue: 360 },
  { id: 7, levelName: 'Lv7', level: 7, requiredIntegralValue: 480 },
  { id: 8, levelName: 'Lv8', level: 8, requiredIntegralValue: 640 },
  { id: 9, levelName: 'Lv9', level: 9, requiredIntegralValue: 840 },
  { id: 10, levelName: 'Lv10', level: 10, requiredIntegralValue: 1000 },
  { id: 11, levelName: 'Lv11', level: 11, requiredIntegralValue: 1240 },
];

export async function fetchFamilyLevels(
  page = 1,
  perPage = 10
): Promise<{ data: FamilyLevel[]; total: number }> {
  // TODO: return api.get(`${ENDPOINT}?page=${page}&perPage=${perPage}`)
  await new Promise((r) => setTimeout(r, 200));

  const total = 103;
  const start = (page - 1) * perPage;
  const count = Math.min(perPage, total - start);
  const data: FamilyLevel[] = Array.from({ length: count }, (_, i) => {
    const num = start + i + 1;
    const template = DEMO_LEVELS[i % DEMO_LEVELS.length];
    return {
      id: num,
      number: num,
      levelName: template?.levelName ?? `Lv${(num % 11) || 11}`,
      level: template?.level ?? ((num % 11) || 11),
      requiredIntegralValue: template?.requiredIntegralValue ?? num * 100,
    };
  });

  return { data, total };
}

export async function deleteFamilyLevel(id: number): Promise<void> {
  // TODO: return api.delete(`${ENDPOINT}/${id}`)
  await new Promise((r) => setTimeout(r, 200));
}

export async function updateFamilyLevel(
  id: number,
  payload: { levelName: string; requiredIntegralValue: number }
): Promise<void> {
  // TODO: return api.patch(`${ENDPOINT}/${id}`, payload)
  await new Promise((r) => setTimeout(r, 200));
}

export async function createFamilyLevel(payload: {
  levelName: string;
  requiredIntegralValue: number;
}): Promise<FamilyLevel> {
  // TODO: return api.post(ENDPOINT, payload)
  await new Promise((r) => setTimeout(r, 200));
  const maxId = Math.max(...DEMO_LEVELS.map((r) => r.id), 0);
  const maxLevel = Math.max(...DEMO_LEVELS.map((r) => r.level), 0);
  const nextLevel = maxLevel + 1;
  return {
    id: maxId + 1,
    number: nextLevel,
    levelName: payload.levelName,
    level: nextLevel,
    requiredIntegralValue: payload.requiredIntegralValue,
  };
}
