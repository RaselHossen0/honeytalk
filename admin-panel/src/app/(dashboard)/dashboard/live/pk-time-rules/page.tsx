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
  Checkbox,
} from '@mui/material';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import type { PkTimeRule, PkTimeRulePayload } from '@/types/live';
import {
  fetchPkTimeRules,
  createPkTimeRule,
  updatePkTimeRule,
  deletePkTimeRule,
  batchDeletePkTimeRules,
} from '@/services/live';

export default function PkTimeRulesPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<PkTimeRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<PkTimeRulePayload>({ timeMinutes: 10, sort: 1 });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchPkTimeRules();
      setData(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    addTab({
      id: '/dashboard/live/pk-time-rules',
      label: 'PK Time Rule Setting',
      path: '/dashboard/live/pk-time-rules',
      breadcrumbs: ['Home', 'Live Management', 'Room Configuration', 'PK Time Rule Setting'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = () => {
    setEditingId(null);
    setForm({ timeMinutes: 10, sort: 1 });
    setDialogOpen(true);
  };

  const handleEdit = (row: PkTimeRule) => {
    setEditingId(row.id);
    setForm({ timeMinutes: row.timeMinutes, sort: row.sort });
    setDialogOpen(true);
  };

  const handleDialogConfirm = async () => {
    if (editingId) {
      await updatePkTimeRule(editingId, form);
      setData((prev) =>
        prev.map((r) => (r.id === editingId ? { ...r, ...form } : r))
      );
    } else {
      const created = await createPkTimeRule(form);
      setData((prev) => [...prev, created]);
    }
    setDialogOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this rule?')) return;
    await deletePkTimeRule(id);
    setData((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.checked ? data.map((r) => r.id) : []);
  };

  const handleSelectOne = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBatchDelete = async () => {
    if (selected.length === 0) return;
    if (!confirm(`Delete ${selected.length} selected rule(s)?`)) return;
    await batchDeletePkTimeRules(selected);
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

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={allSelected}
                  indeterminate={selected.length > 0 && selected.length < data.length}
                  onChange={handleSelectAll}
                  size="small"
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Time(minute)</TableCell>
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
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.timeMinutes}</TableCell>
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

        {selected.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleBatchDelete}
            >
              Delete ({selected.length})
            </Button>
          </Box>
        )}
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editingId ? 'Edit PK Time Rule' : 'Add PK Time Rule'}
          <IconButton size="small" onClick={() => setDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              label="Time (minute)"
              type="number"
              value={form.timeMinutes}
              onChange={(e) => setForm((p) => ({ ...p, timeMinutes: Number(e.target.value) || 0 }))}
              inputProps={{ min: 1 }}
            />
            <TextField
              fullWidth
              label="Sort"
              type="number"
              value={form.sort}
              onChange={(e) => setForm((p) => ({ ...p, sort: Number(e.target.value) || 0 }))}
              inputProps={{ min: 0 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleDialogConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
