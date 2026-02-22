/** Dynamic Management types */

export interface DynamicPost {
  id: number;
  userId: number;
  userNickname: string;
  publishContent: string;
  audioAddress: string;
  videoUrl: string;
  imageUrl: string;
  likeCount: number;
  commentCount: number;
  forwardCount: number;
  isPinned: string;
  status: string;
  releaseTime: string;
}

export interface DynamicComment {
  id: number;
  number: number;
  commenterNickname: string;
  commenterId: number;
  publisherNickname: string;
  publisherId: number;
  commentContent: string;
  releaseTime: string;
}

export interface DynamicTopic {
  id: number;
  number: number;
  topic: string;
  sort: number;
  backgroundImageUrl: string;
  coverImageUrl: string;
  status: 'Display' | 'Hide';
}
