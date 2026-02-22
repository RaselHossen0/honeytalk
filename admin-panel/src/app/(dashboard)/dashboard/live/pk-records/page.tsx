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

  const stickyFirst = {
    position: 'sticky' as const,
    left: 0,
    zIndex: 3,
    minWidth: 90,
    width: 90,
    bgcolor: 'grey.50',
    boxShadow: '2px 0 4px -2px rgba(0,0,0,0.08)',
  };
  const stickyLast = {
    position: 'sticky' as const,
    right: 0,
    zIndex: 3,
    minWidth: 100,
    width: 100,
    bgcolor: 'grey.50',
    boxShadow: '-2px 0 4px -2px rgba(0,0,0,0.08)',
  };
  const stickyFirstBody = (bg: string) => ({ ...stickyFirst, zIndex: 2, bgcolor: bg });
  const stickyLastBody = (bg: string) => ({ ...stickyLast, zIndex: 2, bgcolor: bg });

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

      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer sx={{ overflowX: 'auto', overflowY: 'visible', width: '100%' }}>
          <Table size="small" sx={{ minWidth: 1300 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ ...stickyFirst, fontWeight: 600 }}>Number</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>Anchor 1</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 130 }}>Anchor Nickname</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>Anchor 2</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 130 }}>Anchor Nickname</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Anchor 1 earnings</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>Earnings for Anchor 2</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 165 }}>Start Time</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Time(minute)</TableCell>
                <TableCell sx={{ ...stickyLast, fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row, index) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell sx={stickyFirstBody(index % 2 === 1 ? 'grey.50' : 'background.paper')}>
                    {row.number}
                  </TableCell>
                  <TableCell>{row.anchor1Id}</TableCell>
                  <TableCell>{row.anchor1Nickname}</TableCell>
                  <TableCell>{row.anchor2Id}</TableCell>
                  <TableCell>{row.anchor2Nickname}</TableCell>
                  <TableCell>{row.anchor1Earnings}</TableCell>
                  <TableCell>{row.anchor2Earnings}</TableCell>
                  <TableCell>{row.startTime}</TableCell>
                  <TableCell>{row.timeMinutes}</TableCell>
                  <TableCell sx={stickyLastBody(index % 2 === 1 ? 'grey.50' : 'background.paper')}>
                    {row.status}
                  </TableCell>
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
