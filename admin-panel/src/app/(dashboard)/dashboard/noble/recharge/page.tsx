'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import type { NobleRecharge } from '@/types/noble';
import { demoNobleRecharge } from '@/lib/demo-data';

const TIME_OPTIONS = ['7Days', '1Month', '2Month', '3Month', '6Month', '1Year'];

export default function NobleRechargePage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<NobleRecharge[]>(demoNobleRecharge);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<NobleRecharge | null>(null);
  const [form, setForm] = useState({ amount: 0, time: '7Days', name: '', sort: 0, status: 'Valid' });

  useEffect(() => {
    addTab({
      id: '/dashboard/noble/recharge',
      label: 'Noble recharge',
      path: '/dashboard/noble/recharge',
      breadcrumbs: ['Home', 'Prop management', 'Noble Management', 'Noble recharge'],
    });
  }, [addTab]);

  const handleAdd = () => {
    setEditing(null);
    setForm({ amount: 1000, time: '7Days', name: '', sort: 0, status: 'Valid' });
    setEditOpen(true);
  };

  const handleEdit = (row: NobleRecharge) => {
    setEditing(row);
    setForm({ amount: row.amount, time: row.time, name: row.name, sort: row.sort, status: row.status });
    setEditOpen(true);
  };

  const handleDelete = (row: NobleRecharge) => {
    if (confirm(`Delete "${row.name}"?`)) {
      setData((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  const handleSave = () => {
    if (editing) {
      setData((prev) =>
        prev.map((r) =>
          r.id === editing.id
            ? { ...r, amount: form.amount, time: form.time, name: form.name, sort: form.sort, status: form.status }
            : r
        )
      );
    } else {
      const nextId = Math.max(...data.map((r) => r.id), 0) + 1;
      const nextNum = Math.max(...data.map((r) => r.number), 0) + 1;
      setData((prev) => [
        ...prev,
        { id: nextId, number: nextNum, amount: form.amount, time: form.time, name: form.name, sort: form.sort, status: form.status },
      ]);
    }
    setEditOpen(false);
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Add
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sort</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                Operation
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                <TableCell>{row.number}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.time}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.sort}</TableCell>
                <TableCell sx={{ color: 'primary.main', fontWeight: 500 }}>{row.status}</TableCell>
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
        <DialogTitle>{editing ? 'Edit' : 'Add'} Noble recharge</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="Amount" type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: parseInt(e.target.value, 10) || 0 }))} fullWidth required />
          <FormControl fullWidth>
            <InputLabel>Time</InputLabel>
            <Select value={form.time} label="Time" onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}>
              {TIME_OPTIONS.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} fullWidth required placeholder="e.g. Emperor, Knight" />
          <TextField label="Sort" type="number" value={form.sort} onChange={(e) => setForm((f) => ({ ...f, sort: parseInt(e.target.value, 10) || 0 }))} fullWidth />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={form.status} label="Status" onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
              <MenuItem value="Valid">Valid</MenuItem>
              <MenuItem value="Invalid">Invalid</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
