/** API-ready types for Nickname Restriction Configuration */

export interface NicknameRestriction {
  id: number;
  nickname: string;
}

export interface NicknameRestrictionCreate {
  nickname: string;
}

export interface NicknameRestrictionFilters {
  nickname?: string;
  id?: string;
}
