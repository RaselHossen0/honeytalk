/** API-ready types for Live Ending Video */

export interface LiveEndingVideo {
  id: number;
  roomNumber: number;
  anchorId: number;
  anchorNickname: string;
  liveStreamTitle: string;
  totalNumberOfPeople: number;
  coin: number;
  status: string;
  type: string;
  category: string;
  isCharged: 'Yes' | 'No';
  typeOfCharge?: string;
  creationTime: string;
  endTime: string;
  liveStreamingDuration: string;
}

export interface LiveEndingVideoFilters {
  roomNumber?: string;
  anchorId?: string;
  anchorNickname?: string;
  liveStreamTitle?: string;
  creationTimeStart?: string;
  creationTimeEnd?: string;
  category?: string;
}
