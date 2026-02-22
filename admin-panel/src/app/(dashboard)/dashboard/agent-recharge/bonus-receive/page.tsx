'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
  Link,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { BonusReceiveRecord } from '@/types/bonus-receive';
import { fetchBonusReceiveList } from '@/services/bonus-receive';

export default function BonusReceivePage() {
  const router = useRouter();
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<BonusReceiveRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    anchorId: '',
    anchorName: '',
    agentId: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchBonusReceiveList();
      setData(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    addTab({
      id: '/dashboard/agent-recharge/bonus-receive',
      label: 'Bonus Receive',
      path: '/dashboard/agent-recharge/bonus-receive',
      breadcrumbs: ['Home', 'Agent Recharge Management', 'Bonus Receive'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleReview = (row: BonusReceiveRecord) => {
    router.push(
      `/dashboard/agent-recharge/receive-validation?anchorId=${row.anchorId}&agentId=${row.agentId}`
    );
  };

  const filtered = data.filter((row) => {
    if (filters.anchorId && !String(row.anchorId).includes(filters.anchorId)) return false;
    if (filters.anchorName && !row.anchorName.toLowerCase().includes(filters.anchorName.toLowerCase())) return false;
    if (filters.agentId && !String(row.agentId).includes(filters.agentId)) return false;
    return true;
  });

  const handleQuery = () => load();
  const handleClear = () => {
    setFilters({ anchorId: '', anchorName: '', agentId: '' });
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
          <TextField
            size="small"
            label="Anchor ID"
            placeholder="Please enter"
            value={filters.anchorId}
            onChange={(e) => setFilters((p) => ({ ...p, anchorId: e.target.value }))}
            sx={{ minWidth: 140 }}
          />
          <TextField
            size="small"
            label="Anchor Name"
            placeholder="Please enter"
            value={filters.anchorName}
            onChange={(e) => setFilters((p) => ({ ...p, anchorName: e.target.value }))}
            sx={{ minWidth: 140 }}
          />
          <TextField
            size="small"
            label="Agent ID"
            placeholder="Please enter"
            value={filters.agentId}
            onChange={(e) => setFilters((p) => ({ ...p, agentId: e.target.value }))}
            sx={{ minWidth: 140 }}
          />
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
            Query
          </Button>
          <Button variant="outlined" color="error" startIcon={<Clear />} onClick={handleClear}>
            Clear conditions
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600 }}>Anchor ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Anchor Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Agent ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Coin</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
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
              filtered.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell>{row.anchorId}</TableCell>
                  <TableCell>{row.anchorName}</TableCell>
                  <TableCell>{row.agentId}</TableCell>
                  <TableCell align="right">{row.coin.toLocaleString()}</TableCell>
                  <TableCell>
                    <Link
                      component="button"
                      variant="body2"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleReview(row)}
                    >
                      Review
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
