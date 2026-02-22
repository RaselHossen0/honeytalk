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
  Pagination,
  Typography,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { FancyNumberConsumptionFilters } from '@/types/fancy-number';
import { fetchFancyNumberConsumption } from '@/services/fancy-number';

export default function FancyNumberConsumptionPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchFancyNumberConsumption>>['data']>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FancyNumberConsumptionFilters>({
    userId: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchFancyNumberConsumption(
        filters.userId ? filters : undefined,
        page + 1,
        perPage
      );
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filters]);

  useEffect(() => {
    addTab({
      id: '/dashboard/fancy-numbers/consumption',
      label: 'Beautiful Number Consumption Record',
      path: '/dashboard/fancy-numbers/consumption',
      breadcrumbs: ['Home', 'Prop management', 'Fancy Number Management', 'Beautiful Number Consumption Record'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({ userId: '' });
    setPage(0);
  };

  const totalPages = Math.ceil(total / perPage) || 1;

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end', mb: 2 }}>
        <TextField
          size="small"
          label="User ID"
          placeholder="Please enter user ID"
          value={filters.userId}
          onChange={(e) => setFilters((p) => ({ ...p, userId: e.target.value }))}
          sx={{ minWidth: 200 }}
        />
        <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
          Query
        </Button>
        <Button variant="outlined" color="error" onClick={handleClear}>
          Clear conditions
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>User ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Name of purchasing good account</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Consumption amount</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
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
                  <TableCell>{row.user}</TableCell>
                  <TableCell>{row.userId}</TableCell>
                  <TableCell>{row.purchasingGoodAccountName}</TableCell>
                  <TableCell align="right">{row.consumptionAmount}</TableCell>
                  <TableCell>{row.time}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

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
            Total {total}
          </Typography>
          <FormControl size="small" sx={{ minWidth: 90 }}>
            <Select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(0);
              }}
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
            onChange={(_, p) => setPage(p - 1)}
            color="primary"
            size="small"
            showFirstButton
            showLastButton
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Go to
            </Typography>
            <TextField
              size="small"
              type="number"
              value={page + 1}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!isNaN(v) && v >= 1 && v <= totalPages) setPage(v - 1);
              }}
              inputProps={{ min: 1, max: totalPages }}
              sx={{ width: 60 }}
            />
          </Box>
        </Box>
      </TableContainer>
    </Box>
  );
}
