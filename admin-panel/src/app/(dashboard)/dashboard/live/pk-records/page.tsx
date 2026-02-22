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
import type { PKRecord } from '@/types/pk-record';
import { demoPKRecords } from '@/lib/demo-data';

export default function PKRecordsPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data] = useState<PKRecord[]>(demoPKRecords);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({ anchorId: '', creationTimeStart: '', creationTimeEnd: '' });

  useEffect(() => {
    addTab({
      id: '/dashboard/live/pk-records',
      label: 'PK Records',
      path: '/dashboard/live/pk-records',
      breadcrumbs: ['Home', 'Live Management', 'Content & History', 'PK Records'],
    });
  }, [addTab]);

  const filtered = useMemo(() => {
    let result = [...data];
    if (filters.anchorId.trim()) {
      const aid = filters.anchorId.trim();
      result = result.filter(
        (r) => String(r.anchor1Id).includes(aid) || String(r.anchor2Id).includes(aid)
      );
    }
    if (filters.creationTimeStart) {
      const start = new Date(filters.creationTimeStart).getTime();
      if (!isNaN(start)) result = result.filter((r) => new Date(r.startTime).getTime() >= start);
    }
    if (filters.creationTimeEnd) {
      const end = new Date(filters.creationTimeEnd).getTime();
      if (!isNaN(end)) result = result.filter((r) => new Date(r.startTime).getTime() <= end);
    }
    return result;
  }, [data, filters]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({ anchorId: '', creationTimeStart: '', creationTimeEnd: '' });
    setPage(0);
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
          <TextField
            size="small"
            label="Anchor ID"
            placeholder="Please enter anchor ID"
            value={filters.anchorId}
            onChange={(e) => setFilters((p) => ({ ...p, anchorId: e.target.value }))}
            sx={{ minWidth: 160 }}
          />
          <TextField
            size="small"
            type="date"
            label="Creation time"
            InputLabelProps={{ shrink: true }}
            value={filters.creationTimeStart}
            onChange={(e) => setFilters((p) => ({ ...p, creationTimeStart: e.target.value }))}
            sx={{ minWidth: 160 }}
          />
          <TextField
            size="small"
            type="date"
            label="to"
            InputLabelProps={{ shrink: true }}
            value={filters.creationTimeEnd}
            onChange={(e) => setFilters((p) => ({ ...p, creationTimeEnd: e.target.value }))}
            sx={{ minWidth: 140 }}
          />
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
            Query
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
              <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>Anchor 1</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 130 }}>Anchor Nickname</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>Anchor 2</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 130 }}>Anchor Nickname</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Anchor 1 earnings</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>Earnings for Anchor 2</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 165 }}>Start Time</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Time(minute)</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row) => (
              <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                <TableCell>{row.number}</TableCell>
                <TableCell>{row.anchor1Id}</TableCell>
                <TableCell>{row.anchor1Nickname}</TableCell>
                <TableCell>{row.anchor2Id}</TableCell>
                <TableCell>{row.anchor2Nickname}</TableCell>
                <TableCell>{row.anchor1Earnings}</TableCell>
                <TableCell>{row.anchor2Earnings}</TableCell>
                <TableCell>{row.startTime}</TableCell>
                <TableCell>{row.timeMinutes}</TableCell>
                <TableCell>{row.status}</TableCell>
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
