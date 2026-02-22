'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
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
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Search, Clear, Add } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import type { AgentAccount } from '@/types/agent-recharge';
import { demoAgentAccounts } from '@/lib/demo-data';

export default function AgentAccountManagementPage() {
  const router = useRouter();
  const addTab = useTabsStore((s) => s.addTab);
  const [data] = useState<AgentAccount[]>(demoAgentAccounts);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    id: '',
    userUid: '',
    userNickname: '',
    superiorId: '',
    superiorName: '',
    country: 'All',
    level: 'All',
    valid: 'All',
    registrationStart: '',
    registrationEnd: '',
  });

  useEffect(() => {
    addTab({
      id: '/dashboard/agent-recharge',
      label: 'Agent Account Management',
      path: '/dashboard/agent-recharge',
      breadcrumbs: ['Home', 'Agent Recharge Management', 'Agent Account Management'],
    });
  }, [addTab]);

  const filtered = useMemo(() => {
    let result = [...data];
    if (filters.id.trim()) {
      result = result.filter((r) => String(r.id).includes(filters.id));
    }
    if (filters.userUid.trim()) {
      const k = filters.userUid.toLowerCase();
      result = result.filter((r) => String(r.userId).toLowerCase().includes(k));
    }
    if (filters.userNickname.trim()) {
      const k = filters.userNickname.toLowerCase();
      result = result.filter((r) => r.userNickname.toLowerCase().includes(k));
    }
    if (filters.superiorId.trim()) {
      result = result.filter((r) => String(r.superiorId).includes(filters.superiorId));
    }
    if (filters.superiorName.trim()) {
      const k = filters.superiorName.toLowerCase();
      result = result.filter((r) => r.superiorName.toLowerCase().includes(k));
    }
    if (filters.country && filters.country !== 'All') {
      result = result.filter((r) => r.country === filters.country);
    }
    if (filters.level && filters.level !== 'All') {
      result = result.filter((r) => r.level === filters.level);
    }
    if (filters.valid === 'Yes') {
      result = result.filter((r) => r.status === 'Yes');
    } else if (filters.valid === 'No') {
      result = result.filter((r) => r.status === 'No');
    }
    if (filters.registrationStart) {
      result = result.filter((r) => r.registrationTime >= filters.registrationStart);
    }
    if (filters.registrationEnd) {
      result = result.filter((r) => r.registrationTime <= filters.registrationEnd);
    }
    return result;
  }, [data, filters]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const countries = useMemo(() => Array.from(new Set(data.map((r) => r.country))), [data]);
  const levels = useMemo(() => Array.from(new Set(data.map((r) => r.level))), [data]);

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({
      id: '',
      userUid: '',
      userNickname: '',
      superiorId: '',
      superiorName: '',
      country: 'All',
      level: 'All',
      valid: 'All',
      registrationStart: '',
      registrationEnd: '',
    });
    setPage(0);
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
          <TextField size="small" label="ID" placeholder="ID" value={filters.id} onChange={(e) => setFilters((p) => ({ ...p, id: e.target.value }))} sx={{ minWidth: 100 }} />
          <TextField size="small" label="User UID" placeholder="Please enter user UID" value={filters.userUid} onChange={(e) => setFilters((p) => ({ ...p, userUid: e.target.value }))} sx={{ minWidth: 160 }} />
          <TextField size="small" label="User nickname" placeholder="User nickname" value={filters.userNickname} onChange={(e) => setFilters((p) => ({ ...p, userNickname: e.target.value }))} sx={{ minWidth: 160 }} />
          <TextField size="small" label="Superior ID" placeholder="Superior ID" value={filters.superiorId} onChange={(e) => setFilters((p) => ({ ...p, superiorId: e.target.value }))} sx={{ minWidth: 120 }} />
          <TextField size="small" label="Superior name" placeholder="Superior name" value={filters.superiorName} onChange={(e) => setFilters((p) => ({ ...p, superiorName: e.target.value }))} sx={{ minWidth: 140 }} />
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>country</InputLabel>
            <Select value={filters.country} label="country" onChange={(e) => setFilters((p) => ({ ...p, country: e.target.value }))}>
              <MenuItem value="All">All</MenuItem>
              {countries.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Level</InputLabel>
            <Select value={filters.level} label="Level" onChange={(e) => setFilters((p) => ({ ...p, level: e.target.value }))}>
              <MenuItem value="All">All</MenuItem>
              {levels.map((l) => (
                <MenuItem key={l} value={l}>{l}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 90 }}>
            <InputLabel>Valid</InputLabel>
            <Select value={filters.valid} label="Valid" onChange={(e) => setFilters((p) => ({ ...p, valid: e.target.value }))}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
          <TextField size="small" type="datetime-local" label="Registration time" value={filters.registrationStart} onChange={(e) => setFilters((p) => ({ ...p, registrationStart: e.target.value }))} InputLabelProps={{ shrink: true }} sx={{ minWidth: 180 }} />
          <TextField size="small" type="datetime-local" label="to" value={filters.registrationEnd} onChange={(e) => setFilters((p) => ({ ...p, registrationEnd: e.target.value }))} InputLabelProps={{ shrink: true }} sx={{ minWidth: 180 }} />
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>Query</Button>
          <Button variant="outlined" color="error" startIcon={<Clear />} onClick={handleClear}>Clear conditions</Button>
          <Button variant="contained" component={Link} href="/dashboard/agent-recharge" startIcon={<Add />}>Add</Button>
        </Box>
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>User nickname</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Phone number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Account balance</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total revenue</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Consumption amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Number of buyers</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>country</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Certification</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Platform</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Invitation Code</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Level</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Superior</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Registration time</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Update Time</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Operation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.userNickname}</TableCell>
                  <TableCell>{row.phoneNumber}</TableCell>
                  <TableCell>{row.accountBalance}</TableCell>
                  <TableCell>{row.totalRevenue}</TableCell>
                  <TableCell>{row.consumptionAmount}</TableCell>
                  <TableCell>{row.numberOfBuyers}</TableCell>
                  <TableCell>{row.country}</TableCell>
                  <TableCell>{row.certification}</TableCell>
                  <TableCell>{row.platform}</TableCell>
                  <TableCell>{row.invitationCode}</TableCell>
                  <TableCell>{row.level}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.superiorName}</TableCell>
                  <TableCell>{row.registrationTime}</TableCell>
                  <TableCell>{row.updateTime}</TableCell>
                  <TableCell align="right">
                    <OperationButton
                      items={[
                        { label: 'Edit profile', onClick: () => router.push(`/dashboard/agent-recharge?edit=${row.id}`) },
                        { label: 'Recharge management', onClick: () => router.push('/dashboard/fund/recharge') },
                      ]}
                    />
                  </TableCell>
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
