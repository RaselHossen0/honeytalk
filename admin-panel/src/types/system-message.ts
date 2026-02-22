/** API-ready types for System Message Management */

export interface SystemMessage {
  id: number;
  title: string;
  content: string;
  coverImage?: string;
  type: 'Text' | 'Rich text';
  link?: string;
  releaseTime: string;
  userId: string;
}

export interface SystemMessageFilters {
  userId?: string;
  dateStart?: string;
  dateEnd?: string;
}
