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
  Grid,
  Pagination,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { GameCoinRecordFilters } from '@/types/game';
import { fetchGameCoinRecords } from '@/services/game';

const DATE_BUTTONS = [
  { label: 'Today', color: 'warning' as const },
  { label: 'Yesterday', color: 'error' as const },
  { label: 'week', color: 'inherit' as const },
  { label: 'Last week', color: 'info' as const },
  { label: 'month', color: 'warning' as const },
  { label: 'Last month', color: 'success' as const },
];

function getDateRange(label: string): { start: string; end: string } {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const lastWeekEnd = new Date(now);
  lastWeekEnd.setDate(lastWeekEnd.getDate() - 7);
  const lastWeekStart = new Date(lastWeekEnd);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  const monthAgo = new Date(now);
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const ranges: Record<string, { start: string; end: string }> = {
    Today: { start: today, end: today },
    Yesterday: { start: yesterday.toISOString().slice(0, 10), end: yesterday.toISOString().slice(0, 10) },
    week: { start: weekAgo.toISOString().slice(0, 10), end: today },
    'Last week': { start: lastWeekStart.toISOString().slice(0, 10), end: lastWeekEnd.toISOString().slice(0, 10) },
    month: { start: monthAgo.toISOString().slice(0, 10), end: today },
    'Last month': { start: lastMonthStart.toISOString().slice(0, 10), end: lastMonthEnd.toISOString().slice(0, 10) },
  };
  return ranges[label] ?? { start: '', end: '' };
}

export default function GameCoinRecordPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchGameCoinRecords>>['data']>([]);
  const [total, setTotal] = useState(0);
  const [consumptionAmount, setConsumptionAmount] = useState(0);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<GameCoinRecordFilters>({
    type: 'all',
    userId: '',
    identification: '',
    timeStart: '',
    timeEnd: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const hasFilters = filters.userId || filters.identification || filters.timeStart || filters.timeEnd || (filters.type && filters.type !== 'all');
      const res = await fetchGameCoinRecords(hasFilters ? filters : undefined, page + 1, perPage);
      setData(res.data);
      setTotal(res.total);
      setConsumptionAmount(res.consumptionAmount);
      setRewardAmount(res.rewardAmount);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filters]);

  useEffect(() => {
    addTab({
      id: '/dashboard/games/coin-record',
      label: 'Game coin record',
      path: '/dashboard/games/coin-record',
      breadcrumbs: ['Home', 'Plugin management', 'Third party games', 'Game coin record'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({ type: 'all', userId: '', identification: '', timeStart: '', timeEnd: '' });
    setPage(0);
  };

  const handleDateButton = (label: string) => {
    const { start, end } = getDateRange(label);
    setFilters((p) => ({ ...p, timeStart: start, timeEnd: end }));
  };

  const totalPages = Math.ceil(total / perPage) || 1;

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <FormControl size="small" fullWidth>
            <InputLabel>Type</InputLabel>
            <Select value={filters.type} label="Type" onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="greedy">greedy</MenuItem>
              <MenuItem value="lucky77">lucky77</MenuItem>
              <MenuItem value="lucky99">lucky99</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField size="small" fullWidth label="User ID" value={filters.userId} onChange={(e) => setFilters((p) => ({ ...p, userId: e.target.value }))} placeholder="Please enter" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField size="small" fullWidth label="identification" value={filters.identification} onChange={(e) => setFilters((p) => ({ ...p, identification: e.target.value }))} placeholder="Please enter" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField size="small" fullWidth type="date" label="Time" InputLabelProps={{ shrink: true }} value={filters.timeStart} onChange={(e) => setFilters((p) => ({ ...p, timeStart: e.target.value }))} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField size="small" fullWidth type="date" label="Time" InputLabelProps={{ shrink: true }} value={filters.timeEnd} onChange={(e) => setFilters((p) => ({ ...p, timeEnd: e.target.value }))} />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {DATE_BUTTONS.map((b) => (
          <Button key={b.label} size="small" variant="outlined" color={b.color} onClick={() => handleDateButton(b.label)}>
            {b.label}
          </Button>
        ))}
        <Button variant="contained" startIcon={<Search />} onClick={handleQuery} sx={{ ml: 1 }}>
          Q Query
        </Button>
        <Button variant="outlined" color="error" onClick={handleClear}>
          Clear conditions
        </Button>
      </Box>

      <Box sx={{ mb: 2, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Typography variant="body1">
          <strong>Consumption amount:</strong> {consumptionAmount.toLocaleString()}
        </Typography>
        <Typography variant="body1">
          <strong>Reward Amount:</strong> {rewardAmount.toLocaleString()}
        </Typography>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>User nickname</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Game Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>identification</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Consumption amount</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Reward Amount</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Game victory result</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.userNickname}({row.userId})</TableCell>
                  <TableCell>{row.gameName}</TableCell>
                  <TableCell sx={{ maxWidth: 180, fontSize: 12 }}>{row.identification}</TableCell>
                  <TableCell align="right">{row.consumptionAmount.toLocaleString()}</TableCell>
                  <TableCell align="right">{row.rewardAmount.toLocaleString()}</TableCell>
                  <TableCell sx={{ maxWidth: 320, fontSize: 11 }}>{row.gameVictoryResult}</TableCell>
                  <TableCell>{row.time}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary">
            Total {total}
          </Typography>
          <FormControl size="small" sx={{ minWidth: 90 }}>
            <Select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(0); }} sx={{ height: 32, fontSize: 13 }}>
              <MenuItem value={5}>5/page</MenuItem>
              <MenuItem value={10}>10/page</MenuItem>
              <MenuItem value={25}>25/page</MenuItem>
              <MenuItem value={50}>50/page</MenuItem>
            </Select>
          </FormControl>
          <Pagination count={totalPages} page={page + 1} onChange={(_, p) => setPage(p - 1)} color="primary" size="small" showFirstButton showLastButton />
        </Box>
      </TableContainer>
    </Box>
  );
}
