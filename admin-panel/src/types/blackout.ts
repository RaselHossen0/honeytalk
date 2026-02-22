/** API-ready types for Blackout Records */

export interface BlackoutRecord {
  id: number;
  userId: number;
  userNickname: string;
  identifying: string;
  days: number;
  ipOrDevice: 'Phone number' | 'IP';
  note: string;
  expirationTime: string;
  operator: string;
  creationTime: string;
  updateTime: string;
  status: 'Active' | 'Ended';
}

export interface BlackoutFilters {
  userId?: string;
  identifying?: string;
  type?: string;
  status?: string;
}
