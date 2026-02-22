/** Report Management API-ready types */

export interface ReportType {
  id: number;
  number: number;
  name: string;
  status: 'Valid' | 'Invalid';
}

export interface Report {
  id: number;
  number: number;
  reportedRoomNumber: number;
  whistleblower: string;
  reportedBy: string;
  type: string;
  reportingTime: string;
  note: string;
}
