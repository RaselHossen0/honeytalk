/** API-ready types for Short Video Management */

export interface ShortVideo {
  id: number;
  number: number;
  publisherId: number;
  publisher: string;
  type: string;
  publishContent: string;
  videoThumbnailUrl?: string;
  status: 'Valid' | 'Invalid';
  giftRevenue: number | null;
  recommended: 'Yes' | 'No';
  releaseTime: string;
  review: 'Approved' | 'Pending' | 'Rejected';
}

export interface ShortVideoFilters {
  miniVideoId?: string;
  publisherId?: string;
  status?: string;
  recommended?: string;
  review?: string;
  releaseTimeStart?: string;
  releaseTimeEnd?: string;
}

export interface ShortVideoComment {
  id: number;
  number: number;
  miniVideoId: number;
  userId: number;
  userNickname: string;
  content: string;
  releaseTime: string;
}

export interface ShortVideoCommentFilters {
  userId?: string;
  miniVideoId?: string;
  keyword?: string;
  replyCommentNumber?: string;
}
