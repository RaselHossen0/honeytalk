'use client';

import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import {
  People,
  AccountBalance,
  TrendingUp,
  Money,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography color="text.secondary" variant="body2">
            {title}
          </Typography>
          <Typography variant="h5">{value}</Typography>
        </Box>
        <Box sx={{ color: 'primary.main' }}>{icon}</Box>
      </Box>
    </CardContent>
  </Card>
);

const COMMISSION_DATA = [
  { name: 'Host', value: 60, color: '#9c27b0' },
  { name: 'Agency', value: 25, color: '#1976d2' },
  { name: 'Platform', value: 15, color: '#2e7d32' },
];

export default function DashboardPage() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Agency Dashboard
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Hosts" value="—" icon={<People />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Commission" value="—" icon={<AccountBalance />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="This Month" value="—" icon={<TrendingUp />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pending Payout" value="—" icon={<Money />} />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Commission Split
              </Typography>
              <Box sx={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={COMMISSION_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {COMMISSION_DATA.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Add new hosts, view commission reports, manage sub-agencies.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
