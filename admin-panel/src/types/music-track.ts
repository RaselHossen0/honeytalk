/** API-ready types for Music management */

export interface MusicTrack {
  id: string | number;
  number: number;
  name: string;
  singer: string;
  musicUrl: string;
  status: 'Unban' | 'Ban' | string;
  sort: number;
  addTime: string;
}
