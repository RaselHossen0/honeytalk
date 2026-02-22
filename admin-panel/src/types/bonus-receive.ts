/** Bonus Receive & Receive Validation API-ready types */

export interface BonusReceiveRecord {
  id: number;
  anchorId: number;
  anchorName: string;
  agentId: number;
  coin: number;
}

export interface ReceiveValidationRecord {
  id: number;
  receiveFromId: number;
  receiveFromName: string;
  receiveType: 'Lucky Gift' | 'call' | 'gift' | 'Luxary gift' | string;
  anchorId: number;
  anchorName: string;
  coin: number;
  action: 'Valid' | 'Invalid';
}
