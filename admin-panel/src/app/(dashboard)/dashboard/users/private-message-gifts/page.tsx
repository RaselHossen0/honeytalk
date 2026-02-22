'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
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
import type { PrivateMessageGiftStat, PrivateMessageGiftFilters } from '@/types/private-message-gifts';
import { fetchPrivateMessageGiftStats } from '@/services/private-message-gifts';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

export default function PrivateMessageGiftsPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<PrivateMessageGiftStat[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    anchorId: '',
    anchorNickname: '',
    year: CURRENT_YEAR,
    month: String(new Date().getMonth() + 1).padStart(2, '0'),
    dateStart: '',
    dateEnd: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const f: PrivateMessageGiftFilters = {};
      if (filters.anchorId) f.anchorId = filters.anchorId;
      if (filters.anchorNickname) f.anchorNickname = filters.anchorNickname;
      if (filters.year) f.year = filters.year;
      if (filters.month) f.month = parseInt(filters.month, 10);
      if (filters.dateStart) f.dateStart = filters.dateStart;
      if (filters.dateEnd) f.dateEnd = filters.dateEnd;
      const res = await fetchPrivateMessageGiftStats(f, page + 1, perPage);
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filters]);

  useEffect(() => {
    addTab({
      id: '/dashboard/users/private-message-gifts',
      label: 'Private message gift statistics',
      path: '/dashboard/users/private-message-gifts',
      breadcrumbs: ['Home', 'User Management', 'Private message gift statistics'],
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
      anchorId: '',
      anchorNickname: '',
      year: CURRENT_YEAR,
      month: String(new Date().getMonth() + 1).padStart(2, '0'),
      dateStart: '',
      dateEnd: '',
    });
    setPage(0);
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangePerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPerPage(Number(e.target.value));
    setPage(0);
  };

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            size="small"
            fullWidth
            label="Anchor ID"
            placeholder="Please enter anchor ID"
            value={filters.anchorId}
            onChange={(e) => setFilters((p) => ({ ...p, anchorId: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            size="small"
            fullWidth
            label="Anchor Nickname"
            placeholder="Please enter the anchor"
            value={filters.anchorNickname}
            onChange={(e) => setFilters((p) => ({ ...p, anchorNickname: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <FormControl size="small" fullWidth sx={{ minWidth: 140 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={filters.year}
              label="Year"
              onChange={(e) => setFilters((p) => ({ ...p, year: e.target.value as number }))}
            >
              {YEARS.map((y) => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <FormControl size="small" fullWidth>
            <InputLabel>Month</InputLabel>
            <Select
              value={filters.month}
              label="Month"
              onChange={(e) => setFilters((p) => ({ ...p, month: e.target.value }))}
            >
              {MONTHS.map((m) => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            type="date"
            label="Date Start"
            InputLabelProps={{ shrink: true }}
            value={filters.dateStart}
            onChange={(e) => setFilters((p) => ({ ...p, dateStart: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            type="date"
            label="Date End"
            InputLabelProps={{ shrink: true }}
            value={filters.dateEnd}
            onChange={(e) => setFilters((p) => ({ ...p, dateEnd: e.target.value }))}
          />
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
              <TableCell><strong>Anchor ID</strong></TableCell>
              <TableCell><strong>Anchor Nickname</strong></TableCell>
              <TableCell align="right"><strong>Total revenue(Coin)</strong></TableCell>
              <TableCell align="right"><strong>Total number of people</strong></TableCell>
              <TableCell align="right"><strong>Operation</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.anchorId}</TableCell>
                  <TableCell>{row.anchorNickname}</TableCell>
                  <TableCell align="right">{row.totalRevenueCoin.toLocaleString()}</TableCell>
                  <TableCell align="right">{row.totalNumberOfPeople}</TableCell>
                  <TableCell align="right">
                    <Link
                      href={`/dashboard/users/private-message-gifts/${row.anchorId}?nickname=${encodeURIComponent(row.anchorNickname)}`}
                      passHref
                      legacyBehavior
                    >
                      <Button variant="contained" color="primary" size="small" component="a">
                        View Details
                      </Button>
                    </Link>
                  </TableCell>
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
