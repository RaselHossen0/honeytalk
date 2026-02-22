/** Check-in Management types */

export interface CheckInReward {
  id: number;
  number: number;
  days: number;
  diamondReward: number;
  modificationTime: string;
  addTime: string;
}

export interface SignInListRecord {
  id: number;
  number: number;
  userNickname: string;
  userId: number;
  lastCheckInTime: string;
  checkInFrequency: number;
  continuousCheckIn: 'Yes' | 'No';
}
