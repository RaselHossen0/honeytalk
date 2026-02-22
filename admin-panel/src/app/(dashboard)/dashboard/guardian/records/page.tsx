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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { GuardianRecord } from '@/types/guardian';
import { demoGuardianRecords } from '@/lib/demo-data';

export default function GuardianRecordPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data] = useState<GuardianRecord[]>(demoGuardianRecords);
  const [filters, setFilters] = useState({ anchorId: '', userId: '', status: 'All' });

  useEffect(() => {
    addTab({
      id: '/dashboard/guardian/records',
      label: 'Guardian Record',
      path: '/dashboard/guardian/records',
      breadcrumbs: ['Home', 'Prop Management', 'Guardian Management', 'Guardian Record'],
    });
  }, [addTab]);

  const filtered = useMemo(() => {
    let result = [...data];
    if (filters.anchorId.trim()) {
      const k = filters.anchorId.trim();
      result = result.filter((r) => String(r.anchorId).includes(k));
    }
    if (filters.userId.trim()) {
      const k = filters.userId.trim();
      result = result.filter((r) => String(r.userId).includes(k));
    }
    if (filters.status && filters.status !== 'All') {
      result = result.filter((r) => r.status === filters.status);
    }
    return result;
  }, [data, filters]);

  const handleQuery = () => {
    // Filters are applied in useMemo; this could trigger a refetch in real API
  };

  const handleClear = () => {
    setFilters({ anchorId: '', userId: '', status: 'All' });
  };

  return (
    <Box>
      <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            label="Anchor ID"
            placeholder="Please enter anchor ID"
            value={filters.anchorId}
            onChange={(e) => setFilters((f) => ({ ...f, anchorId: e.target.value }))}
            sx={{ minWidth: 180 }}
          />
          <TextField
            size="small"
            label="User ID"
            placeholder="Please enter user ID"
            value={filters.userId}
            onChange={(e) => setFilters((f) => ({ ...f, userId: e.target.value }))}
            sx={{ minWidth: 180 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Success">Success</MenuItem>
              <MenuItem value="Failure">Failure</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
            Q Query
          </Button>
          <Button variant="outlined" color="error" startIcon={<Clear />} onClick={handleClear}>
            Clear conditions
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Guardian Type Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Days Guarded</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Consumption amount</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Anchor Nickname</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Start Time</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>End Time</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((row) => (
              <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                <TableCell>{row.number}</TableCell>
                <TableCell>{row.userNickname}</TableCell>
                <TableCell>{row.guardianTypeName}</TableCell>
                <TableCell>{row.daysGuarded}</TableCell>
                <TableCell>{row.consumptionAmount}</TableCell>
                <TableCell>{row.anchorNickname}</TableCell>
                <TableCell>{row.startTime}</TableCell>
                <TableCell>{row.endTime}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
