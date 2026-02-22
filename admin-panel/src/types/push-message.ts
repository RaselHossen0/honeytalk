/** API-ready types for Push Message List */

export interface PushMessage {
  id: string | number;
  number: number;
  anchorId: number;
  anchorNickname: string;
  liveStreamTitle: string;
  roomNumber: number;
  liveBroadcastCities: string;
  status: 'Not pushed' | 'Pushed' | string;
  type?: string;
  creationTime: string;
}
