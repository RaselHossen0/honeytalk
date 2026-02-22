'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
} from '@mui/material';
import { Search, Clear, FileDownload } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import { demoAnchorDailyReports } from '@/lib/demo-data';

export default function AnchorDailyReportPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    userId: '',
    guildUid: '',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    addTab({
      id: '/dashboard/fund/statistical/anchor-daily',
      label: 'Anchor Daily Report',
      path: '/dashboard/fund/statistical/anchor-daily',
      breadcrumbs: ['Home', 'Fund Management', 'Statistical management', 'Anchor Daily Report'],
    });
  }, [addTab]);

  const filtered = useMemo(() => {
    let result = [...demoAnchorDailyReports];
    if (filters.userId.trim()) {
      const k = filters.userId.trim();
      result = result.filter((r) => r.userNickname.includes(k) || String(r.number).includes(k));
    }
    if (filters.guildUid.trim()) {
      const k = filters.guildUid.toLowerCase().trim();
      result = result.filter((r) => r.guild.toLowerCase().includes(k));
    }
    if (filters.dateFrom) {
      result = result.filter((r) => r.time >= filters.dateFrom);
    }
    if (filters.dateTo) {
      result = result.filter((r) => r.time <= filters.dateTo);
    }
    return result;
  }, [filters]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const totalRevenue = filtered.reduce((sum, r) => {
    const val = typeof r.totalRevenue === 'string' ? parseFloat(r.totalRevenue.replace(/[^\d.]/g, '')) || 0 : r.totalRevenue;
    return sum + (typeof val === 'number' ? val : 0);
  }, 0);

  const totalValid = filtered.reduce((sum, r) => sum + r.valid, 0);
  const totalDuration = '647:06:11';

  const handleClear = () => {
    setFilters({ userId: '', guildUid: '', dateFrom: '', dateTo: '' });
    setPage(0);
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
          <TextField
            size="small"
            label="User ID"
            placeholder="Please enter user ID"
            value={filters.userId}
            onChange={(e) => setFilters((p) => ({ ...p, userId: e.target.value }))}
            sx={{ minWidth: 160 }}
          />
          <TextField
            size="small"
            label="guild UID"
            placeholder="guild"
            value={filters.guildUid}
            onChange={(e) => setFilters((p) => ({ ...p, guildUid: e.target.value }))}
            sx={{ minWidth: 140 }}
          />
          <Typography component="span" sx={{ fontWeight: 600, alignSelf: 'center' }}>
            Date:
          </Typography>
          <TextField
            size="small"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters((p) => ({ ...p, dateFrom: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />
          <TextField
            size="small"
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters((p) => ({ ...p, dateTo: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />
          <Button variant="contained" startIcon={<Search />} onClick={() => setPage(0)}>
            Query
          </Button>
          <Button variant="outlined" color="error" startIcon={<Clear />} onClick={handleClear}>
            Clear conditions
          </Button>
          <Button variant="outlined" startIcon={<FileDownload />} onClick={() => alert('Export')}>
            Export
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Typography variant="body1">
          Total revenue: {totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 1 })} k; Live streaming
          duration: {totalDuration}; Valid: {totalValid};
        </Typography>
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>User nickname</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>guild</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Live streaming duration</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total revenue</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Valid</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.time}</TableCell>
                  <TableCell>{row.userNickname}</TableCell>
                  <TableCell>{row.guild || '-'}</TableCell>
                  <TableCell>{row.liveStreamingDuration}</TableCell>
                  <TableCell>{row.totalRevenue}</TableCell>
                  <TableCell>{row.valid}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50]}
          labelRowsPerPage="per page"
        />
      </Paper>
    </Box>
  );
}
