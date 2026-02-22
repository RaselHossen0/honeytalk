'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTabsStore } from '@/store/tabs';

const CHART_DATA = [
  { date: '2026-01-25', recharge: 1200, withdrawal: 800 },
  { date: '2026-01-26', recharge: 1900, withdrawal: 1200 },
  { date: '2026-01-27', recharge: 1500, withdrawal: 1100 },
  { date: '2026-01-28', recharge: 2100, withdrawal: 1400 },
  { date: '2026-01-29', recharge: 1800, withdrawal: 900 },
  { date: '2026-01-30', recharge: 2400, withdrawal: 1600 },
  { date: '2026-01-31', recharge: 2200, withdrawal: 1300 },
  { date: '2026-02-01', recharge: 2800, withdrawal: 1700 },
  { date: '2026-02-02', recharge: 2500, withdrawal: 1500 },
  { date: '2026-02-03', recharge: 3100, withdrawal: 1900 },
];

export default function StatisticalChartsPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [timeFrom, setTimeFrom] = useState('2026-01-31');
  const [timeTo, setTimeTo] = useState('2026-02-27');
  const [rechargeAmount, setRechargeAmount] = useState(0);
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);

  useEffect(() => {
    addTab({
      id: '/dashboard/fund/statistical/charts',
      label: 'Statistical charts',
      path: '/dashboard/fund/statistical/charts',
      breadcrumbs: ['Home', 'Fund Management', 'Statistical management', 'Statistical charts'],
    });
  }, [addTab]);

  const handleQuery = () => {
    const filtered = CHART_DATA.filter(
      (d) => d.date >= timeFrom && d.date <= timeTo
    );
    setRechargeAmount(
      filtered.reduce((sum, d) => sum + d.recharge, 0)
    );
    setWithdrawalAmount(
      filtered.reduce((sum, d) => sum + d.withdrawal, 0)
    );
  };

  const handleClear = () => {
    setTimeFrom('2026-01-31');
    setTimeTo('2026-02-27');
    setRechargeAmount(0);
    setWithdrawalAmount(0);
  };

  const profit = rechargeAmount - withdrawalAmount;

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
            value={timeFrom}
            onChange={(e) => setTimeFrom(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 160 }}
          />
          <TextField
            size="small"
            type="date"
            value={timeTo}
            onChange={(e) => setTimeTo(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 160 }}
          />
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
            Query
          </Button>
          <Button variant="outlined" color="error" startIcon={<Clear />} onClick={handleClear}>
            Clear conditions
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Recharge amount: {rechargeAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
          Withdrawal amount: {withdrawalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
          Profit: {profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Query recharge and withdrawal statistics
        </Typography>
      </Paper>

      <Paper sx={{ p: 2, borderRadius: 2, minHeight: 400 }}>
        <Box sx={{ width: '100%', height: 380 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CHART_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#64748b" />
              <YAxis label={{ value: 'Values', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 12 }} stroke="#64748b" />
              <Tooltip
                formatter={(value: number) => [value.toLocaleString(), '']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="recharge"
                stackId="1"
                stroke="#4f46e5"
                fill="#6366f1"
                fillOpacity={0.6}
                name="Recharge summary"
              />
              <Area
                type="monotone"
                dataKey="withdrawal"
                stackId="2"
                stroke="#059669"
                fill="#10b981"
                fillOpacity={0.6}
                name="Withdrawal summary"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
}
