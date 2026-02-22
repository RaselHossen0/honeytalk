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
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import type { PaymentInterface } from '@/types/fund';
import { demoPaymentInterfaces } from '@/lib/demo-data';

export default function PaymentInterfacePage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<PaymentInterface[]>(demoPaymentInterfaces);
  const [selected, setSelected] = useState<number[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<PaymentInterface | null>(null);
  const [form, setForm] = useState({ name: '', status: 'Valid', automaticWithdrawal: 'No' as 'Yes' | 'No', sort: 0 });

  useEffect(() => {
    addTab({
      id: '/dashboard/fund/payment-interface',
      label: 'Payment interface',
      path: '/dashboard/fund/payment-interface',
      breadcrumbs: ['Home', 'Fund Management', 'Payment interface'],
    });
  }, [addTab]);

  const handleAdd = () => {
    setEditing(null);
    setForm({ name: '', status: 'Valid', automaticWithdrawal: 'No', sort: 0 });
    setEditOpen(true);
  };

  const handleEdit = (row: PaymentInterface) => {
    setEditing(row);
    setForm({ name: row.name, status: row.status, automaticWithdrawal: row.automaticWithdrawal, sort: row.sort });
    setEditOpen(true);
  };

  const handleDelete = (row: PaymentInterface) => {
    if (confirm(`Delete "${row.name}"?`)) {
      setData((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    if (confirm(`Delete ${selected.length} interface(s)?`)) {
      setData((prev) => prev.filter((r) => !selected.includes(r.id)));
      setSelected([]);
    }
  };

  const handleSave = () => {
    if (editing) {
      setData((prev) =>
        prev.map((r) =>
          r.id === editing.id
            ? { ...r, name: form.name, status: form.status, automaticWithdrawal: form.automaticWithdrawal, sort: form.sort }
            : r
        )
      );
    } else {
      const nextId = Math.max(...data.map((r) => r.id), 0) + 1;
      const nextNum = Math.max(...data.map((r) => r.number), 0) + 1;
      setData((prev) => [
        ...prev,
        { id: nextId, number: nextNum, name: form.name, status: form.status, receivedPayment: 0, automaticWithdrawal: form.automaticWithdrawal, sort: form.sort },
      ]);
    }
    setEditOpen(false);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelected(data.map((r) => r.id));
    else setSelected([]);
  };

  const handleSelectOne = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          + Add
        </Button>
        {selected.length > 0 && (
          <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleBulkDelete}>
            Delete
          </Button>
        )}
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < data.length}
                  checked={data.length > 0 && selected.length === data.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Payment Interface Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Received Payment</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Automatic withdrawal payment account</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sort</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                Operation
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                <TableCell padding="checkbox">
                  <Checkbox checked={selected.includes(row.id)} onChange={() => handleSelectOne(row.id)} />
                </TableCell>
                <TableCell>{row.number}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell sx={{ color: row.status === 'Valid' ? 'primary.main' : 'text.secondary' }}>{row.status}</TableCell>
                <TableCell>
                  {row.receivedPayment.toFixed(2)}{' '}
                  <Link component="button" sx={{ cursor: 'pointer' }} onClick={() => alert(`View payment details for ${row.name}`)}>
                    View
                  </Link>
                </TableCell>
                <TableCell>{row.automaticWithdrawal}</TableCell>
                <TableCell>{row.sort}</TableCell>
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
        <DialogTitle>{editing ? 'Edit' : 'Add'} Payment interface</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="Payment Interface Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} fullWidth required />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={form.status} label="Status" onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
              <MenuItem value="Valid">Valid</MenuItem>
              <MenuItem value="Invalid">Invalid</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Automatic withdrawal payment account</InputLabel>
            <Select value={form.automaticWithdrawal} label="Automatic withdrawal payment account" onChange={(e) => setForm((f) => ({ ...f, automaticWithdrawal: e.target.value as 'Yes' | 'No' }))}>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Sort" type="number" value={form.sort} onChange={(e) => setForm((f) => ({ ...f, sort: parseInt(e.target.value, 10) || 0 }))} fullWidth />
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
