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
import type { SmsInterface, SmsInterfacePayload } from '@/types/sms';
import {
  fetchSmsInterfaces,
  createSmsInterface,
  updateSmsInterface,
  deleteSmsInterface,
  batchDeleteSmsInterfaces,
} from '@/services/sms';

export default function SMSInterfaceListPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<SmsInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<SmsInterfacePayload>({
    interfaceName: '',
    description: '',
    status: 'Valid',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchSmsInterfaces();
      setData(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    addTab({
      id: '/dashboard/sms/interfaces',
      label: 'SMS Interface List',
      path: '/dashboard/sms/interfaces',
      breadcrumbs: ['Home', 'SMS Management', 'SMS Interface List'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = () => {
    setEditingId(null);
    setForm({ interfaceName: '', description: '', status: 'Valid' });
    setDialogOpen(true);
  };

  const handleEdit = (row: SmsInterface) => {
    setEditingId(row.id);
    setForm({
      interfaceName: row.interfaceName,
      description: row.description,
      status: row.status,
    });
    setDialogOpen(true);
  };

  const handleDialogConfirm = async () => {
    if (editingId) {
      await updateSmsInterface(editingId, form);
      setData((prev) => prev.map((r) => (r.id === editingId ? { ...r, ...form } : r)));
    } else {
      const created = await createSmsInterface(form);
      setData((prev) => [...prev, created]);
    }
    setDialogOpen(false);
  };

  const handleDelete = async (row: SmsInterface) => {
    if (!confirm(`Delete "${row.interfaceName}"?`)) return;
    await deleteSmsInterface(row.id);
    setData((prev) => prev.filter((r) => r.id !== row.id));
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.checked ? data.map((r) => r.id) : []);
  };

  const handleSelectOne = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleBatchDelete = async () => {
    if (selected.length === 0) return;
    if (!confirm(`Delete ${selected.length} selected?`)) return;
    await batchDeleteSmsInterfaces(selected);
    setData((prev) => prev.filter((r) => !selected.includes(r.id)));
    setSelected([]);
  };

  const allSelected = data.length > 0 && selected.length === data.length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          + Add
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell padding="checkbox">
                <Checkbox checked={allSelected} indeterminate={selected.length > 0 && selected.length < data.length} onChange={handleSelectAll} size="small" />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Interface Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selected.includes(row.id)} onChange={() => handleSelectOne(row.id)} size="small" />
                  </TableCell>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.interfaceName}</TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>{row.description || '-'}</TableCell>
                  <TableCell>
                    <Box
                      component="span"
                      sx={{
                        color: row.status === 'Valid' ? 'primary.main' : 'error.main',
                        fontWeight: 500,
                      }}
                    >
                      {row.status}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: 56 }}>
                    <OperationButton
                      items={[{ label: 'Edit', onClick: () => handleEdit(row), icon: <Edit fontSize="small" /> }]}
                      dangerItems={[{ label: 'Delete', onClick: () => handleDelete(row), icon: <Delete fontSize="small" /> }]}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {selected.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleBatchDelete}>
              Delete ({selected.length})
            </Button>
          </Box>
        )}
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editingId ? 'Edit SMS Interface' : 'Add SMS Interface'}
          <IconButton size="small" onClick={() => setDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField fullWidth label="Interface Name" value={form.interfaceName} onChange={(e) => setForm((p) => ({ ...p, interfaceName: e.target.value }))} placeholder="e.g. AliCloud SMS" />
            <TextField fullWidth label="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="e.g. https://..." />
            {editingId && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button size="small" variant={form.status === 'Valid' ? 'contained' : 'outlined'} onClick={() => setForm((p) => ({ ...p, status: 'Valid' }))}>
                  Valid
                </Button>
                <Button size="small" variant={form.status === 'Invalid' ? 'contained' : 'outlined'} color="error" onClick={() => setForm((p) => ({ ...p, status: 'Invalid' }))}>
                  Invalid
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleDialogConfirm} disabled={!form.interfaceName.trim()}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
