/** API-ready types for Live Management */

export interface PkTimeRule {
  id: number;
  number: number;
  timeMinutes: number;
  sort: number;
}

export interface PkTimeRulePayload {
  timeMinutes: number;
  sort: number;
}

export interface LiveRoomSoundEffect {
  id: number;
  number: number;
  name: string;
  resourceUrl?: string;
  durationSeconds: number; // 0 if empty/placeholder
  status: 'Unban' | 'Ban';
  sort: number;
}

export interface LiveRoomSoundEffectPayload {
  name: string;
  resourceUrl?: string;
  status?: 'Unban' | 'Ban';
  sort: number;
}
