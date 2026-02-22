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
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { DurationTaskLog } from '@/types/duration-task-log';
import { demoDurationTaskLogs } from '@/lib/demo-data';

export default function DurationTaskLogsPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data] = useState<DurationTaskLog[]>(demoDurationTaskLogs);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({ userId: '', dateStart: '', dateEnd: '' });

  useEffect(() => {
    addTab({
      id: '/dashboard/live/duration-task-logs',
      label: 'Live Video Duration Task Log',
      path: '/dashboard/live/duration-task-logs',
      breadcrumbs: ['Home', 'Live Management', 'Duration Tasks', 'Live Video Duration Task Log'],
    });
  }, [addTab]);

  const filtered = useMemo(() => {
    let result = [...data];
    if (filters.userId.trim()) {
      const uid = filters.userId.trim();
      result = result.filter((r) => String(r.userId).includes(uid));
    }
    if (filters.dateStart) {
      const start = new Date(filters.dateStart).getTime();
      if (!isNaN(start)) {
        result = result.filter((r) => new Date(r.creationTime).getTime() >= start);
      }
    }
    if (filters.dateEnd) {
      const end = new Date(filters.dateEnd).getTime();
      if (!isNaN(end)) {
        result = result.filter((r) => new Date(r.creationTime).getTime() <= end);
      }
    }
    return result;
  }, [data, filters]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({ userId: '', dateStart: '', dateEnd: '' });
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
            sx={{ minWidth: 180 }}
          />
          <TextField
            size="small"
            type="date"
            label="Date"
            InputLabelProps={{ shrink: true }}
            value={filters.dateStart}
            onChange={(e) => setFilters((p) => ({ ...p, dateStart: e.target.value }))}
            sx={{ minWidth: 160 }}
          />
          <TextField
            size="small"
            type="date"
            label="to"
            InputLabelProps={{ shrink: true }}
            value={filters.dateEnd}
            onChange={(e) => setFilters((p) => ({ ...p, dateEnd: e.target.value }))}
            sx={{ minWidth: 140 }}
          />
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
            Q Query
          </Button>
          <Button variant="outlined" color="error" startIcon={<Clear />} onClick={handleClear}>
            Clear conditions
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>User ID</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>User nickname</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>Video duration (minutes)</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>reward</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 110 }}>Room number</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 165 }}>Creation time</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 165 }}>Expiration time</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 165 }}>Update Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row) => (
              <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                <TableCell>{row.userId}</TableCell>
                <TableCell>{row.userNickname}</TableCell>
                <TableCell>{row.videoDurationMinutes}</TableCell>
                <TableCell>{row.reward}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.roomNumber}</TableCell>
                <TableCell>{row.creationTime}</TableCell>
                <TableCell>{row.expirationTime}</TableCell>
                <TableCell>{row.updateTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
      </TableContainer>
    </Box>
  );
}
