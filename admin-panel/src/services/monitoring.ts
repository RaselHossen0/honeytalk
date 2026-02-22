/**
 * Monitoring API service.
 * Replace demo data with actual API calls when backend is ready.
 */

import type { MonitoringReport, MonitoringStats } from '@/types/monitoring';

const DEMO_REPORTS: MonitoringReport[] = [
  { id: 1, number: 156, roomId: 14263, roomNumber: 14263, anchorNickname: 'StarLive_88', reporterNickname: 'User_Alex', reportType: 'Inappropriate content', reportReason: 'Violence', reportTime: '2026-02-15 14:32:10', status: 'Pending' },
  { id: 2, number: 155, roomId: 14262, roomNumber: 14262, anchorNickname: 'MoonBeam', reporterNickname: 'Viewer99', reportType: 'Spam', reportReason: 'Repeated messages', reportTime: '2026-02-15 13:45:22', status: 'Reviewed' },
  { id: 3, number: 154, roomId: 14263, roomNumber: 14263, anchorNickname: 'StarLive_88', reporterNickname: 'Guardian_X', reportType: 'Harassment', reportReason: 'Offensive language', reportTime: '2026-02-15 12:18:55', status: 'Pending' },
  { id: 4, number: 153, roomId: 14261, roomNumber: 14261, anchorNickname: 'SunRise', reporterNickname: 'Mod_Team', reportType: 'Copyright', reportReason: 'Unauthorized music', reportTime: '2026-02-15 11:02:33', status: 'Resolved' },
  { id: 5, number: 152, roomId: 14260, roomNumber: 14260, anchorNickname: 'NightOwl', reporterNickname: 'User_Mia', reportType: 'Other', reportReason: 'Misleading title', reportTime: '2026-02-15 09:55:00', status: 'Reviewed' },
  { id: 6, number: 151, roomId: 14263, roomNumber: 14263, anchorNickname: 'StarLive_88', reporterNickname: 'Viewer_Lee', reportType: 'Inappropriate content', reportReason: 'Nudity', reportTime: '2026-02-14 18:20:15', status: 'Pending' },
  { id: 7, number: 150, roomId: 14264, roomNumber: 14264, anchorNickname: 'VoiceKing', reporterNickname: 'User_Sam', reportType: 'Spam', reportReason: 'Advertisment', reportTime: '2026-02-14 16:10:42', status: 'Resolved' },
];

let reportCount = 1247;
let viewCount = 892340;

export async function fetchMonitoringStats(): Promise<MonitoringStats> {
  await new Promise((r) => setTimeout(r, 150));
  return { totalReports: reportCount, totalViews: viewCount };
}

export async function fetchMonitoringReports(page = 1, perPage = 10): Promise<{ data: MonitoringReport[]; total: number }> {
  await new Promise((r) => setTimeout(r, 150));
  const total = DEMO_REPORTS.length;
  const start = (page - 1) * perPage;
  const data = DEMO_REPORTS.slice(start, start + perPage);
  return { data, total };
}

export async function refreshMonitoringStats(): Promise<MonitoringStats> {
  await new Promise((r) => setTimeout(r, 300));
  reportCount = Math.floor(reportCount + Math.random() * 20 - 5);
  viewCount = Math.floor(viewCount + Math.random() * 1000);
  return { totalReports: reportCount, totalViews: viewCount };
}
