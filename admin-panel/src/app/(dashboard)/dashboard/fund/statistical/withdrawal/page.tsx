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
import { Search, Clear } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import { demoWithdrawalStatistics } from '@/lib/demo-data';

export default function WithdrawalStatisticsPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    timeFrom: '',
    timeTo: '',
  });

  useEffect(() => {
    addTab({
      id: '/dashboard/fund/statistical/withdrawal',
      label: 'Withdrawal statistics',
      path: '/dashboard/fund/statistical/withdrawal',
      breadcrumbs: ['Home', 'Fund Management', 'Statistical management', 'Withdrawal statistics'],
    });
  }, [addTab]);

  const filtered = useMemo(() => {
    let result = [...demoWithdrawalStatistics];
    if (filters.timeFrom) {
      result = result.filter((r) => r.lastWithdrawalTime >= filters.timeFrom);
    }
    if (filters.timeTo) {
      result = result.filter(
        (r) => r.lastWithdrawalTime <= filters.timeTo + ' 23:59:59'
      );
    }
    return result;
  }, [filters]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const totalAmount = filtered.reduce((sum, r) => sum + r.amount, 0);

  const handleClear = () => {
    setFilters({ timeFrom: '', timeTo: '' });
    setPage(0);
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <Typography component="span" sx={{ fontWeight: 600 }}>
            Statistical time:
          </Typography>
          <TextField
            size="small"
            type="date"
            value={filters.timeFrom}
            onChange={(e) => setFilters((p) => ({ ...p, timeFrom: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 160 }}
          />
          <TextField
            size="small"
            type="date"
            value={filters.timeTo}
            onChange={(e) => setFilters((p) => ({ ...p, timeTo: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 160 }}
          />
          <Button variant="contained" startIcon={<Search />} onClick={() => setPage(0)}>
            Query
          </Button>
          <Button variant="outlined" color="error" startIcon={<Clear />} onClick={handleClear}>
            Clear conditions
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>User ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>User nickname</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Coin</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Last withdrawal time</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Whether to review</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.userId}</TableCell>
                  <TableCell>{row.userNickname}</TableCell>
                  <TableCell>
                    {row.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>{row.coin.toLocaleString()}</TableCell>
                  <TableCell>{row.lastWithdrawalTime}</TableCell>
                  <TableCell>{row.whetherToReview}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2">
            Total number of withdrawals: {filtered.length} | Total amount of withdrawals:{' '}
            {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Typography>
        </Box>
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
