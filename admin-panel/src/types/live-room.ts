/** API-ready types for Live Room Management */

export interface LiveRoom {
  id: number;
  roomNumber: number;
  anchorNickname?: string;
  anchorUserId?: number;
  coin: number;
  participantsActual: number;
  participantsTotal: number;
  totalPeople: string;
  robotsCurrent: number;
  robotsTotal: number;
  status: string;
  type: string;
  isCharged: 'Yes' | 'No';
  chargeType: string;
  recommended: 'Yes' | 'No';
  reportCount: number;
  creationTime: string;
  heartbeatTime: string;
  popular: number;
}
