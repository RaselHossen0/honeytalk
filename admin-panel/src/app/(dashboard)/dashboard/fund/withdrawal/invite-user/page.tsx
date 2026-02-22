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
import type { InviteUserWithdrawal } from '@/types/fund';
import { demoInviteUserWithdrawals } from '@/lib/demo-data';

const STATUS_OPTIONS = ['Select', 'Under review', 'Approved', 'Rejected'];
const TYPE_OPTIONS = ['All', 'wp', 'bank', 'bri'];

export default function InviteUserWithdrawalListPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<InviteUserWithdrawal[]>(demoInviteUserWithdrawals);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    userId: '',
    status: '',
    type: 'All',
  });

  useEffect(() => {
    addTab({
      id: '/dashboard/fund/withdrawal/invite-user',
      label: 'Invite user withdrawal list',
      path: '/dashboard/fund/withdrawal/invite-user',
      breadcrumbs: ['Home', 'Fund Management', 'Withdrawal management', 'Invite user withdrawal list'],
    });
  }, [addTab]);

  const filtered = useMemo(() => {
    let result = [...data];
    if (filters.userId.trim()) {
      result = result.filter((r) => String(r.userId).includes(filters.userId));
    }
    if (filters.status && filters.status !== 'Select') {
      result = result.filter((r) => r.status === filters.status);
    }
    if (filters.type && filters.type !== 'All') {
      result = result.filter((r) => r.accountType === filters.type);
    }
    return result;
  }, [data, filters]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({ userId: '', status: '', type: 'All' });
    setPage(0);
  };

  const handleApproved = (row: InviteUserWithdrawal) => {
    setData((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, status: 'Approved' } : r))
    );
  };

  const handleReject = (row: InviteUserWithdrawal) => {
    setData((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, status: 'Rejected' } : r))
    );
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
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
            >
              <MenuItem value="">Select</MenuItem>
              {STATUS_OPTIONS.filter((o) => o !== 'Select').map((opt) => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={filters.type}
              label="Type"
              onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}
            >
              {TYPE_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
            Query
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
                <TableCell sx={{ fontWeight: 600 }}>User ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>User nickname</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Amount of transfer (withdrawal)</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Number of diamonds to withdraw</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Account type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Bank Account Number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Payment Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Application time</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Operation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell>{row.userId}</TableCell>
                  <TableCell>{row.userNickname}</TableCell>
                  <TableCell>{row.amount.toLocaleString()}</TableCell>
                  <TableCell>{row.coin}</TableCell>
                  <TableCell>{row.accountType}</TableCell>
                  <TableCell>{row.bankAccountNumber}</TableCell>
                  <TableCell>{row.paymentName}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.applicationTime}</TableCell>
                  <TableCell align="right">
                    {row.status === 'Under review' ? (
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button size="small" variant="outlined" color="primary" onClick={() => handleApproved(row)}>
                          Approved
                        </Button>
                        <Button size="small" variant="outlined" color="error" onClick={() => handleReject(row)}>
                          Reject
                        </Button>
                      </Box>
                    ) : (
                      <Box component="span" sx={{ color: 'text.secondary', fontSize: 13 }}>
                        {row.status}
                      </Box>
                    )}
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
