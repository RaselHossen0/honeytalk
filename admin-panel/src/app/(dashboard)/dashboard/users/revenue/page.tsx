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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Pagination,
  Typography,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { RevenueRecord, RevenueFilters } from '@/types/revenue';
import { fetchRevenueRecords } from '@/services/revenue';

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

export default function RevenuePage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<RevenueRecord[]>([]);
  const [total, setTotal] = useState(177954);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [timePreset, setTimePreset] = useState<string>('lastMonth');
  const [userTypes, setUserTypes] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    type: 'all',
    startTime: '',
    endTime: '',
  });
  const [goToPage, setGoToPage] = useState('1');

  useEffect(() => {
    const { start, end } = getDateRange(timePreset);
    setFilters((p) => ({ ...p, startTime: start, endTime: end }));
  }, [timePreset]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const f: RevenueFilters = {};
      if (userTypes.length) f.userTypes = userTypes;
      if (filters.category) f.category = filters.category;
      if (filters.type !== 'all') f.type = filters.type;
      if (filters.startTime) f.startTime = filters.startTime;
      if (filters.endTime) f.endTime = filters.endTime;
      const res = await fetchRevenueRecords(f, page + 1, perPage);
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filters, userTypes]);

  useEffect(() => {
    addTab({
      id: '/dashboard/users/revenue',
      label: 'Revenue records',
      path: '/dashboard/users/revenue',
      breadcrumbs: ['Home', 'User Management', 'Revenue records'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleQuery = () => {
    setPage(0);
    setGoToPage('1');
    load();
  };

  const handleClear = () => {
    setFilters({
      category: '',
      type: 'all',
      startTime: '',
      endTime: '',
    });
    setTimePreset('lastMonth');
    setUserTypes([]);
    setPage(0);
    setGoToPage('1');
  };

  const handlePreset = (preset: string) => {
    setTimePreset(preset);
    const { start, end } = getDateRange(preset);
    setFilters((p) => ({ ...p, startTime: start, endTime: end }));
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage - 1);
    setGoToPage(String(newPage));
  };

  const handleChangePerPage = (e: { target: { value: unknown } }) => {
    setPerPage(Number(e.target.value));
    setPage(0);
    setGoToPage('1');
  };

  const handleGoToPage = () => {
    const p = Math.max(1, Math.min(totalPages, parseInt(goToPage, 10) || 1));
    setPage(p - 1);
    setGoToPage(String(p));
  };

  const totalPages = Math.ceil(total / perPage) || 1;
  const presetConfig = [
    { key: 'today', label: 'Today', color: 'warning' as const },
    { key: 'yesterday', label: 'Yesterday', color: 'error' as const },
    { key: 'week', label: 'week', color: 'inherit' as const },
    { key: 'lastWeek', label: 'Last week', color: 'primary' as const },
    { key: 'month', label: 'month', color: 'inherit' as const },
    { key: 'lastMonth', label: 'Last month', color: 'success' as const },
  ];

  return (
    <Box>
      {/* User type filters - pill buttons */}
      <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <ToggleButtonGroup
          value={userTypes}
          onChange={(_, v) => setUserTypes(v ?? [])}
          exclusive={false}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              textTransform: 'none',
              px: 2,
              py: 0.75,
              borderRadius: '20px !important',
              border: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          <ToggleButton value="paying">Paying User</ToggleButton>
          <ToggleButton value="profitable">Profitable user</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="Income and Expense Category"
            placeholder="Please enter"
            value={filters.category}
            onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}
          />
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
              <MenuItem value="Gift">Gift</MenuItem>
              <MenuItem value="Lucky jackpot">Lucky jackpot</MenuItem>
              <MenuItem value="Lucky winning">Lucky winning</MenuItem>
            </Select>
          </FormControl>
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
      </Grid>

      {/* Date preset buttons */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
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
      </Box>

      {/* Action buttons */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
          Q Query
        </Button>
        <Button variant="outlined" color="error" onClick={handleClear}>
          Clear conditions
        </Button>
      </Box>

      {/* Data table */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Profitable user</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Coin</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Note</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Add Time</TableCell>
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
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.userNickname} ({row.userId})</TableCell>
                  <TableCell align="right" sx={{ color: 'success.main', fontWeight: 500 }}>
                    + {row.coin}
                  </TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>{row.note}</TableCell>
                  <TableCell>{row.addTime}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 2,
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Total {total.toLocaleString()}
          </Typography>
          <FormControl size="small" sx={{ minWidth: 90 }}>
            <Select
              value={perPage}
              onChange={handleChangePerPage}
              sx={{ height: 32, fontSize: 13 }}
            >
              <MenuItem value={5}>5/page</MenuItem>
              <MenuItem value={10}>10/page</MenuItem>
              <MenuItem value={25}>25/page</MenuItem>
              <MenuItem value={50}>50/page</MenuItem>
            </Select>
          </FormControl>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={handleChangePage}
            color="primary"
            size="small"
            showFirstButton
            showLastButton
            siblingCount={2}
            boundaryCount={1}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Go to
            </Typography>
            <TextField
              size="small"
              value={goToPage}
              onChange={(e) => setGoToPage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGoToPage()}
              type="number"
              inputProps={{ min: 1, max: totalPages }}
              sx={{ width: 56, '& .MuiInputBase-input': { py: 0.75, textAlign: 'center' } }}
            />
            <Button size="small" variant="outlined" onClick={handleGoToPage}>
              Go
            </Button>
          </Box>
        </Box>
      </TableContainer>
    </Box>
  );
}
