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
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import type { GuardianPriceConfig } from '@/types/guardian';
import { demoGuardianPriceConfigs, demoGuardianCategories } from '@/lib/demo-data';

export default function GuardianPriceConfigPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<GuardianPriceConfig[]>(demoGuardianPriceConfigs);
  const [selected, setSelected] = useState<number[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<GuardianPriceConfig | null>(null);
  const [form, setForm] = useState({
    guardianTypeName: '',
    guardianDays: 7,
    consumptionAmount: 0,
    guardianCategory: '',
    sort: 0,
  });

  const categories = demoGuardianCategories.map((c) => c.name);

  useEffect(() => {
    addTab({
      id: '/dashboard/guardian/price-configs',
      label: 'Purchase price configuration',
      path: '/dashboard/guardian/price-configs',
      breadcrumbs: ['Home', 'Prop Management', 'Guardian Management', 'Purchase price configuration'],
    });
  }, [addTab]);

  const handleAdd = () => {
    setEditing(null);
    setForm({ guardianTypeName: '', guardianDays: 7, consumptionAmount: 0, guardianCategory: categories[0] || 'Silver', sort: 0 });
    setEditOpen(true);
  };

  const handleEdit = (row: GuardianPriceConfig) => {
    setEditing(row);
    setForm({
      guardianTypeName: row.guardianTypeName,
      guardianDays: row.guardianDays,
      consumptionAmount: row.consumptionAmount,
      guardianCategory: row.guardianCategory,
      sort: row.sort,
    });
    setEditOpen(true);
  };

  const handleDelete = (row: GuardianPriceConfig) => {
    if (confirm(`Delete "${row.guardianTypeName}"?`)) {
      setData((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    if (confirm(`Delete ${selected.length} config(s)?`)) {
      setData((prev) => prev.filter((r) => !selected.includes(r.id)));
      setSelected([]);
    }
  };

  const handleSave = () => {
    if (editing) {
      setData((prev) =>
        prev.map((r) =>
          r.id === editing.id
            ? {
                ...r,
                guardianTypeName: form.guardianTypeName,
                guardianDays: form.guardianDays,
                consumptionAmount: form.consumptionAmount,
                guardianCategory: form.guardianCategory,
                sort: form.sort,
              }
            : r
        )
      );
    } else {
      const nextId = Math.max(...data.map((r) => r.id), 0) + 1;
      const nextNum = Math.max(...data.map((r) => r.number), 0) + 1;
      setData((prev) => [
        ...prev,
        {
          id: nextId,
          number: nextNum,
          guardianTypeName: form.guardianTypeName,
          guardianDays: form.guardianDays,
          consumptionAmount: form.consumptionAmount,
          guardianCategory: form.guardianCategory,
          sort: form.sort,
        },
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
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Add
        </Button>
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
              <TableCell sx={{ fontWeight: 600 }}>Guardian Type Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Guardian Days</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Consumption amount</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Guardian Category</TableCell>
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
                <TableCell>{row.guardianTypeName}</TableCell>
                <TableCell>{row.guardianDays}</TableCell>
                <TableCell>{row.consumptionAmount}</TableCell>
                <TableCell>{row.guardianCategory}</TableCell>
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
        {selected.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleBulkDelete}>
              Delete
            </Button>
          </Box>
        )}
      </TableContainer>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit' : 'Add'} Purchase price configuration</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="Guardian Type Name" value={form.guardianTypeName} onChange={(e) => setForm((f) => ({ ...f, guardianTypeName: e.target.value }))} fullWidth required />
          <TextField label="Guardian Days" type="number" value={form.guardianDays} onChange={(e) => setForm((f) => ({ ...f, guardianDays: parseInt(e.target.value, 10) || 0 }))} fullWidth />
          <TextField label="Consumption amount" type="number" value={form.consumptionAmount} onChange={(e) => setForm((f) => ({ ...f, consumptionAmount: parseInt(e.target.value, 10) || 0 }))} fullWidth />
          <FormControl fullWidth>
            <InputLabel>Guardian Category</InputLabel>
            <Select value={form.guardianCategory} label="Guardian Category" onChange={(e) => setForm((f) => ({ ...f, guardianCategory: e.target.value }))}>
              {categories.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
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
