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
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { AgentSalesRecord } from '@/types/agent-recharge';
import { demoAgentSalesRecords } from '@/lib/demo-data';

export default function SalesRecordsPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data] = useState<AgentSalesRecord[]>(demoAgentSalesRecords);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    agentId: 'All',
    userId: '',
    dateStart: '',
    dateEnd: '',
  });

  useEffect(() => {
    addTab({
      id: '/dashboard/agent-recharge/sales',
      label: 'Sales records',
      path: '/dashboard/agent-recharge/sales',
      breadcrumbs: ['Home', 'Agent Recharge Management', 'Sales records'],
    });
  }, [addTab]);

  const filtered = useMemo(() => {
    let result = [...data];
    if (filters.agentId && filters.agentId !== 'All') {
      result = result.filter((r) => String(r.agentId) === filters.agentId);
    }
    if (filters.userId.trim()) {
      const k = filters.userId.toLowerCase();
      result = result.filter((r) => r.userNickname.toLowerCase().includes(k));
    }
    if (filters.dateStart) {
      result = result.filter((r) => r.registrationTime >= filters.dateStart);
    }
    if (filters.dateEnd) {
      result = result.filter((r) => r.registrationTime <= filters.dateEnd);
    }
    return result;
  }, [data, filters]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const rechargeStatistics = useMemo(() => filtered.length, [filtered]);
  const agentIds = useMemo(() => Array.from(new Set(data.map((r) => r.agentId))), [data]);

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({ agentId: 'All', userId: '', dateStart: '', dateEnd: '' });
    setPage(0);
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Agent Account Management ID</InputLabel>
            <Select value={filters.agentId} label="Agent Account Management ID" onChange={(e) => setFilters((p) => ({ ...p, agentId: e.target.value }))}>
              <MenuItem value="All">All</MenuItem>
              {agentIds.map((id) => (
                <MenuItem key={id} value={id}>{id}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField size="small" label="User ID" placeholder="Please enter User ID" value={filters.userId} onChange={(e) => setFilters((p) => ({ ...p, userId: e.target.value }))} sx={{ minWidth: 160 }} />
          <TextField size="small" type="datetime-local" label="Date" value={filters.dateStart} onChange={(e) => setFilters((p) => ({ ...p, dateStart: e.target.value }))} InputLabelProps={{ shrink: true }} sx={{ minWidth: 180 }} />
          <TextField size="small" type="datetime-local" label="to" value={filters.dateEnd} onChange={(e) => setFilters((p) => ({ ...p, dateEnd: e.target.value }))} InputLabelProps={{ shrink: true }} sx={{ minWidth: 180 }} />
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>Query</Button>
          <Button variant="outlined" color="error" startIcon={<Clear />} onClick={handleClear}>Clear conditions</Button>
          <Button variant="outlined">Export</Button>
          <Box sx={{ ml: 'auto', alignSelf: 'center' }}>
            Recharge Statistics: {rechargeStatistics}
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>User nickname</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Agent Account Management</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Receiving account</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Account balance</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Note</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Registration time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.userNickname}</TableCell>
                  <TableCell>{row.agentName}</TableCell>
                  <TableCell>{row.receivingAccount}</TableCell>
                  <TableCell>{row.accountBalance}</TableCell>
                  <TableCell>{row.note}</TableCell>
                  <TableCell>{row.registrationTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[10, 25, 50]}
          labelRowsPerPage="per page"
          labelDisplayedRows={({ from, to, count }) => `Total ${count}`}
        />
      </Paper>
    </Box>
  );
}
