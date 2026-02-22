'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  Typography,
  Slider,
} from '@mui/material';
import { Add, Edit, Delete, Close, PlayArrow, Pause } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { AudioUpload } from '@/components/common/AudioUpload';
import { useTabsStore } from '@/store/tabs';
import type { LiveRoomSoundEffect, LiveRoomSoundEffectPayload } from '@/types/live';
import {
  fetchLiveRoomSoundEffects,
  createLiveRoomSoundEffect,
  updateLiveRoomSoundEffect,
  deleteLiveRoomSoundEffect,
  batchDeleteLiveRoomSoundEffects,
} from '@/services/live';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function AudioPlayerCell({
  resourceUrl,
  durationSeconds,
}: {
  resourceUrl?: string;
  durationSeconds: number;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationSeconds);

  const hasAudio = resourceUrl && resourceUrl.trim() !== '';

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      setPlaying(false);
      setCurrentTime(0);
    };
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [resourceUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  };

  const handleSeek = (_: Event, value: number | number[]) => {
    const v = Array.isArray(value) ? value[0] : value;
    const audio = audioRef.current;
    if (audio) audio.currentTime = v;
    setCurrentTime(v);
  };

  if (!hasAudio) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 140 }}>
        <Typography variant="body2" color="text.secondary">
          0:00 / 0:00
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minWidth: 160 }}>
      <audio ref={audioRef} src={resourceUrl} preload="metadata" />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton size="small" onClick={togglePlay} color="primary" sx={{ p: 0.5 }}>
          {playing ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
        </IconButton>
        <Typography variant="caption" sx={{ minWidth: 70 }}>
          {formatTime(currentTime)} / {formatTime(isNaN(duration) ? 0 : duration)}
        </Typography>
      </Box>
      <Slider
        size="small"
        value={currentTime}
        min={0}
        max={duration || 1}
        step={0.1}
        onChange={handleSeek}
        sx={{ mt: 0.5, height: 4 }}
      />
    </Box>
  );
}

export default function LiveRoomSoundEffectsPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<LiveRoomSoundEffect[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<LiveRoomSoundEffectPayload>({
    name: '',
    resourceUrl: '',
    status: 'Unban',
    sort: 1,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchLiveRoomSoundEffects();
      setData(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    addTab({
      id: '/dashboard/live/sound-effects',
      label: 'Live Room Sound Effects',
      path: '/dashboard/live/sound-effects',
      breadcrumbs: ['Home', 'Live Management', 'Live Room Sound Effects'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = () => {
    setEditingId(null);
    setForm({ name: '', resourceUrl: '', status: 'Unban', sort: 1 });
    setDialogOpen(true);
  };

  const handleEdit = (row: LiveRoomSoundEffect) => {
    setEditingId(row.id);
    setForm({
      name: row.name,
      resourceUrl: row.resourceUrl ?? '',
      status: row.status,
      sort: row.sort,
    });
    setDialogOpen(true);
  };

  const handleDialogConfirm = async () => {
    if (!form.name.trim()) return;
    if (editingId) {
      await updateLiveRoomSoundEffect(editingId, form);
      setData((prev) =>
        prev.map((r) => (r.id === editingId ? { ...r, ...form } : r))
      );
    } else {
      const created = await createLiveRoomSoundEffect(form);
      setData((prev) => [...prev, created]);
    }
    setDialogOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this sound effect?')) return;
    await deleteLiveRoomSoundEffect(id);
    setData((prev) => prev.filter((r) => r.id !== id));
  };

  const handleToggleStatus = async (row: LiveRoomSoundEffect) => {
    const newStatus = row.status === 'Unban' ? 'Ban' : 'Unban';
    await updateLiveRoomSoundEffect(row.id, { status: newStatus });
    setData((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, status: newStatus } : r))
    );
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
    if (!confirm(`Delete ${selected.length} selected sound effect(s)?`)) return;
    await batchDeleteLiveRoomSoundEffects(selected);
    setData((prev) => prev.filter((r) => !selected.includes(r.id)));
    setSelected([]);
  };

  const allSelected = data.length > 0 && selected.length === data.length;

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
              <TableCell padding="checkbox">
                <Checkbox
                  checked={allSelected}
                  indeterminate={selected.length > 0 && selected.length < data.length}
                  onChange={handleSelectAll}
                  size="small"
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Resources</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sort</TableCell>
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
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(row.id)}
                      onChange={() => handleSelectOne(row.id)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    <AudioPlayerCell
                      resourceUrl={row.resourceUrl}
                      durationSeconds={row.durationSeconds}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      component="button"
                      variant="body2"
                      onClick={() => handleToggleStatus(row)}
                      sx={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: 'primary.main',
                        textDecoration: 'underline',
                        p: 0,
                        font: 'inherit',
                      }}
                    >
                      {row.status}
                    </Typography>
                  </TableCell>
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
          {editingId ? 'Edit' : 'Add'}
          <IconButton size="small" onClick={() => setDialogOpen(false)} aria-label="Close">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              required
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Grand debut"
              variant="outlined"
            />
            <AudioUpload
              label="Link"
              required
              value={form.resourceUrl}
              onChange={(url) => setForm((p) => ({ ...p, resourceUrl: url }))}
              helperText="Uploading rule: Uploading audio can only be in MP3 format!"
            />
            <TextField
              fullWidth
              label="Sort"
              required
              type="number"
              value={form.sort}
              onChange={(e) => setForm((p) => ({ ...p, sort: Number(e.target.value) || 0 }))}
              inputProps={{ min: 0 }}
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button variant="outlined" color="inherit" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDialogConfirm}
            disabled={!form.name.trim() || !(form.resourceUrl ?? '').trim()}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
