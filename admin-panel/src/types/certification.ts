/** API-ready types for Certification Management */

export type AnchorCertificationStatus = 'Pending review' | 'Certification' | 'Audit failed';

export interface AnchorCertification {
  id: number;
  userId: number;
  anchorNickname: string;
  avatar?: string;
  certificationName: string;
  realName: string;
  contact: string;
  /** URL or 'FAILED' for failed/missing upload */
  holdingIdCardImage?: string;
  /** URL or 'FAILED' for failed/missing upload */
  frontIdCardImage?: string;
  /** URL or 'FAILED' for failed/missing upload */
  backIdCardImage?: string;
  fans: number;
  coin: number;
  level: number;
  type: string;
  status: AnchorCertificationStatus;
}

export interface AnchorCertificationFilters {
  userId?: string;
  userNickname?: string;
  status?: string;
}

export interface UpdateCertificationPayload {
  status: AnchorCertificationStatus;
}

/** Verified Name List - certification name types with sort order */
export interface VerifiedNameItem {
  id: number;
  number: number;
  name: string;
  sort: number;
}
