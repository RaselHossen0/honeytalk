'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  TablePagination,
} from '@mui/material';
import { useTabsStore } from '@/store/tabs';
import type { MonitoringReport, MonitoringStats } from '@/types/monitoring';
import { fetchMonitoringStats, fetchMonitoringReports, refreshMonitoringStats } from '@/services/monitoring';

export default function MonitoringPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [stats, setStats] = useState<MonitoringStats>({ totalReports: 0, totalViews: 0 });
  const [reports, setReports] = useState<MonitoringReport[]>([]);
  const [totalReports, setTotalReports] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const loadStats = useCallback(async () => {
    const data = await fetchMonitoringStats();
    setStats(data);
  }, []);

  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchMonitoringReports(page + 1, perPage);
      setReports(res.data);
      setTotalReports(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage]);

  useEffect(() => {
    addTab({
      id: '/dashboard/live/monitoring',
      label: 'Monitoring',
      path: '/dashboard/live/monitoring',
      breadcrumbs: ['Home', 'Live Management', 'Live Management', 'Monitoring'],
    });
  }, [addTab]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleRefresh = async () => {
    const data = await refreshMonitoringStats();
    setStats(data);
    loadReports();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        <Typography variant="body1" color="text.secondary">
          Number of reports:{' '}
          <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {stats.totalReports.toLocaleString()}
          </Box>
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Number of views:{' '}
          <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {stats.totalViews.toLocaleString()}
          </Box>
        </Typography>
        <Link
          component="button"
          onClick={handleRefresh}
          sx={{ cursor: 'pointer', fontSize: 14 }}
          underline="hover"
        >
          Refresh
        </Link>
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          Recent Reports
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Room</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Anchor</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Reporter</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Report Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Report Time</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    No reports
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((row) => (
                  <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                    <TableCell>{row.number}</TableCell>
                    <TableCell>{row.roomNumber}</TableCell>
                    <TableCell>{row.anchorNickname}</TableCell>
                    <TableCell>{row.reporterNickname}</TableCell>
                    <TableCell>{row.reportType}</TableCell>
                    <TableCell>{row.reportReason}</TableCell>
                    <TableCell>{row.reportTime}</TableCell>
                    <TableCell>
                      <Box
                        component="span"
                        sx={{
                          color:
                            row.status === 'Pending'
                              ? 'warning.main'
                              : row.status === 'Reviewed'
                                ? 'info.main'
                                : 'success.main',
                          fontWeight: 500,
                        }}
                      >
                        {row.status}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {totalReports > 0 && (
          <TablePagination
            component="div"
            count={totalReports}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={perPage}
            onRowsPerPageChange={(e) => {
              setPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="per page"
            labelDisplayedRows={({ count }) => `Total ${count}`}
          />
        )}
      </Paper>
    </Box>
  );
}
