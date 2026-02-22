/** Monitoring dashboard types */

export interface MonitoringReport {
  id: number;
  number: number;
  roomId: number;
  roomNumber: number;
  anchorNickname: string;
  reporterNickname: string;
  reportType: string;
  reportReason: string;
  reportTime: string;
  status: 'Pending' | 'Reviewed' | 'Resolved';
}

export interface MonitoringStats {
  totalReports: number;
  totalViews: number;
}
