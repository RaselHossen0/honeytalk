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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add, Edit, Delete, Search, Clear } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import type { Bank } from '@/types/fund';
import { demoBanks } from '@/lib/demo-data';

export default function BankListPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<Bank[]>(demoBanks);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Bank | null>(null);
  const [form, setForm] = useState({ bankName: '', bankAbbreviation: '', bankCode: '', status: 'Unban', sort: 0 });
  const [filters, setFilters] = useState({ name: '', status: 'All' });

  useEffect(() => {
    addTab({
      id: '/dashboard/fund/bank-list',
      label: 'Bank List',
      path: '/dashboard/fund/bank-list',
      breadcrumbs: ['Home', 'Fund Management', 'Bank List'],
    });
  }, [addTab]);

  const filtered = useMemo(() => {
    let result = [...data];
    if (filters.name.trim()) {
      const k = filters.name.toLowerCase();
      result = result.filter((r) => r.bankName.toLowerCase().includes(k) || r.bankAbbreviation.toLowerCase().includes(k));
    }
    if (filters.status && filters.status !== 'All') {
      result = result.filter((r) => r.status === filters.status);
    }
    return result;
  }, [data, filters]);

  const handleAdd = () => {
    setEditing(null);
    setForm({ bankName: '', bankAbbreviation: '', bankCode: '', status: 'Unban', sort: 0 });
    setEditOpen(true);
  };

  const handleEdit = (row: Bank) => {
    setEditing(row);
    setForm({ bankName: row.bankName, bankAbbreviation: row.bankAbbreviation, bankCode: row.bankCode, status: row.status, sort: row.sort });
    setEditOpen(true);
  };

  const handleDelete = (row: Bank) => {
    if (confirm(`Delete "${row.bankName}"?`)) {
      setData((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  const handleSave = () => {
    if (editing) {
      setData((prev) =>
        prev.map((r) =>
          r.id === editing.id
            ? { ...r, bankName: form.bankName, bankAbbreviation: form.bankAbbreviation, bankCode: form.bankCode, status: form.status, sort: form.sort }
            : r
        )
      );
    } else {
      const nextId = Math.max(...data.map((r) => r.id), 0) + 1;
      const nextNum = Math.max(...data.map((r) => r.number), 0) + 1;
      setData((prev) => [
        ...prev,
        { id: nextId, number: nextNum, bankName: form.bankName, bankAbbreviation: form.bankAbbreviation, bankCode: form.bankCode, status: form.status, sort: form.sort, addTime: new Date().toISOString().slice(0, 19).replace('T', ' ') },
      ]);
    }
    setEditOpen(false);
  };

  const handleQuery = () => {};
  const handleClear = () => setFilters({ name: '', status: 'All' });

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
          <TextField size="small" label="Name" placeholder="Name" value={filters.name} onChange={(e) => setFilters((p) => ({ ...p, name: e.target.value }))} sx={{ minWidth: 180 }} />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select value={filters.status} label="Status" onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Unban">Unban</MenuItem>
              <MenuItem value="Ban">Ban</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>Query</Button>
          <Button variant="outlined" color="error" startIcon={<Clear />} onClick={handleClear}>Clear conditions</Button>
          <Button variant="contained" startIcon={<Add />} onClick={handleAdd} sx={{ ml: 1 }}>Add</Button>
        </Box>
      </Paper>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Bank Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Bank abbreviation</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Bank code</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sort</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Add Time</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((row) => (
              <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                <TableCell>{row.number}</TableCell>
                <TableCell>{row.bankName}</TableCell>
                <TableCell>{row.bankAbbreviation}</TableCell>
                <TableCell>{row.bankCode}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.sort}</TableCell>
                <TableCell>{row.addTime}</TableCell>
                <TableCell align="right" sx={{ width: 56 }}>
                  <OperationButton
                    items={[{ label: 'Edit', onClick: () => handleEdit(row), icon: <Edit fontSize="small" /> }]}
                    dangerItems={[{ label: 'Delete', onClick: () => handleDelete(row), icon: <Delete fontSize="small" /> }]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit' : 'Add'} Bank</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="Bank Name" value={form.bankName} onChange={(e) => setForm((f) => ({ ...f, bankName: e.target.value }))} fullWidth required />
          <TextField label="Bank abbreviation" value={form.bankAbbreviation} onChange={(e) => setForm((f) => ({ ...f, bankAbbreviation: e.target.value }))} fullWidth />
          <TextField label="Bank code" value={form.bankCode} onChange={(e) => setForm((f) => ({ ...f, bankCode: e.target.value }))} fullWidth />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={form.status} label="Status" onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
              <MenuItem value="Unban">Unban</MenuItem>
              <MenuItem value="Ban">Ban</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Sort" type="number" value={form.sort} onChange={(e) => setForm((f) => ({ ...f, sort: parseInt(e.target.value, 10) || 0 }))} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
