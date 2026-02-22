/** API-ready types for Private Message Gift Statistics */

export interface PrivateMessageGiftStat {
  id: number;
  anchorId: number;
  anchorNickname: string;
  totalRevenueCoin: number;
  totalNumberOfPeople: number;
}

export interface PrivateMessageGiftFilters {
  anchorId?: string;
  anchorNickname?: string;
  year?: number;
  month?: number;
  dateStart?: string;
  dateEnd?: string;
}

/** Private Message Gift Details (per-anchor gift records from senders) */
export interface PrivateMessageGiftDetail {
  id: number;
  userId: number;
  userNickname: string;
  totalRevenueCoin: number;
  giftTime: string;
}

export interface PrivateMessageGiftDetailFilters {
  userId?: string;
  userNickname?: string;
  year?: number;
  month?: number;
  dateStart?: string;
  dateEnd?: string;
}
