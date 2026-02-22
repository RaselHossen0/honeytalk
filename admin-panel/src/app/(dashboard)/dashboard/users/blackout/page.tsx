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
  Chip,
  Grid,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { BlackoutRecord, BlackoutFilters } from '@/types/blackout';
import { fetchBlackoutRecords } from '@/services/blackout';

export default function BlackoutPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<BlackoutRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    userId: '',
    identifying: '',
    type: 'all',
    status: 'all',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const f: BlackoutFilters = {};
      if (filters.userId) f.userId = filters.userId;
      if (filters.identifying) f.identifying = filters.identifying;
      if (filters.type !== 'all') f.type = filters.type;
      if (filters.status !== 'all') f.status = filters.status;
      const res = await fetchBlackoutRecords(f, page + 1, perPage);
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filters]);

  useEffect(() => {
    addTab({
      id: '/dashboard/users/blackout',
      label: 'Blackout records',
      path: '/dashboard/users/blackout',
      breadcrumbs: ['Home', 'User Management', 'Blackout records'],
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
      identifying: '',
      type: 'all',
      status: 'all',
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
            label="identifying"
            placeholder="Please enter"
            value={filters.identifying}
            onChange={(e) => setFilters((p) => ({ ...p, identifying: e.target.value }))}
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
              <MenuItem value="all">Please select</MenuItem>
              <MenuItem value="Phone number">Phone number</MenuItem>
              <MenuItem value="IP">IP</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <FormControl size="small" fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
            >
              <MenuItem value="all">Please select</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Ended">Ended</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} display="flex" flexWrap="wrap" gap={2} alignItems="center">
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
            Query
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
              <TableCell><strong>User ID</strong></TableCell>
              <TableCell><strong>identifying</strong></TableCell>
              <TableCell><strong>Days</strong></TableCell>
              <TableCell><strong>IP/Device</strong></TableCell>
              <TableCell><strong>Note</strong></TableCell>
              <TableCell><strong>Expiration time</strong></TableCell>
              <TableCell><strong>Operator</strong></TableCell>
              <TableCell><strong>Creation time</strong></TableCell>
              <TableCell><strong>Update Time</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="right"><strong>Operation</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    {row.userNickname} ({row.userId})
                  </TableCell>
                  <TableCell>{row.identifying}</TableCell>
                  <TableCell>{row.days}</TableCell>
                  <TableCell>{row.ipOrDevice}</TableCell>
                  <TableCell>{row.note}</TableCell>
                  <TableCell>{row.expirationTime}</TableCell>
                  <TableCell>{row.operator}</TableCell>
                  <TableCell>{row.creationTime}</TableCell>
                  <TableCell>{row.updateTime}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={row.status === 'Ended' ? 'success' : 'warning'}
                      size="small"
                      variant="filled"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {row.status === 'Active' && (
                      <Button variant="text" size="small" color="primary">
                        Lift Blackout
                      </Button>
                    )}
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
