'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import type { RedEnvelopeRecord } from '@/types/red-envelope';
import { demoRedEnvelopeRecords } from '@/lib/demo-data';

const STATUS_OPTIONS = ['Select', 'In progress', 'Completed', 'Expired'];

export default function RedEnvelopeListPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data] = useState<RedEnvelopeRecord[]>(demoRedEnvelopeRecords);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    userId: '',
    userId2: '',
    liveId: '',
    liveId2: '',
    status: '',
    creationStart: '',
    creationEnd: '',
  });

  useEffect(() => {
    addTab({
      id: '/dashboard/live/red-envelope/list',
      label: 'Red envelope list',
      path: '/dashboard/live/red-envelope/list',
      breadcrumbs: ['Home', 'Live Management', 'Red Envelope Manage', 'Red envelope list'],
    });
  }, [addTab]);

  const filtered = useMemo(() => {
    let result = [...data];
    if (filters.userId.trim()) {
      const k = filters.userId.toLowerCase();
      result = result.filter((r) => r.user.toLowerCase().includes(k));
    }
    if (filters.liveId.trim()) {
      result = result.filter((r) => String(r.roomNumber).includes(filters.liveId));
    }
    if (filters.status && filters.status !== 'Select') {
      result = result.filter((r) => r.status === filters.status);
    }
    if (filters.creationStart) {
      result = result.filter((r) => r.creationTime >= filters.creationStart);
    }
    if (filters.creationEnd) {
      result = result.filter((r) => r.creationTime <= filters.creationEnd + ' 23:59:59');
    }
    return result;
  }, [data, filters]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const consumptionAmount = useMemo(
    () => filtered.reduce((sum, r) => sum + r.amount * r.quantity, 0),
    [filtered]
  );
  const totalRevenue = useMemo(
    () => Math.floor(consumptionAmount * 0.84),
    [consumptionAmount]
  );

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({ userId: '', userId2: '', liveId: '', liveId2: '', status: '', creationStart: '', creationEnd: '' });
    setPage(0);
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
          <TextField size="small" label="User ID" placeholder="Please enter user ID" value={filters.userId} onChange={(e) => setFilters((p) => ({ ...p, userId: e.target.value }))} sx={{ minWidth: 160 }} />
          <TextField size="small" label="User ID" placeholder="To" value={filters.userId2} onChange={(e) => setFilters((p) => ({ ...p, userId2: e.target.value }))} sx={{ minWidth: 120 }} />
          <TextField size="small" label="Live ID" placeholder="Please enter live ID" value={filters.liveId} onChange={(e) => setFilters((p) => ({ ...p, liveId: e.target.value }))} sx={{ minWidth: 160 }} />
          <TextField size="small" label="Live ID" placeholder="To" value={filters.liveId2} onChange={(e) => setFilters((p) => ({ ...p, liveId2: e.target.value }))} sx={{ minWidth: 120 }} />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select value={filters.status} label="Status" onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}>
              <MenuItem value="">Select</MenuItem>
              {STATUS_OPTIONS.filter((o) => o !== 'Select').map((opt) => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField size="small" type="datetime-local" label="Creation time" value={filters.creationStart} onChange={(e) => setFilters((p) => ({ ...p, creationStart: e.target.value }))} InputLabelProps={{ shrink: true }} sx={{ minWidth: 180 }} />
          <TextField size="small" type="datetime-local" label="To" value={filters.creationEnd} onChange={(e) => setFilters((p) => ({ ...p, creationEnd: e.target.value }))} InputLabelProps={{ shrink: true }} sx={{ minWidth: 180 }} />
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>Query</Button>
          <Button variant="outlined" color="error" startIcon={<Clear />} onClick={handleClear}>Clear conditions</Button>
        </Box>
      </Paper>

      <Box sx={{ mb: 2, fontSize: 14, color: 'text.secondary' }}>
        Consumption amount : {consumptionAmount.toLocaleString()} ; Total revenue: {totalRevenue.toLocaleString()}
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Room number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Creation time</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Start Time</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Note</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Operation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.roomNumber}</TableCell>
                  <TableCell>{row.user}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>{row.amount.toLocaleString()}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.creationTime}</TableCell>
                  <TableCell>{row.startTime}</TableCell>
                  <TableCell>{row.note || '-'}</TableCell>
                  <TableCell align="right">
                    <OperationButton items={[{ label: 'Red envelope collect', onClick: () => {} }]} />
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
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[10, 25, 50]}
          labelRowsPerPage="per page"
          labelDisplayedRows={({ from, to, count }) => `Total ${count}`}
        />
      </Paper>
    </Box>
  );
}
