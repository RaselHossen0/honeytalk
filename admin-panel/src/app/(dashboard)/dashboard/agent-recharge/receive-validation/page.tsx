'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { ReceiveValidationRecord } from '@/types/bonus-receive';
import { fetchReceiveValidationList, updateReceiveValidationAction } from '@/services/bonus-receive';

export default function ReceiveValidationPage() {
  const searchParams = useSearchParams();
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<ReceiveValidationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    anchorId: '',
    agentId: '',
    receiveFromId: '',
    receiveFromName: '',
  });

  useEffect(() => {
    const anchorId = searchParams.get('anchorId') || '';
    const agentId = searchParams.get('agentId') || '';
    if (anchorId || agentId) {
      setFilters((p) => ({ ...p, anchorId, agentId }));
    }
  }, [searchParams]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const anchorId = filters.anchorId ? parseInt(filters.anchorId, 10) : undefined;
      const agentId = filters.agentId ? parseInt(filters.agentId, 10) : undefined;
      const list = await fetchReceiveValidationList({ anchorId, agentId });
      setData(list);
    } finally {
      setLoading(false);
    }
  }, [filters.anchorId, filters.agentId]);

  useEffect(() => {
    addTab({
      id: '/dashboard/agent-recharge/receive-validation',
      label: 'Receive Validation',
      path: '/dashboard/agent-recharge/receive-validation',
      breadcrumbs: ['Home', 'Agent Recharge Management', 'Receive Validation'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggleAction = async (row: ReceiveValidationRecord, newAction: 'Valid' | 'Invalid') => {
    await updateReceiveValidationAction(row.id, newAction);
    setData((prev) => prev.map((r) => (r.id === row.id ? { ...r, action: newAction } : r)));
  };

  const filtered = useMemo(() => {
    let result = [...data];
    if (filters.receiveFromId) {
      result = result.filter((r) => String(r.receiveFromId).includes(filters.receiveFromId));
    }
    if (filters.receiveFromName) {
      const k = filters.receiveFromName.toLowerCase();
      result = result.filter((r) => r.receiveFromName.toLowerCase().includes(k));
    }
    return result;
  }, [data, filters.receiveFromId, filters.receiveFromName]);

  const { totalValid, totalInvalid } = useMemo(() => {
    let valid = 0;
    let invalid = 0;
    filtered.forEach((r) => {
      if (r.action === 'Valid') valid += r.coin;
      else invalid += r.coin;
    });
    return { totalValid: valid, totalInvalid: invalid };
  }, [filtered]);

  const handleQuery = () => load();
  const handleClear = () => {
    setFilters({
      anchorId: '',
      agentId: '',
      receiveFromId: '',
      receiveFromName: '',
    });
  };

  const handleCoinReturnAgent = () => {
    // TODO: API - initiate coin return to agent
    alert('Coin Return to Agent (API integration ready)');
  };

  const handleCoinReturnAnchor = () => {
    // TODO: API - initiate coin return to anchor
    alert('Coin Return to Anchor (API integration ready)');
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        If found any Invalid
      </Typography>

      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
          <TextField
            size="small"
            label="Anchor ID"
            placeholder="Please enter"
            value={filters.anchorId}
            onChange={(e) => setFilters((p) => ({ ...p, anchorId: e.target.value }))}
            sx={{ minWidth: 120 }}
          />
          <TextField
            size="small"
            label="Agent ID"
            placeholder="Please enter"
            value={filters.agentId}
            onChange={(e) => setFilters((p) => ({ ...p, agentId: e.target.value }))}
            sx={{ minWidth: 120 }}
          />
          <TextField
            size="small"
            label="Recive From ID"
            placeholder="Please enter"
            value={filters.receiveFromId}
            onChange={(e) => setFilters((p) => ({ ...p, receiveFromId: e.target.value }))}
            sx={{ minWidth: 140 }}
          />
          <TextField
            size="small"
            label="Recive From Name"
            placeholder="Please enter"
            value={filters.receiveFromName}
            onChange={(e) => setFilters((p) => ({ ...p, receiveFromName: e.target.value }))}
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
            <TableRow sx={{ bgcolor: 'warning.light' }}>
              <TableCell sx={{ fontWeight: 600 }}>Recive From ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Recive From Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Recive Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Anchor ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Anchor Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Coin</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{
                    bgcolor: row.action === 'Invalid' ? 'rgba(211, 47, 47, 0.08)' : 'rgba(46, 125, 50, 0.08)',
                  }}
                >
                  <TableCell>{row.receiveFromId}</TableCell>
                  <TableCell>{row.receiveFromName}</TableCell>
                  <TableCell>{row.receiveType}</TableCell>
                  <TableCell>{row.anchorId}</TableCell>
                  <TableCell>{row.anchorName}</TableCell>
                  <TableCell align="right">{row.coin.toLocaleString()}</TableCell>
                  <TableCell>
                    <ToggleButtonGroup
                      value={row.action}
                      exclusive
                      size="small"
                      onChange={(_, v) => v != null && handleToggleAction(row, v)}
                      sx={{ '& .MuiToggleButton-root': { py: 0.25, px: 1.5 } }}
                    >
                      <ToggleButton value="Valid">Valid</ToggleButton>
                      <ToggleButton value="Invalid">Invalid</ToggleButton>
                    </ToggleButtonGroup>
                  </TableCell>
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
            gap: 3,
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" fontWeight={600}>
              Total Valid:
            </Typography>
            <Box component="span" sx={{ px: 2, py: 0.5, bgcolor: 'success.main', color: 'white', borderRadius: 1 }}>
              {totalValid.toLocaleString()}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" fontWeight={600}>
              Total Invalid:
            </Typography>
            <Box component="span" sx={{ px: 2, py: 0.5, bgcolor: 'error.main', color: 'white', borderRadius: 1 }}>
              {totalInvalid.toLocaleString()}
            </Box>
          </Box>
          <Box sx={{ flex: 1 }} />
          <Button
            variant="contained"
            onClick={handleCoinReturnAgent}
            sx={{ bgcolor: 'grey.600', '&:hover': { bgcolor: 'grey.700' } }}
          >
            Coin Return to Agent
          </Button>
          <Button variant="contained" color="warning" onClick={handleCoinReturnAnchor}>
            Coin Return to Anchor
          </Button>
        </Box>
      </TableContainer>
    </Box>
  );
}