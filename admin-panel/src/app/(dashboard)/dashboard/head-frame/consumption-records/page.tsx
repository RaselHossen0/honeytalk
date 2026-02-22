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
import type { HeadFrameConsumptionRecord } from '@/types/head-frame';
import { demoHeadFrameConsumptionRecords } from '@/lib/demo-data';

export default function HeadFrameConsumptionRecordsPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data] = useState<HeadFrameConsumptionRecord[]>(demoHeadFrameConsumptionRecords);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({ userId: '', timeStart: '', timeEnd: '' });

  useEffect(() => {
    addTab({
      id: '/dashboard/head-frame/consumption-records',
      label: 'Consumption Records',
      path: '/dashboard/head-frame/consumption-records',
      breadcrumbs: ['Home', 'Prop management', 'head frame', 'Consumption Records'],
    });
  }, [addTab]);

  const filtered = useMemo(() => {
    let result = [...data];
    if (filters.userId.trim()) {
      const k = filters.userId.toLowerCase();
      result = result.filter(
        (r) =>
          String(r.userId).toLowerCase().includes(k) ||
          r.regularUser.toLowerCase().includes(k)
      );
    }
    if (filters.timeStart) {
      result = result.filter((r) => r.addTime >= filters.timeStart);
    }
    if (filters.timeEnd) {
      result = result.filter((r) => r.addTime <= filters.timeEnd);
    }
    return result;
  }, [data, filters]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({ userId: '', timeStart: '', timeEnd: '' });
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
            sx={{ minWidth: 200 }}
          />
          <TextField
            size="small"
            type="datetime-local"
            label="Time"
            value={filters.timeStart}
            onChange={(e) => setFilters((p) => ({ ...p, timeStart: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
          />
          <TextField
            size="small"
            type="datetime-local"
            label="to"
            value={filters.timeEnd}
            onChange={(e) => setFilters((p) => ({ ...p, timeEnd: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
          />
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
            Q Query
          </Button>
          <Button variant="outlined" color="error" startIcon={<Clear />} onClick={handleClear}>
            Clear conditions
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Regular user</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Consumption amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Add Time</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>End Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.regularUser}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.consumptionAmount}</TableCell>
                  <TableCell>{row.addTime}</TableCell>
                  <TableCell>{row.endTime}</TableCell>
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
          labelDisplayedRows={({ from, to, count }) => `Total ${count} • ${from}-${to}`}
        />
      </Paper>
    </Box>
  );
}
