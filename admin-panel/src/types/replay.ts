/** API-ready types for Replay List */

export interface Replay {
  id: number;
  roomNumber: number;
  anchorId: number;
  anchorNickname: string;
  liveStreamTitle: string;
  actualNumberOfViewers: number;
  totalNumberOfPeople: number;
  type: string;
  isCharged: 'Yes' | 'No';
  typeOfCharge?: string;
  login: 'Yes' | 'No';
  creationTime: string;
  endTime?: string;
}

export interface ReplayFilters {
  roomNumber?: string;
  anchorId?: string;
  anchorNickname?: string;
  anchorTitle?: string;
  login?: string;
  creationTimeStart?: string;
  creationTimeEnd?: string;
}
