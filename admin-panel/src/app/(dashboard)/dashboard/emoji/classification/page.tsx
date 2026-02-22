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
import { ImageUpload } from '@/components/common/ImageUpload';
import type { EmojiClassification, EmojiClassificationPayload } from '@/types/emoji';
import {
  fetchEmojiClassifications,
  createEmojiClassification,
  updateEmojiClassification,
  deleteEmojiClassification,
  toggleEmojiClassificationStatus,
} from '@/services/emoji';

export default function EmojiClassificationPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<EmojiClassification[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<EmojiClassificationPayload>({
    categoryName: '',
    imageUrl: '',
    sort: 1,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchEmojiClassifications();
      setData(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    addTab({
      id: '/dashboard/emoji/classification',
      label: 'Emoji classification',
      path: '/dashboard/emoji/classification',
      breadcrumbs: ['Home', 'Prop management', 'Emoji management', 'Emoji classification'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = () => {
    setEditingId(null);
    setForm({ categoryName: '', imageUrl: '', sort: 1 });
    setDialogOpen(true);
  };

  const handleEdit = (row: EmojiClassification) => {
    setEditingId(row.id);
    setForm({
      categoryName: row.categoryName,
      imageUrl: row.imageUrl ?? '',
      sort: row.sort,
    });
    setDialogOpen(true);
  };

  const handleDialogConfirm = async () => {
    if (editingId) {
      await updateEmojiClassification(editingId, form);
      setData((prev) =>
        prev.map((r) => (r.id === editingId ? { ...r, ...form } : r))
      );
    } else {
      const created = await createEmojiClassification(form);
      setData((prev) => [...prev, created]);
    }
    setDialogOpen(false);
  };

  const handleDelete = async (row: EmojiClassification) => {
    if (!confirm(`Delete "${row.categoryName}"?`)) return;
    await deleteEmojiClassification(row.id);
    setData((prev) => prev.filter((r) => r.id !== row.id));
  };

  const handleToggleStatus = async (row: EmojiClassification) => {
    await toggleEmojiClassificationStatus(row.id);
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
          + Add
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sort</TableCell>
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
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.categoryName}</TableCell>
                  <TableCell>
                    {row.imageUrl ? (
                      <Box component="img" src={row.imageUrl} alt="" sx={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 1 }} />
                    ) : (
                      <Box sx={{ width: 36, height: 36, bgcolor: 'grey.300', borderRadius: 1 }} />
                    )}
                  </TableCell>
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
                  <TableCell>{row.sort}</TableCell>
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
          {editingId ? 'Edit Emoji Classification' : 'Add Emoji Classification'}
          <IconButton size="small" onClick={() => setDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField fullWidth label="Category name" value={form.categoryName} onChange={(e) => setForm((p) => ({ ...p, categoryName: e.target.value }))} placeholder="e.g. Emotions" />
            <ImageUpload label="Image" value={form.imageUrl ?? ''} onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))} />
            <TextField fullWidth label="Sort" type="number" value={form.sort} onChange={(e) => setForm((p) => ({ ...p, sort: Number(e.target.value) || 0 }))} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleDialogConfirm} disabled={!form.categoryName.trim()}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
