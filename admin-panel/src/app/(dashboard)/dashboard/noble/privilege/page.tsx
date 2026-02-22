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
import type { NoblePrivilegeConfig, NoblePrivilegeConfigPayload } from '@/types/noble';
import {
  fetchNoblePrivilegeConfig,
  createNoblePrivilegeConfig,
  updateNoblePrivilegeConfig,
  deleteNoblePrivilegeConfig,
  toggleNoblePrivilegeConfigStatus,
} from '@/services/noble';

export default function NoblePrivilegePage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<NoblePrivilegeConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<NoblePrivilegeConfigPayload>({
    nobleType: '',
    iconUrl: '',
    unselectedIconUrl: '',
    sort: 1,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchNoblePrivilegeConfig();
      setData(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    addTab({
      id: '/dashboard/noble/privilege',
      label: 'Noble Privilege',
      path: '/dashboard/noble/privilege',
      breadcrumbs: ['Home', 'Prop management', 'Noble Management', 'Noble Privilege'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = () => {
    setEditingId(null);
    setForm({
      nobleType: '',
      iconUrl: '',
      unselectedIconUrl: '',
      sort: 1,
    });
    setDialogOpen(true);
  };

  const handleEdit = (row: NoblePrivilegeConfig) => {
    setEditingId(row.id);
    setForm({
      nobleType: row.nobleType,
      iconUrl: row.iconUrl ?? '',
      unselectedIconUrl: row.unselectedIconUrl ?? '',
      sort: row.sort,
    });
    setDialogOpen(true);
  };

  const handleDialogConfirm = async () => {
    if (editingId) {
      await updateNoblePrivilegeConfig(editingId, form);
      setData((prev) =>
        prev.map((r) => (r.id === editingId ? { ...r, ...form } : r))
      );
    } else {
      const created = await createNoblePrivilegeConfig(form);
      setData((prev) => [...prev, created]);
    }
    setDialogOpen(false);
  };

  const handleDelete = async (row: NoblePrivilegeConfig) => {
    if (!confirm(`Delete "${row.nobleType}"?`)) return;
    await deleteNoblePrivilegeConfig(row.id);
    setData((prev) => prev.filter((r) => r.id !== row.id));
  };

  const handleToggleStatus = async (row: NoblePrivilegeConfig) => {
    await toggleNoblePrivilegeConfigStatus(row.id);
    setData((prev) =>
      prev.map((r) =>
        r.id === row.id ? { ...r, status: r.status === 'Unban' ? 'Ban' : 'Unban' } : r
      )
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Add
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Noble Types</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Icon</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Unselected icon</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sort</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Operation</TableCell>
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
              data.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.nobleType}</TableCell>
                  <TableCell>
                    {row.iconUrl ? (
                      <Box component="img" src={row.iconUrl} alt="" sx={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '50%' }} />
                    ) : (
                      <Box sx={{ width: 40, height: 40, bgcolor: 'grey.300', borderRadius: '50%' }} />
                    )}
                  </TableCell>
                  <TableCell>
                    {row.unselectedIconUrl ? (
                      <Box component="img" src={row.unselectedIconUrl} alt="" sx={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '50%', opacity: 0.7 }} />
                    ) : (
                      <Box sx={{ width: 40, height: 40, bgcolor: 'grey.200', borderRadius: '50%' }} />
                    )}
                  </TableCell>
                  <TableCell>{row.sort}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleToggleStatus(row)}
                      sx={{
                        p: 0,
                        minWidth: 0,
                        color: 'primary.main',
                        textDecoration: 'underline',
                        '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                      }}
                    >
                      {row.status}
                    </Button>
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
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editingId ? 'Edit Noble Privilege' : 'Add Noble Privilege'}
          <IconButton size="small" onClick={() => setDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField fullWidth label="Noble Types" value={form.nobleType} onChange={(e) => setForm((p) => ({ ...p, nobleType: e.target.value }))} placeholder="e.g. Turn on notifications" />
            <TextField fullWidth label="Icon URL" value={form.iconUrl} onChange={(e) => setForm((p) => ({ ...p, iconUrl: e.target.value }))} />
            <TextField fullWidth label="Unselected icon URL" value={form.unselectedIconUrl} onChange={(e) => setForm((p) => ({ ...p, unselectedIconUrl: e.target.value }))} />
            <TextField fullWidth label="Sort" type="number" value={form.sort} onChange={(e) => setForm((p) => ({ ...p, sort: Number(e.target.value) || 0 }))} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleDialogConfirm} disabled={!form.nobleType.trim()}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
