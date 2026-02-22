/** API-ready types for Live Video Duration Task Log */

export interface DurationTaskLog {
  id: string | number;
  userId: number;
  userNickname: string;
  videoDurationMinutes: number;
  reward: string | number;
  status: 'Expired' | 'Valid' | string;
  roomNumber: number;
  creationTime: string;
  expirationTime: string;
  updateTime: string;
}
