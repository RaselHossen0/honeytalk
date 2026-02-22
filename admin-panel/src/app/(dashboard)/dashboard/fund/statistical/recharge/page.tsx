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
  Typography,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import { demoRechargeStatistics } from '@/lib/demo-data';

export default function RechargeStatisticsPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [filters, setFilters] = useState({
    timeFrom: '',
    timeTo: '',
    userId: '',
    userNickname: '',
  });

  useEffect(() => {
    addTab({
      id: '/dashboard/fund/statistical/recharge',
      label: 'Recharge Statistics',
      path: '/dashboard/fund/statistical/recharge',
      breadcrumbs: ['Home', 'Fund Management', 'Statistical management', 'Recharge Statistics'],
    });
  }, [addTab]);

  const filtered = useMemo(() => {
    let result = [...demoRechargeStatistics];
    if (filters.userId.trim()) {
      const k = filters.userId.trim();
      result = result.filter((r) => String(r.userId).includes(k));
    }
    if (filters.userNickname.trim()) {
      const k = filters.userNickname.toLowerCase().trim();
      result = result.filter((r) => r.userNickname.toLowerCase().includes(k));
    }
    if (filters.timeFrom) {
      result = result.filter((r) => r.lastRechargeTime >= filters.timeFrom);
    }
    if (filters.timeTo) {
      result = result.filter(
        (r) => r.lastRechargeTime <= filters.timeTo + ' 23:59:59'
      );
    }
    return result;
  }, [filters]);

  const totalAmount = filtered.reduce((sum, r) => sum + r.amount, 0);

  const handleClear = () => {
    setFilters({ timeFrom: '', timeTo: '', userId: '', userNickname: '' });
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
          <Typography component="span" sx={{ fontWeight: 600, alignSelf: 'center' }}>
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
          <TextField
            size="small"
            label="User ID"
            placeholder="Please enter user ID"
            value={filters.userId}
            onChange={(e) => setFilters((p) => ({ ...p, userId: e.target.value }))}
            sx={{ minWidth: 140 }}
          />
          <TextField
            size="small"
            label="User nickname"
            placeholder="Please enter nickname"
            value={filters.userNickname}
            onChange={(e) => setFilters((p) => ({ ...p, userNickname: e.target.value }))}
            sx={{ minWidth: 160 }}
          />
          <Button variant="contained" startIcon={<Search />} onClick={() => {}}>
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
                <TableCell sx={{ fontWeight: 600 }}>Last recharge time</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Whether paid</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.userId}</TableCell>
                  <TableCell>{row.userNickname}</TableCell>
                  <TableCell>
                    {row.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>{row.lastRechargeTime}</TableCell>
                  <TableCell>{row.whetherPaid}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2">
            Total number of recharges: {filtered.length} | Total amount of recharges:{' '}
            {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
