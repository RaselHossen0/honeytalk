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
import { Sync, Edit, ContentCopy, Close } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import { ImageUpload } from '@/components/common/ImageUpload';
import type { GameConfig, GameConfigPayload } from '@/types/game';
import { fetchGameConfigs, syncGames, updateGameConfig } from '@/services/game';

export default function GameConfigurationPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<GameConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<GameConfigPayload>({
    gameName: '',
    gameId: 0,
    merchantId: '',
    gameIconUrl: '',
    backgroundImageUrl: '',
    type: '',
    frontendDomainUrl: '',
    sort: 0,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchGameConfigs();
      setData(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    addTab({
      id: '/dashboard/games/config',
      label: 'Game Configuration',
      path: '/dashboard/games/config',
      breadcrumbs: ['Home', 'Plugin management', 'Third party games', 'Game Configuration'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSync = async () => {
    await syncGames();
    load();
  };

  const handleEdit = (row: GameConfig) => {
    setEditingId(row.id);
    setForm({
      gameName: row.gameName,
      gameId: row.gameId,
      merchantId: row.merchantId,
      gameIconUrl: row.gameIconUrl ?? '',
      backgroundImageUrl: row.backgroundImageUrl ?? '',
      type: row.type,
      frontendDomainUrl: row.frontendDomainUrl,
      sort: row.sort,
    });
    setDialogOpen(true);
  };

  const handleDialogConfirm = async () => {
    if (editingId) {
      await updateGameConfig(editingId, form);
      setData((prev) => prev.map((r) => (r.id === editingId ? { ...r, ...form } : r)));
    }
    setDialogOpen(false);
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<Sync />} onClick={handleSync}>
          One-click Synchronize Games
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Game Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Game ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Merchant ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Game Icon</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Background image</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Front-end interface domain address</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Banner Display</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sort</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={13} align="center" sx={{ py: 4 }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.gameName}</TableCell>
                  <TableCell>{row.gameId}</TableCell>
                  <TableCell>{row.merchantId}</TableCell>
                  <TableCell>
                    {row.gameIconUrl ? (
                      <Box component="img" src={row.gameIconUrl} alt="" sx={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 1 }} />
                    ) : (
                      <Box sx={{ width: 48, height: 48, bgcolor: 'grey.300', borderRadius: 1 }} />
                    )}
                  </TableCell>
                  <TableCell>
                    {row.backgroundImageUrl ? (
                      <Box component="img" src={row.backgroundImageUrl} alt="" sx={{ width: 80, height: 45, objectFit: 'cover', borderRadius: 1 }} />
                    ) : (
                      <Box sx={{ width: 80, height: 45, bgcolor: 'grey.300', borderRadius: 1 }} />
                    )}
                  </TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell sx={{ maxWidth: 220, fontSize: 12 }}>{row.frontendDomainUrl}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.bannerDisplay}</TableCell>
                  <TableCell>{row.sort}</TableCell>
                  <TableCell>{row.time}</TableCell>
                  <TableCell sx={{ width: 56 }}>
                    <OperationButton
                      items={[
                        { label: 'Copy link', onClick: () => handleCopyLink(row.frontendDomainUrl), icon: <ContentCopy fontSize="small" /> },
                        { label: 'Edit', onClick: () => handleEdit(row), icon: <Edit fontSize="small" /> },
                      ]}
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
          Edit Game Configuration
          <IconButton size="small" onClick={() => setDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField fullWidth label="Game Name" value={form.gameName} onChange={(e) => setForm((p) => ({ ...p, gameName: e.target.value }))} />
            <TextField fullWidth label="Game ID" type="number" value={form.gameId} onChange={(e) => setForm((p) => ({ ...p, gameId: Number(e.target.value) || 0 }))} />
            <TextField fullWidth label="Merchant ID" value={form.merchantId} onChange={(e) => setForm((p) => ({ ...p, merchantId: e.target.value }))} />
            <ImageUpload label="Game Icon" value={form.gameIconUrl} onChange={(url) => setForm((p) => ({ ...p, gameIconUrl: url }))} />
            <ImageUpload label="Background image" value={form.backgroundImageUrl} onChange={(url) => setForm((p) => ({ ...p, backgroundImageUrl: url }))} />
            <TextField fullWidth label="Type" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} />
            <TextField fullWidth label="Front-end interface domain address" value={form.frontendDomainUrl} onChange={(e) => setForm((p) => ({ ...p, frontendDomainUrl: e.target.value }))} />
            <TextField fullWidth label="Sort" type="number" value={form.sort} onChange={(e) => setForm((p) => ({ ...p, sort: Number(e.target.value) || 0 }))} />
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
