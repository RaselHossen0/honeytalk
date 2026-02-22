'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import type { VerifiedNameItem } from '@/types/certification';
import { fetchVerifiedNames, deleteVerifiedName, updateVerifiedName, createVerifiedName } from '@/services/certification';

export default function VerifiedNameListPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<VerifiedNameItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState<'add' | 'edit' | null>(null);
  const [editingItem, setEditingItem] = useState<VerifiedNameItem | null>(null);
  const [form, setForm] = useState({ name: '', sort: 0 });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchVerifiedNames();
      setData(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    addTab({
      id: '/dashboard/users/certification/verified-names',
      label: 'Verified Name List',
      path: '/dashboard/users/certification/verified-names',
      breadcrumbs: ['Home', 'User Management', 'Certification Management', 'Verified Name List'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected(data.map((r) => r.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this item?')) return;
    await deleteVerifiedName(id);
    setData((prev) => prev.filter((r) => r.id !== id));
    setSelected((prev) => prev.filter((x) => x !== id));
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0 || !confirm(`Delete ${selected.length} selected item(s)?`)) return;
    await Promise.all(selected.map((id) => deleteVerifiedName(id)));
    setData((prev) => prev.filter((r) => !selected.includes(r.id)));
    setSelected([]);
  };

  const handleEdit = (row: VerifiedNameItem) => {
    setEditingItem(row);
    setForm({ name: row.name, sort: row.sort });
    setModalOpen('edit');
  };

  const handleAdd = () => {
    setEditingItem(null);
    setForm({ name: '', sort: data.length > 0 ? Math.max(...data.map((r) => r.sort)) + 1 : 1 });
    setModalOpen('add');
  };

  const handleCloseModal = () => {
    setModalOpen(null);
    setEditingItem(null);
    setForm({ name: '', sort: 0 });
  };

  const handleConfirmModal = async () => {
    if (!form.name.trim()) return;
    const sortNum = Number(form.sort);
    if (modalOpen === 'edit' && editingItem) {
      await updateVerifiedName(editingItem.id, { name: form.name.trim(), sort: sortNum });
      setData((prev) =>
        prev.map((r) => (r.id === editingItem.id ? { ...r, name: form.name.trim(), sort: sortNum } : r))
      );
    } else if (modalOpen === 'add') {
      const created = await createVerifiedName({ name: form.name.trim(), sort: sortNum });
      setData((prev) => [...prev, created].sort((a, b) => a.sort - b.sort));
    }
    handleCloseModal();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Add
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          onClick={handleBulkDelete}
          disabled={selected.length === 0}
        >
          Delete
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
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sort</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Operation</TableCell>
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
              data.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(row.id)}
                      onChange={() => handleSelectOne(row.id)}
                    />
                  </TableCell>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.sort}</TableCell>
                  <TableCell sx={{ width: 56 }}>
                    <OperationButton
                      items={[{ label: 'Edit', onClick: () => handleEdit(row), icon: <Edit fontSize="small" /> }]}
                      dangerItems={[{ label: 'Delete', onClick: () => handleDelete(row.id), icon: <Delete fontSize="small" /> }]}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
          {modalOpen === 'add' ? 'Add' : 'Edit'}
          <IconButton size="small" onClick={handleCloseModal} aria-label="Close">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
            fullWidth
            variant="outlined"
            placeholder="Please enter name"
          />
          <TextField
            label="Sort"
            value={form.sort}
            onChange={(e) => setForm((p) => ({ ...p, sort: Number(e.target.value) || 0 }))}
            required
            type="number"
            fullWidth
            variant="outlined"
            inputProps={{ min: 0 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button variant="outlined" color="inherit" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleConfirmModal} disabled={!form.name.trim()}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
