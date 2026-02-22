/** API-ready types for Anchor Tags */

export interface AnchorTag {
  id: number;
  label: string;
  gender: 'Male' | 'Female';
  color: string;
}

export interface AnchorTagCreate {
  label: string;
  gender: 'Male' | 'Female';
  color: string;
}

export interface AnchorTagUpdate extends Partial<AnchorTagCreate> {}
