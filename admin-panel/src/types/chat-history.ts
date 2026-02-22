/** API-ready types for Chat History */

export type ChatContentType = 'text' | 'audio' | 'video';

export interface ChatRecord {
  id: number;
  number: number;
  sendUserId: number;
  sendUserNickname: string;
  receiveUserId: number;
  receiveUserNickname: string;
  content: string;
  contentType: ChatContentType;
  addTime: string;
}

export interface SessionMessage {
  id: string;
  type: 'text' | 'audio';
  content?: string;
  duration?: string;
}

export interface ChatHistoryFilters {
  sendUserId?: string;
  receiveUserId?: string;
  userNickname?: string;
  keyword?: string;
  type?: string;
}
