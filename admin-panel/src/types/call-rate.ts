export interface CallRate {
  id: number;
  videoCallRate: number;
  hostGetPercent: number;
  adminGetPercent: number;
}

export interface CallRateFormPayload {
  videoCallRate: number;
  hostGetPercent: number;
  adminGetPercent: number;
}
