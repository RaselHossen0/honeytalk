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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { RechargeRecord } from '@/types/fund';
import { demoRechargeRecords } from '@/lib/demo-data';

export default function RechargeManagementPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data] = useState<RechargeRecord[]>(demoRechargeRecords);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    userId: '',
    userNickname: '',
    paymentOrderNumber: '',
    externalOrderNumber: '',
    paymentStatus: 'All',
    paymentMethod: 'all',
    creationStart: '',
    creationEnd: '',
  });

  useEffect(() => {
    addTab({
      id: '/dashboard/fund/recharge',
      label: 'Recharge management',
      path: '/dashboard/fund/recharge',
      breadcrumbs: ['Home', 'Fund Management', 'Recharge management'],
    });
  }, [addTab]);

  const paymentMethods = useMemo(() => Array.from(new Set(data.map((r) => r.paymentMethod))), [data]);

  const filtered = useMemo(() => {
    let result = [...data];
    if (filters.userId.trim()) {
      const k = filters.userId.toLowerCase();
      result = result.filter((r) => String(r.userId).toLowerCase().includes(k));
    }
    if (filters.userNickname.trim()) {
      const k = filters.userNickname.toLowerCase();
      result = result.filter((r) => r.userNickname.toLowerCase().includes(k));
    }
    if (filters.paymentOrderNumber.trim()) {
      const k = filters.paymentOrderNumber.toLowerCase();
      result = result.filter((r) => r.paymentOrderNumber.toLowerCase().includes(k));
    }
    if (filters.externalOrderNumber.trim()) {
      const k = filters.externalOrderNumber.toLowerCase();
      result = result.filter((r) => r.externalOrderNumber.toLowerCase().includes(k));
    }
    if (filters.paymentMethod && filters.paymentMethod !== 'all') {
      result = result.filter((r) => r.paymentMethod === filters.paymentMethod);
    }
    if (filters.paymentStatus === 'Paid') {
      result = result.filter((r) => r.whetherPaid === 'Yes');
    } else if (filters.paymentStatus === 'Unpaid') {
      result = result.filter((r) => r.whetherPaid === 'No');
    }
    if (filters.creationStart) {
      result = result.filter((r) => r.creationTime >= filters.creationStart);
    }
    if (filters.creationEnd) {
      result = result.filter((r) => r.creationTime <= filters.creationEnd);
    }
    return result;
  }, [data, filters]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({
      userId: '',
      userNickname: '',
      paymentOrderNumber: '',
      externalOrderNumber: '',
      paymentStatus: 'All',
      paymentMethod: 'all',
      creationStart: '',
      creationEnd: '',
    });
    setPage(0);
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
          <TextField size="small" label="User ID" placeholder="Please enter user ID" value={filters.userId} onChange={(e) => setFilters((p) => ({ ...p, userId: e.target.value }))} sx={{ minWidth: 160 }} />
          <TextField size="small" label="User nickname" placeholder="Please enter user nickname" value={filters.userNickname} onChange={(e) => setFilters((p) => ({ ...p, userNickname: e.target.value }))} sx={{ minWidth: 180 }} />
          <TextField size="small" label="Payment Order Number" placeholder="Please enter Payment Order Number" value={filters.paymentOrderNumber} onChange={(e) => setFilters((p) => ({ ...p, paymentOrderNumber: e.target.value }))} sx={{ minWidth: 200 }} />
          <TextField size="small" label="External Order Number" placeholder="External Order Number" value={filters.externalOrderNumber} onChange={(e) => setFilters((p) => ({ ...p, externalOrderNumber: e.target.value }))} sx={{ minWidth: 180 }} />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Payment status</InputLabel>
            <Select value={filters.paymentStatus} label="Payment status" onChange={(e) => setFilters((p) => ({ ...p, paymentStatus: e.target.value }))}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Unpaid">Unpaid</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Payment Method</InputLabel>
            <Select value={filters.paymentMethod} label="Payment Method" onChange={(e) => setFilters((p) => ({ ...p, paymentMethod: e.target.value }))}>
              <MenuItem value="all">Please select</MenuItem>
              {paymentMethods.map((m) => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField size="small" type="datetime-local" label="Creation time" value={filters.creationStart} onChange={(e) => setFilters((p) => ({ ...p, creationStart: e.target.value }))} InputLabelProps={{ shrink: true }} sx={{ minWidth: 180 }} />
          <TextField size="small" type="datetime-local" label="to" value={filters.creationEnd} onChange={(e) => setFilters((p) => ({ ...p, creationEnd: e.target.value }))} InputLabelProps={{ shrink: true }} sx={{ minWidth: 180 }} />
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>Query</Button>
          <Button variant="outlined" color="error" startIcon={<Clear />} onClick={handleClear}>Clear conditions</Button>
        </Box>
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>User ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>User nickname</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Payment Order Number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Project name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>External Order Number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Payment Method</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Creation time</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Payment Time</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Whether paid</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.userId}</TableCell>
                  <TableCell>{row.userNickname}</TableCell>
                  <TableCell>{row.paymentOrderNumber}</TableCell>
                  <TableCell>{row.projectName}</TableCell>
                  <TableCell>{row.externalOrderNumber}</TableCell>
                  <TableCell>{row.paymentMethod}</TableCell>
                  <TableCell>{row.creationTime}</TableCell>
                  <TableCell>{row.paymentTime || '-'}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>{row.whetherPaid}</TableCell>
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
          labelDisplayedRows={({ from, to, count }) => `Total ${count} • ${from}-${to}`}
        />
      </Paper>
    </Box>
  );
}
