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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
} from '@mui/material';
import { Search, Clear, Add } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { ManualRechargeRecord } from '@/types/fund';
import { demoManualRechargeRecords } from '@/lib/demo-data';

const VIRTUAL_CURRENCY_OPTIONS = ['All', 'Coin', 'Diamond'];
const TYPE_OPTIONS = ['All', 'Add', 'Reduce'];

export default function ManualRechargePage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<ManualRechargeRecord[]>(demoManualRechargeRecords);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    userId: '',
    numberOfChanges: '',
    virtualCurrency: 'Diamond' as 'Coin' | 'Diamond',
    type: 'Add' as 'Add' | 'Reduce',
    accountLog: '',
  });
  const [filters, setFilters] = useState({
    userId: '',
    virtualCurrency: 'All',
    type: 'All',
    addTimeStart: '',
    addTimeEnd: '',
  });

  useEffect(() => {
    addTab({
      id: '/dashboard/fund/manual-recharge',
      label: 'Manual recharge',
      path: '/dashboard/fund/manual-recharge',
      breadcrumbs: ['Home', 'Fund Management', 'Manual recharge'],
    });
  }, [addTab]);

  const filtered = useMemo(() => {
    let result = [...data];
    if (filters.userId.trim()) {
      result = result.filter((r) => String(r.userId).includes(filters.userId));
    }
    if (filters.virtualCurrency !== 'All') {
      result = result.filter((r) => r.numberOfChanges.includes(filters.virtualCurrency));
    }
    if (filters.type !== 'All') {
      result = result.filter((r) =>
        filters.type === 'Add' ? r.numberOfChanges.startsWith('+') : r.numberOfChanges.startsWith('-')
      );
    }
    if (filters.addTimeStart) {
      result = result.filter((r) => r.addTime >= filters.addTimeStart);
    }
    if (filters.addTimeEnd) {
      result = result.filter((r) => r.addTime <= filters.addTimeEnd + ' 23:59:59');
    }
    return result;
  }, [data, filters]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const totalAmount = useMemo(
    () => filtered.reduce((sum, r) => sum + r.changeAmount, 0),
    [filtered]
  );

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({ userId: '', virtualCurrency: 'All', type: 'All', addTimeStart: '', addTimeEnd: '' });
    setPage(0);
  };

  const handleAdd = () => {
    setAddForm({
      userId: '',
      numberOfChanges: '',
      virtualCurrency: 'Diamond',
      type: 'Add',
      accountLog: '',
    });
    setAddOpen(true);
  };
  const handleAddClose = () => setAddOpen(false);
  const handleAddSubmit = () => {
    const userId = parseInt(addForm.userId, 10);
    const amount = Math.abs(parseInt(addForm.numberOfChanges, 10) || 0);
    if (!userId || !amount) return;
    const nextNum = Math.max(...data.map((r) => r.number), 0) + 1;
    const prefix = addForm.type === 'Add' ? '+ ' : '- ';
    const currency = addForm.virtualCurrency;
    const newRecord: ManualRechargeRecord = {
      id: Math.max(...data.map((r) => r.id), 0) + 1,
      number: nextNum,
      userId,
      userNickname: `User${userId} (${userId})`,
      numberOfChanges: `${prefix}${amount.toLocaleString()} ${currency}`,
      changeAmount: addForm.type === 'Add' ? amount : -amount,
      accountBalance: `${amount.toLocaleString()} ${currency}`,
      accountLog: addForm.accountLog || '-',
      ip: '-',
      operator: 'admin (1)',
      addTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };
    setData((prev) => [newRecord, ...prev]);
    setAddOpen(false);
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
          <TextField
            size="small"
            label="User ID"
            placeholder="Please enter user ID"
            value={filters.userId}
            onChange={(e) => setFilters((p) => ({ ...p, userId: e.target.value }))}
            sx={{ minWidth: 160 }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Virtual Currency</InputLabel>
            <Select
              value={filters.virtualCurrency}
              label="Virtual Currency"
              onChange={(e) => setFilters((p) => ({ ...p, virtualCurrency: e.target.value }))}
            >
              {VIRTUAL_CURRENCY_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={filters.type}
              label="Type"
              onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}
            >
              {TYPE_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            size="small"
            type="datetime-local"
            label="Add Time"
            placeholder="Start Time"
            value={filters.addTimeStart}
            onChange={(e) => setFilters((p) => ({ ...p, addTimeStart: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 180 }}
          />
          <TextField
            size="small"
            type="datetime-local"
            label="End Time"
            value={filters.addTimeEnd}
            onChange={(e) => setFilters((p) => ({ ...p, addTimeEnd: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 180 }}
          />
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
            Query
          </Button>
          <Button variant="outlined" color="error" startIcon={<Clear />} onClick={handleClear}>
            Clear conditions
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
            Add
          </Button>
        </Box>
      </Paper>

      <Box sx={{ mb: 2, fontSize: 14, color: 'text.secondary' }}>
        Total amount of recharges: {totalAmount.toLocaleString()}
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>User nickname</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Number of Changes</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Account balance</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Account Log</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>IP</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Operator</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Add Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.userNickname}</TableCell>
                  <TableCell>{row.numberOfChanges}</TableCell>
                  <TableCell>{row.accountBalance}</TableCell>
                  <TableCell>{row.accountLog}</TableCell>
                  <TableCell>{row.ip}</TableCell>
                  <TableCell>{row.operator}</TableCell>
                  <TableCell>{row.addTime}</TableCell>
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

      <Dialog open={addOpen} onClose={handleAddClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="User ID" type="number" value={addForm.userId} onChange={(e) => setAddForm((f) => ({ ...f, userId: e.target.value }))} placeholder="Please enter user ID" fullWidth required />
          <TextField label="Number of Changes" type="number" value={addForm.numberOfChanges} onChange={(e) => setAddForm((f) => ({ ...f, numberOfChanges: e.target.value }))} placeholder="Amount" fullWidth required />
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Virtual Currency</Typography>
            <ToggleButtonGroup value={addForm.virtualCurrency} exclusive onChange={(_, v) => v != null && setAddForm((f) => ({ ...f, virtualCurrency: v }))} size="small">
              <ToggleButton value="Coin">Coin</ToggleButton>
              <ToggleButton value="Diamond">Diamond</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Type</Typography>
            <ToggleButtonGroup value={addForm.type} exclusive onChange={(_, v) => v != null && setAddForm((f) => ({ ...f, type: v }))} size="small">
              <ToggleButton value="Add">Add</ToggleButton>
              <ToggleButton value="Reduce">Reduce</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <TextField label="Account Log" value={addForm.accountLog} onChange={(e) => setAddForm((f) => ({ ...f, accountLog: e.target.value }))} placeholder="Account log" fullWidth />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleAddSubmit}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
