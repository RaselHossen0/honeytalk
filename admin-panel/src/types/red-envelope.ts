/** Red Envelope Management API-ready types */

export interface RedEnvelopeRecord {
  id: number;
  roomNumber: number;
  user: string;
  quantity: number;
  amount: number;
  status: string;
  creationTime: string;
  startTime: string;
  note: string;
}

export interface RedEnvelopeAmountConfig {
  id: number;
  amount: number;
  iconUrl: string;
  sort: number;
}

export interface RedEnvelopeQuantityConfig {
  id: number;
  quantity: number;
  sort: number;
}
