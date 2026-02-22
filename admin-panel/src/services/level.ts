/**
 * Level Management API service.
 * Replace demo data with actual API calls when backend is ready.
 */

import type { Level, LevelGender } from '@/types/level';
import { LEVEL_AVATAR_FRAMES_DEMO } from '@/lib/demo-data';

const ENDPOINT = '/users/levels';

const createDemoLevels = (gender: LevelGender, offset = 0): Level[] =>
  Array.from({ length: 10 }, (_, i) => {
    const lv = i + 1;
    const avatarFrameRewards =
      lv === 1
        ? [
            {
              frameId: 5,
              frameName: 'spring',
              imageUrl: 'https://picsum.photos/64/64?random=spring',
              days: 7,
              sort: 6,
            },
          ]
        : undefined;
    return {
      id: offset + lv,
      number: lv,
      levelName: `Lv${lv}`,
      level: lv,
      requiredIntegralValue: lv * 100,
      decorationImages: lv <= 4 || lv === 10 ? [/* placeholder URLs */] : undefined,
      gender,
      avatarFrameRewards,
    };
  });

const DEMO_LEVELS_FEMALE = createDemoLevels('female', 0);
const DEMO_LEVELS_MALE = createDemoLevels('male', 100);

export async function fetchLevels(gender?: LevelGender): Promise<Level[]> {
  // TODO: return api.get<Level[]>(ENDPOINT, { params: { gender } })
  await new Promise((r) => setTimeout(r, 200));
  if (gender === 'male') return [...DEMO_LEVELS_MALE];
  if (gender === 'female') return [...DEMO_LEVELS_FEMALE];
  return [...DEMO_LEVELS_FEMALE, ...DEMO_LEVELS_MALE];
}

export async function deleteLevel(id: number): Promise<void> {
  // TODO: return api.delete(`${ENDPOINT}/${id}`)
  await new Promise((r) => setTimeout(r, 200));
}

export async function updateLevel(
  id: number,
  payload: {
    level?: number;
    levelName?: string;
    requiredIntegralValue?: number;
    avatarFrameRewards?: Array<{ frameId: number; days: number; sort: number }>;
  }
): Promise<void> {
  // TODO: return api.patch(`${ENDPOINT}/${id}`, payload)
  await new Promise((r) => setTimeout(r, 200));
}

export async function createLevel(
  gender: LevelGender,
  payload: {
    level: number;
    levelName: string;
    requiredIntegralValue: number;
    avatarFrameRewards?: Array<{ frameId: number; days: number; sort: number }>;
  }
): Promise<Level> {
  // TODO: return api.post(ENDPOINT, { gender, ...payload })
  await new Promise((r) => setTimeout(r, 200));
  const existing = gender === 'male' ? DEMO_LEVELS_MALE : DEMO_LEVELS_FEMALE;
  const maxId = Math.max(...existing.map((r) => r.id), 0);
  return {
    id: maxId + 1,
    number: maxId + 1,
    ...payload,
    gender,
    avatarFrameRewards: (payload.avatarFrameRewards ?? []).map((r) => {
      const frame = LEVEL_AVATAR_FRAMES_DEMO.find((f) => f.id === r.frameId);
      return { frameId: r.frameId, frameName: frame?.name ?? '', imageUrl: frame?.imageUrl ?? '', days: r.days, sort: r.sort };
    }),
  };
}
