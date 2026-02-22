'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { IncomeExpenditureRecord, IncomeExpenditureFilters } from '@/types/income-expenditure';
import { fetchIncomeExpenditureRecords } from '@/services/income-expenditure';

function getDateRange(preset: string): { start: string; end: string } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const pad = (d: Date) => d.toISOString().slice(0, 10);

  switch (preset) {
    case 'today':
      return { start: pad(today), end: pad(today) };
    case 'yesterday': {
      const y = new Date(today);
      y.setDate(y.getDate() - 1);
      return { start: pad(y), end: pad(y) };
    }
    case 'week': {
      const wStart = new Date(today);
      wStart.setDate(wStart.getDate() - wStart.getDay());
      return { start: pad(wStart), end: pad(today) };
    }
    case 'lastWeek': {
      const lwEnd = new Date(today);
      lwEnd.setDate(lwEnd.getDate() - lwEnd.getDay() - 1);
      const lwStart = new Date(lwEnd);
      lwStart.setDate(lwStart.getDate() - 6);
      return { start: pad(lwStart), end: pad(lwEnd) };
    }
    case 'month': {
      const mStart = new Date(today.getFullYear(), today.getMonth(), 1);
      return { start: pad(mStart), end: pad(today) };
    }
    case 'lastMonth': {
      const lm = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lmEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      return { start: pad(lm), end: pad(lmEnd) };
    }
    default:
      return { start: '', end: '' };
  }
}

export default function IncomeExpenditurePage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<IncomeExpenditureRecord[]>([]);
  const [total, setTotal] = useState(273282);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [timePreset, setTimePreset] = useState<string>('lastMonth');
  const [filters, setFilters] = useState({
    userId: '',
    user: '',
    startTime: '',
    endTime: '',
    category: 'all',
    type: 'all',
  });

  useEffect(() => {
    const { start, end } = getDateRange(timePreset);
    setFilters((p) => ({ ...p, startTime: start, endTime: end }));
  }, [timePreset]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const f: IncomeExpenditureFilters = {};
      if (filters.userId) f.userId = filters.userId;
      if (filters.user) f.user = filters.user;
      if (filters.startTime) f.startTime = filters.startTime;
      if (filters.endTime) f.endTime = filters.endTime;
      if (filters.category !== 'all') f.category = filters.category;
      if (filters.type !== 'all') f.type = filters.type;
      const res = await fetchIncomeExpenditureRecords(f, page + 1, perPage);
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filters]);

  useEffect(() => {
    addTab({
      id: '/dashboard/users/income-expenditure',
      label: 'Income and expenditure records',
      path: '/dashboard/users/income-expenditure',
      breadcrumbs: ['Home', 'User Management', 'Income and expenditure records'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleQuery = () => {
    setPage(0);
    load();
  };

  const handleClear = () => {
    setFilters({
      userId: '',
      user: '',
      startTime: '',
      endTime: '',
      category: 'all',
      type: 'all',
    });
    setTimePreset('lastMonth');
    setPage(0);
  };

  const handlePreset = (preset: string) => {
    setTimePreset(preset);
    const { start, end } = getDateRange(preset);
    setFilters((p) => ({ ...p, startTime: start, endTime: end }));
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangePerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPerPage(Number(e.target.value));
    setPage(0);
  };

  const presetConfig = [
    { key: 'today', label: 'Today', color: 'warning' as const },
    { key: 'yesterday', label: 'Yesterday', color: 'error' as const },
    { key: 'week', label: 'week', color: 'inherit' as const },
    { key: 'lastWeek', label: 'Last week', color: 'primary' as const },
    { key: 'month', label: 'month', color: 'warning' as const },
    { key: 'lastMonth', label: 'Last month', color: 'success' as const },
  ];

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="User ID"
            placeholder="Please enter"
            value={filters.userId}
            onChange={(e) => setFilters((p) => ({ ...p, userId: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="User"
            placeholder="Please enter"
            value={filters.user}
            onChange={(e) => setFilters((p) => ({ ...p, user: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            type="date"
            label="Start Time"
            InputLabelProps={{ shrink: true }}
            value={filters.startTime}
            onChange={(e) => setFilters((p) => ({ ...p, startTime: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            type="date"
            label="End Time"
            InputLabelProps={{ shrink: true }}
            value={filters.endTime}
            onChange={(e) => setFilters((p) => ({ ...p, endTime: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <FormControl size="small" fullWidth>
            <InputLabel>Income and Expense Category</InputLabel>
            <Select
              value={filters.category}
              label="Income and Expense Category"
              onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Gift">Gift</MenuItem>
              <MenuItem value="Lucky jackpot">Lucky jackpot</MenuItem>
              <MenuItem value="Lucky winning">Lucky winning</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <FormControl size="small" fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={filters.type}
              label="Type"
              onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expenditure">Expenditure</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} display="flex" flexWrap="wrap" gap={1} alignItems="center" sx={{ mt: 1 }}>
          {presetConfig.map(({ key, label, color }) => (
            <Button
              key={key}
              variant={timePreset === key ? 'contained' : 'outlined'}
              color={color === 'inherit' ? undefined : color}
              size="small"
              onClick={() => handlePreset(key)}
              sx={{ color: timePreset === key && color === 'inherit' ? 'grey.700' : undefined }}
            >
              {label}
            </Button>
          ))}
        </Grid>
        <Grid item xs={12} display="flex" flexWrap="wrap" gap={2} alignItems="center">
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
            Q Query
          </Button>
          <Button variant="outlined" color="error" onClick={handleClear}>
            Clear conditions
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell><strong>Number</strong></TableCell>
              <TableCell><strong>User</strong></TableCell>
              <TableCell align="right"><strong>Number of Changes</strong></TableCell>
              <TableCell><strong>Content</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>Add Time</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>
                    {row.userNickname} ({row.userId})
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: row.numberOfChanges >= 0 ? 'success.main' : 'error.main',
                      fontWeight: 500,
                    }}
                  >
                    {row.numberOfChanges >= 0 ? '+' : ''}
                    {row.numberOfChanges}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 280 }}>{row.content}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.addTime}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1.5, borderTop: 1, borderColor: 'divider' }}>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={perPage}
            onRowsPerPageChange={handleChangePerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage=""
            labelDisplayedRows={({ from, to, count }) => `Total ${count} • ${from}-${to} of ${count}`}
          />
        </Box>
      </TableContainer>
    </Box>
  );
}
