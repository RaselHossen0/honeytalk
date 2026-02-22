'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  IconButton,
} from '@mui/material';
import { Add, Edit, Delete, PlayArrow, Pause } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { Search, Clear } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { MusicTrack } from '@/types/music-track';
import { demoMusicTracks } from '@/lib/demo-data';

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function InlineAudioPlayer({ src }: { src: string }) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    setCurrentTime(e.currentTarget.currentTime);
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    setDuration(e.currentTarget.duration);
  };

  const handleEnded = () => {
    setPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (_: unknown, value: number | number[]) => {
    const v = Array.isArray(value) ? value[0] : value;
    const audio = audioRef.current;
    if (audio && duration) {
      const t = (v / 100) * duration;
      audio.currentTime = t;
      setCurrentTime(t);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 220 }}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
        style={{ display: 'none' }}
      />
      <IconButton size="small" color="primary" onClick={handlePlayPause} sx={{ p: 0.5 }}>
        {playing ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
      </IconButton>
      <Box component="span" sx={{ fontSize: 12, minWidth: 32 }}>{formatTime(currentTime)}</Box>
      <Box component="span" sx={{ fontSize: 12, color: 'text.secondary' }}>/ {formatTime(duration || 0)}</Box>
      <Slider
        size="small"
        value={duration ? (currentTime / duration) * 100 : 0}
        onChange={handleSeek}
        sx={{ width: 80, color: 'primary.main', '& .MuiSlider-thumb': { width: 10, height: 10 } }}
      />
    </Box>
  );
}

export default function MusicManagementPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<MusicTrack[]>(demoMusicTracks);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<MusicTrack | null>(null);
  const [form, setForm] = useState({ name: '', singer: '', musicUrl: '', status: 'Unban', sort: 0 });
  const [filters, setFilters] = useState({ name: '', singer: '', status: '' });

  useEffect(() => {
    addTab({
      id: '/dashboard/live/music',
      label: 'Music management',
      path: '/dashboard/live/music',
      breadcrumbs: ['Home', 'Live Management', 'Music management'],
    });
  }, [addTab]);

  const filtered = useMemo(() => {
    let result = [...data];
    if (filters.name.trim()) {
      const k = filters.name.toLowerCase();
      result = result.filter((r) => r.name.toLowerCase().includes(k));
    }
    if (filters.singer.trim()) {
      const k = filters.singer.toLowerCase();
      result = result.filter((r) => r.singer.toLowerCase().includes(k));
    }
    if (filters.status) {
      result = result.filter((r) => r.status === filters.status);
    }
    return result;
  }, [data, filters]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleAdd = () => {
    setEditing(null);
    setForm({
      name: '',
      singer: '',
      musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      status: 'Unban',
      sort: data.length > 0 ? Math.max(...data.map((r) => r.sort), 0) + 1 : 1,
    });
    setEditOpen(true);
  };

  const handleEdit = (row: MusicTrack) => {
    setEditing(row);
    setForm({
      name: row.name,
      singer: row.singer,
      musicUrl: row.musicUrl,
      status: row.status,
      sort: row.sort,
    });
    setEditOpen(true);
  };

  const handleDelete = (row: MusicTrack) => {
    if (confirm(`Delete "${row.name}" by ${row.singer}?`)) {
      setData((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  const handleSave = () => {
    if (editing) {
      setData((prev) =>
        prev.map((r) =>
          r.id === editing.id ? { ...r, ...form, number: r.number } : r
        )
      );
    } else {
      const nextNum = Math.max(...data.map((r) => r.number), 0) + 1;
      setData((prev) => [
        ...prev,
        {
          id: nextNum,
          number: nextNum,
          ...form,
          addTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        } as MusicTrack,
      ]);
    }
    setEditOpen(false);
  };

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({ name: '', singer: '', status: '' });
    setPage(0);
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
          <TextField
            size="small"
            label="Name"
            placeholder="Name"
            value={filters.name}
            onChange={(e) => setFilters((p) => ({ ...p, name: e.target.value }))}
            sx={{ minWidth: 140 }}
          />
          <TextField
            size="small"
            label="Singer"
            placeholder="Singer"
            value={filters.singer}
            onChange={(e) => setFilters((p) => ({ ...p, singer: e.target.value }))}
            sx={{ minWidth: 140 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Unban">Unban</MenuItem>
              <MenuItem value="Ban">Ban</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
            Query
          </Button>
          <Button variant="outlined" color="error" startIcon={<Clear />} onClick={handleClear}>
            Clear conditions
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={handleAdd} sx={{ ml: 'auto' }}>
            Add
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600, minWidth: 80 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Singer</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 260 }}>Music address</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 80 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 70 }}>Sort</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 165 }}>Add Time</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 140 }} align="right">
                Operation
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row) => (
              <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                <TableCell>{row.number}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.singer}</TableCell>
                <TableCell>
                  <InlineAudioPlayer src={row.musicUrl} />
                </TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.sort}</TableCell>
                <TableCell>{row.addTime}</TableCell>
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
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50]}
          labelRowsPerPage="per page"
        />
      </TableContainer>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit' : 'Add'} Music</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            fullWidth
            required
            placeholder="e.g. Stronger"
          />
          <TextField
            label="Singer"
            value={form.singer}
            onChange={(e) => setForm((f) => ({ ...f, singer: e.target.value }))}
            fullWidth
            placeholder="e.g. Kelly Clarkson"
          />
          <TextField
            label="Music address (URL)"
            value={form.musicUrl}
            onChange={(e) => setForm((f) => ({ ...f, musicUrl: e.target.value }))}
            fullWidth
            placeholder="https://..."
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={form.status}
              label="Status"
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            >
              <MenuItem value="Unban">Unban</MenuItem>
              <MenuItem value="Ban">Ban</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Sort"
            type="number"
            value={form.sort}
            onChange={(e) => setForm((f) => ({ ...f, sort: parseInt(e.target.value, 10) || 0 }))}
            fullWidth
          />
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
