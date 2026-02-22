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
import { Add, Edit, Delete, Close, CardGiftcard } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import type { NobleType, NobleTypePayload } from '@/types/noble';
import {
  fetchNobleTypes,
  createNobleType,
  updateNobleType,
  deleteNobleType,
  toggleNobleTypeStatus,
} from '@/services/noble';

export default function NobleTypesPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<NobleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<NobleTypePayload>({
    nobleName: '',
    nobleIconUrl: '',
    nobleInsigniaUrl: '',
    nobleCardUrl: '',
    nobleAvatarFrameUrl: '',
    chatBackgroundColor: '#F225F5',
    sort: 1,
  });
  const [giftsOpen, setGiftsOpen] = useState(false);
  const [giftsRow, setGiftsRow] = useState<NobleType | null>(null);
  const [giftsForm, setGiftsForm] = useState({ userId: '', timeDays: '', note: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchNobleTypes();
      setData(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    addTab({
      id: '/dashboard/noble/types',
      label: 'Noble Types',
      path: '/dashboard/noble/types',
      breadcrumbs: ['Home', 'Prop management', 'Noble Management', 'Noble Types'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = () => {
    setEditingId(null);
    setForm({
      nobleName: '',
      nobleIconUrl: '',
      nobleInsigniaUrl: '',
      nobleCardUrl: '',
      nobleAvatarFrameUrl: '',
      chatBackgroundColor: '#F225F5',
      sort: 1,
    });
    setDialogOpen(true);
  };

  const handleEdit = (row: NobleType) => {
    setEditingId(row.id);
    setForm({
      nobleName: row.nobleName,
      nobleIconUrl: row.nobleIconUrl ?? '',
      nobleInsigniaUrl: row.nobleInsigniaUrl ?? '',
      nobleCardUrl: row.nobleCardUrl ?? '',
      nobleAvatarFrameUrl: row.nobleAvatarFrameUrl ?? '',
      chatBackgroundColor: row.chatBackgroundColor,
      sort: row.sort,
    });
    setDialogOpen(true);
  };

  const handleDialogConfirm = async () => {
    if (editingId) {
      await updateNobleType(editingId, form);
      setData((prev) =>
        prev.map((r) => (r.id === editingId ? { ...r, ...form } : r))
      );
    } else {
      const created = await createNobleType(form);
      setData((prev) => [...prev, created]);
    }
    setDialogOpen(false);
  };

  const handleDelete = async (row: NobleType) => {
    if (!confirm(`Delete "${row.nobleName}"?`)) return;
    await deleteNobleType(row.id);
    setData((prev) => prev.filter((r) => r.id !== row.id));
  };

  const handleToggleStatus = async (row: NobleType) => {
    await toggleNobleTypeStatus(row.id);
    setData((prev) =>
      prev.map((r) =>
        r.id === row.id ? { ...r, status: r.status === 'Unban' ? 'Ban' : 'Unban' } : r
      )
    );
  };

  const handleGiftsOpen = (row: NobleType) => {
    setGiftsRow(row);
    setGiftsForm({ userId: '', timeDays: '', note: '' });
    setGiftsOpen(true);
  };

  const handleGiftsClose = () => {
    setGiftsOpen(false);
    setGiftsRow(null);
  };

  const handleGiftsConfirm = () => {
    // TODO: API call with giftsForm and giftsRow
    handleGiftsClose();
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
              <TableCell sx={{ fontWeight: 600 }}>Noble name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Noble icon</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Noble Insignia</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Noble card</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Noble avatar frame</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>chat background color</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sort</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.nobleName}</TableCell>
                  <TableCell>
                    {row.nobleIconUrl ? (
                      <Box component="img" src={row.nobleIconUrl} alt="" sx={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 1 }} />
                    ) : (
                      <Box sx={{ width: 32, height: 32, bgcolor: 'grey.300', borderRadius: 1 }} />
                    )}
                  </TableCell>
                  <TableCell>
                    {row.nobleInsigniaUrl ? (
                      <Box component="img" src={row.nobleInsigniaUrl} alt="" sx={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 1 }} />
                    ) : (
                      <Box sx={{ width: 32, height: 32, bgcolor: 'grey.300', borderRadius: 1 }} />
                    )}
                  </TableCell>
                  <TableCell>
                    {row.nobleCardUrl ? (
                      <Box component="img" src={row.nobleCardUrl} alt="" sx={{ width: 48, height: 32, objectFit: 'cover', borderRadius: 1 }} />
                    ) : (
                      <Box sx={{ width: 48, height: 4, bgcolor: 'grey.300', borderRadius: 1 }} />
                    )}
                  </TableCell>
                  <TableCell>
                    {row.nobleAvatarFrameUrl ? (
                      <Box component="img" src={row.nobleAvatarFrameUrl} alt="" sx={{ width: 32, height: 32, objectFit: 'cover', borderRadius: '50%' }} />
                    ) : (
                      <Box sx={{ width: 32, height: 32, bgcolor: 'grey.300', borderRadius: '50%' }} />
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: 1,
                          bgcolor: row.chatBackgroundColor,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      />
                      {row.chatBackgroundColor}
                    </Box>
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
                      items={[
                        { label: 'Gifts', onClick: () => handleGiftsOpen(row), icon: <CardGiftcard fontSize="small" /> },
                        { label: 'Edit', onClick: () => handleEdit(row), icon: <Edit fontSize="small" /> },
                      ]}
                      dangerItems={[{ label: 'Delete', onClick: () => handleDelete(row), icon: <Delete fontSize="small" /> }]}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editingId ? 'Edit Noble Type' : 'Add Noble Type'}
          <IconButton size="small" onClick={() => setDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField fullWidth label="Noble name" value={form.nobleName} onChange={(e) => setForm((p) => ({ ...p, nobleName: e.target.value }))} />
            <TextField fullWidth label="Noble icon URL" value={form.nobleIconUrl} onChange={(e) => setForm((p) => ({ ...p, nobleIconUrl: e.target.value }))} />
            <TextField fullWidth label="Noble Insignia URL" value={form.nobleInsigniaUrl} onChange={(e) => setForm((p) => ({ ...p, nobleInsigniaUrl: e.target.value }))} />
            <TextField fullWidth label="Noble card URL" value={form.nobleCardUrl} onChange={(e) => setForm((p) => ({ ...p, nobleCardUrl: e.target.value }))} />
            <TextField fullWidth label="Noble avatar frame URL" value={form.nobleAvatarFrameUrl} onChange={(e) => setForm((p) => ({ ...p, nobleAvatarFrameUrl: e.target.value }))} />
            <TextField fullWidth label="Chat background color" value={form.chatBackgroundColor} onChange={(e) => setForm((p) => ({ ...p, chatBackgroundColor: e.target.value }))} placeholder="#F225F5" />
            <TextField fullWidth label="Sort" type="number" value={form.sort} onChange={(e) => setForm((p) => ({ ...p, sort: Number(e.target.value) || 0 }))} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleDialogConfirm} disabled={!form.nobleName.trim()}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={giftsOpen} onClose={handleGiftsClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Gifts
          <IconButton size="small" onClick={handleGiftsClose} aria-label="Close">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="User ID"
            value={giftsForm.userId}
            onChange={(e) => setGiftsForm((f) => ({ ...f, userId: e.target.value }))}
            fullWidth
            size="small"
          />
          <TextField
            label="Time (Days)"
            type="number"
            value={giftsForm.timeDays}
            onChange={(e) => setGiftsForm((f) => ({ ...f, timeDays: e.target.value }))}
            fullWidth
            size="small"
            placeholder="e.g. 7"
            InputProps={{ inputProps: { min: 0 } }}
          />
          <TextField
            label="Note"
            value={giftsForm.note}
            onChange={(e) => setGiftsForm((f) => ({ ...f, note: e.target.value }))}
            fullWidth
            size="small"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleGiftsClose}>Cancel</Button>
          <Button variant="contained" onClick={handleGiftsConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
