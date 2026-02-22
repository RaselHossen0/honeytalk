/** API-ready types for Family Management */

export interface Family {
  id: number;
  number: number;
  familyName: string;
  familyLeaderId: number;
  familyLeaderNickname: string;
  familyLogo?: string;
  familyManifesto: string;
  familyUserNumber: number;
  familyIncome: number;
  patriarchName: string;
  creationTime: string;
  note?: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  introduction?: string;
}

export interface FamilyMember {
  id: number;
  number: number;
  userId: number;
  userNickname: string;
  avatar?: string;
  addTime: string;
  note?: string;
  stat: 'Approved' | 'Rejected' | 'Has quit the family';
}

export interface AnchorPerformanceRecord {
  time: string;
  userNickname: string;
  userId: number;
  avatar?: string;
  guild?: string;
  liveStreamingDuration: string;
  totalRevenue: number;
}

export interface FamilyPerformanceExportRow {
  no: number;
  userId: number;
  userNickname: string;
  totalRevenue: number;
  valid: number;
  liveStreamingDuration: string;
  guild: string;
}

export interface FamilyFilters {
  familyName?: string;
  patriarchName?: string;
  familyId?: string;
  familyLeaderId?: string;
  familyMembersId?: string;
  status?: string;
  creationTimeStart?: string;
  creationTimeEnd?: string;
}
