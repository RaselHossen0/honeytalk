'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
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
import { ImageUpload } from '@/components/common/ImageUpload';
import type { DynamicTopic } from '@/types/dynamic';
import { demoDynamicTopics } from '@/lib/demo-data';

export default function DynamicTopicsPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<DynamicTopic[]>(demoDynamicTopics);
  const [selected, setSelected] = useState<number[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<DynamicTopic | null>(null);
  const [form, setForm] = useState({
    topic: '',
    sort: 0,
    backgroundImageUrl: '',
    coverImageUrl: '',
    status: 'Display' as 'Display' | 'Hide',
  });

  useEffect(() => {
    addTab({
      id: '/dashboard/dynamic/topics',
      label: 'Dynamic Topics',
      path: '/dashboard/dynamic/topics',
      breadcrumbs: ['Home', 'Dynamic Management', 'Dynamic Topics'],
    });
  }, [addTab]);

  const handleAdd = () => {
    setEditing(null);
    setForm({
      topic: '',
      sort: data.length > 0 ? Math.max(...data.map((r) => r.sort), 0) + 1 : 0,
      backgroundImageUrl: 'https://picsum.photos/120/80',
      coverImageUrl: 'https://picsum.photos/120/80',
      status: 'Display',
    });
    setEditOpen(true);
  };

  const handleEdit = (row: DynamicTopic) => {
    setEditing(row);
    setForm({
      topic: row.topic,
      sort: row.sort,
      backgroundImageUrl: row.backgroundImageUrl,
      coverImageUrl: row.coverImageUrl,
      status: row.status,
    });
    setEditOpen(true);
  };

  const handleDelete = (row: DynamicTopic) => {
    if (confirm(`Delete topic "${row.topic}"?`)) {
      setData((p) => p.filter((r) => r.id !== row.id));
    }
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    if (confirm(`Delete ${selected.length} topic(s)?`)) {
      setData((p) => p.filter((r) => !selected.includes(r.id)));
      setSelected([]);
    }
  };

  const handleSave = () => {
    if (editing) {
      setData((p) =>
        p.map((r) =>
          r.id === editing.id ? { ...r, ...form } : r
        )
      );
    } else {
      const nextNum = Math.max(...data.map((r) => r.number), 0) + 1;
      setData((p) => [
        ...p,
        {
          id: nextNum,
          number: nextNum,
          ...form,
        } as DynamicTopic,
      ]);
    }
    setEditOpen(false);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelected(data.map((r) => r.id));
    else setSelected([]);
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Add
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        <TableContainer sx={{ maxHeight: 520, overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell padding="checkbox" sx={{ fontWeight: 600 }} />
                <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>Number</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>Topic</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 80 }}>Sort</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 130 }}>Background image</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 130 }}>Cover image</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Unban</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 140 }} align="right">
                  Operation
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(row.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelected((s) => [...s, row.id]);
                        else setSelected((s) => s.filter((id) => id !== row.id));
                      }}
                    />
                  </TableCell>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.topic}</TableCell>
                  <TableCell>{row.sort}</TableCell>
                  <TableCell>
                    <Box sx={{ width: 80, height: 52, position: 'relative', borderRadius: 1, overflow: 'hidden' }}>
                      <Image
                        src={row.backgroundImageUrl}
                        alt={row.topic}
                        fill
                        sizes="80px"
                        style={{ objectFit: 'cover' }}
                        unoptimized
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ width: 80, height: 52, position: 'relative', borderRadius: 1, overflow: 'hidden' }}>
                      <Image
                        src={row.coverImageUrl}
                        alt={row.topic}
                        fill
                        sizes="80px"
                        style={{ objectFit: 'cover' }}
                        unoptimized
                      />
                    </Box>
                  </TableCell>
                  <TableCell>{row.status}</TableCell>
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
        </TableContainer>
        {selected.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleBulkDelete}
            >
              Delete
            </Button>
          </Box>
        )}
      </Paper>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit' : 'Add'} Dynamic Topic</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Topic"
            value={form.topic}
            onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
            fullWidth
            required
          />
          <TextField
            label="Sort"
            type="number"
            value={form.sort || ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, sort: parseInt(e.target.value, 10) || 0 }))
            }
            fullWidth
          />
          <ImageUpload
            label="Background image"
            value={form.backgroundImageUrl}
            onChange={(url) => setForm((f) => ({ ...f, backgroundImageUrl: url }))}
          />
          <ImageUpload
            label="Cover image"
            value={form.coverImageUrl}
            onChange={(url) => setForm((f) => ({ ...f, coverImageUrl: url }))}
          />
          <FormControl fullWidth>
            <InputLabel>Unban</InputLabel>
            <Select
              value={form.status}
              label="Unban"
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.value as 'Display' | 'Hide' }))
              }
            >
              <MenuItem value="Display">Display</MenuItem>
              <MenuItem value="Hide">Hide</MenuItem>
            </Select>
          </FormControl>
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
