/** API-ready types for Administrator Management */

export interface Administrator {
  id: string | number;
  account: string;
  userNickname: string;
  gender: 'Male' | 'Female' | 'Other';
  phoneNumber: string;
  email: string;
  avatarUrl: string;
  status: 'Unban' | 'Ban';
  canDelete?: boolean;
}
