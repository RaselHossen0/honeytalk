/** API-ready types for Level Management */

export type LevelGender = 'female' | 'male';

export interface LevelAvatarFrameReward {
  frameId: number;
  frameName: string;
  imageUrl: string;
  days: number;
  sort: number;
}

export interface Level {
  id: number;
  number: number;
  levelName: string;
  level: number;
  requiredIntegralValue: number;
  decorationImages?: string[];
  gender?: LevelGender;
  avatarFrameRewards?: LevelAvatarFrameReward[];
}
