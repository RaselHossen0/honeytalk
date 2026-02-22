/** API-ready types for Voice Room Management */

export interface VoiceRoom {
  id: number;
  roomNumber: number;
  title: string;
  coverImageUrl: string;
  anchorNickname: string;
  anchorUserId: number;
  category: string;
  password: string;
  participantsActual: number;
  participantsTotal: number;
  totalPeople: string;
  robotsCurrent: number;
  robotsTotal: number;
  recommended: 'Yes' | 'No';
  reportCount: number;
  creationTime: string;
}
