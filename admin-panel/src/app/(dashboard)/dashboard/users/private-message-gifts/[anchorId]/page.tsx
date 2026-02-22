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
  Typography,
  CircularProgress,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { PrivateMessageGiftDetail, PrivateMessageGiftDetailFilters } from '@/types/private-message-gifts';
import { fetchPrivateMessageGiftDetails } from '@/services/private-message-gifts';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

export default function PrivateMessageGiftDetailsPage({
  params,
  searchParams,
}: {
  params: { anchorId: string };
  searchParams: { nickname?: string };
}) {
  const anchorId = parseInt(params.anchorId, 10);
  const anchorNickname = searchParams.nickname ?? '';

  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<PrivateMessageGiftDetail[]>([]);
  const [total, setTotal] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalNumberOfPeople, setTotalNumberOfPeople] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<{
    userId: string;
    userNickname: string;
    year: number;
    month: string;
    dateStart: string;
    dateEnd: string;
  }>({
    userId: '',
    userNickname: '',
    year: CURRENT_YEAR,
    month: String(new Date().getMonth() + 1).padStart(2, '0'),
    dateStart: '',
    dateEnd: '',
  });

  const load = useCallback(async () => {
    if (Number.isNaN(anchorId)) return;
    setLoading(true);
    try {
      const f: PrivateMessageGiftDetailFilters = {};
      if (filters.userId) f.userId = filters.userId;
      if (filters.userNickname) f.userNickname = filters.userNickname;
      if (filters.year) f.year = filters.year;
      if (filters.month) f.month = parseInt(filters.month, 10);
      if (filters.dateStart) f.dateStart = filters.dateStart;
      if (filters.dateEnd) f.dateEnd = filters.dateEnd;
      const res = await fetchPrivateMessageGiftDetails(anchorId, f, page + 1, perPage);
      setData(res.data);
      setTotal(res.total);
      setTotalRevenue(res.totalRevenue);
      setTotalNumberOfPeople(res.totalNumberOfPeople);
    } finally {
      setLoading(false);
    }
  }, [anchorId, page, perPage, filters]);

  useEffect(() => {
    addTab({
      id: `/dashboard/users/private-message-gifts/${anchorId}`,
      label: 'Private message gift details',
      path: `/dashboard/users/private-message-gifts/${anchorId}${anchorNickname ? `?nickname=${encodeURIComponent(anchorNickname)}` : ''}`,
      breadcrumbs: ['Home', 'User Management', 'Private message gift statistics', 'Private message gift details'],
    });
  }, [addTab, anchorId, anchorNickname]);

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
      userNickname: '',
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

  if (Number.isNaN(anchorId)) {
    return (
      <Box sx={{ py: 2 }}>
        <Typography color="error">Invalid anchor ID</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
        Anchor Nickname {anchorNickname || '—'}({anchorId}) Private Message Gift Details
      </Typography>

      <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
          <TextField
            size="small"
            sx={{ minWidth: 160 }}
            label="User ID"
            placeholder="Please enter user ID"
            value={filters.userId}
            onChange={(e) => setFilters((p) => ({ ...p, userId: e.target.value }))}
            variant="outlined"
          />
          <TextField
            size="small"
            sx={{ minWidth: 160 }}
            label="User nickname"
            placeholder="User nickname"
            value={filters.userNickname}
            onChange={(e) => setFilters((p) => ({ ...p, userNickname: e.target.value }))}
            variant="outlined"
          />
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Year and Month</InputLabel>
            <Select
              value={filters.year}
              label="Year and Month"
              onChange={(e) => setFilters((p) => ({ ...p, year: e.target.value as number }))}
            >
              {YEARS.map((y) => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 90 }}>
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
          <TextField
            size="small"
            type="date"
            label="Date"
            InputLabelProps={{ shrink: true }}
            value={filters.dateStart}
            onChange={(e) => setFilters((p) => ({ ...p, dateStart: e.target.value }))}
            sx={{ minWidth: 140 }}
          />
          <Typography component="span" sx={{ px: 1 }}>—</Typography>
          <TextField
            size="small"
            type="date"
            label="Date"
            InputLabelProps={{ shrink: true }}
            value={filters.dateEnd}
            onChange={(e) => setFilters((p) => ({ ...p, dateEnd: e.target.value }))}
            sx={{ minWidth: 140 }}
          />
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery} size="medium">
            Q Query
          </Button>
          <Button variant="outlined" color="error" onClick={handleClear} size="medium">
            Clear conditions
          </Button>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
        <Typography variant="body1">
          Total revenue (Coin): <strong>{totalRevenue.toLocaleString()}</strong>
        </Typography>
        <Typography variant="body1">
          Total number of people: <strong>{totalNumberOfPeople}</strong>
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ '& th': { bgcolor: 'grey.50', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary', borderBottom: '1px solid', borderColor: 'divider', py: 1.25 } }}>
                <TableCell>User ID</TableCell>
                <TableCell>User nickname</TableCell>
                <TableCell align="right">Total revenue(Coin)</TableCell>
                <TableCell>gift_time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                    <CircularProgress size={32} sx={{ mr: 1.5, verticalAlign: 'middle' }} />
                    <Typography component="span" variant="body2" color="text.secondary">
                      Loading...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                    <Typography variant="body2" color="text.secondary">
                      No gift records found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                    <TableCell>{row.userId}</TableCell>
                    <TableCell>{row.userNickname}</TableCell>
                    <TableCell align="right">{row.totalRevenueCoin.toLocaleString()}</TableCell>
                    <TableCell>{row.giftTime}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, p: 1.5, borderTop: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
          <Typography variant="body2" color="text.secondary">
            Total {total}
          </Typography>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={perPage}
            onRowsPerPageChange={handleChangePerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage=""
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
          />
        </Box>
      </Paper>
    </Box>
  );
}
