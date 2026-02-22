/** API-ready types for PK Records */

export interface PKRecord {
  id: string | number;
  number: number;
  anchor1Id: number;
  anchor1Nickname: string;
  anchor2Id: number;
  anchor2Nickname: string;
  anchor1Earnings: number;
  anchor2Earnings: number;
  startTime: string;
  timeMinutes: number;
  status: 'Success' | 'Failure' | string;
}
