'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { Add, Edit, Delete, CardGiftcard } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import { ImageUpload } from '@/components/common/ImageUpload';
import type { HeadFrame } from '@/types/head-frame';
import { demoHeadFrames } from '@/lib/demo-data';

export default function HeadFrameListPage() {
  const router = useRouter();
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<HeadFrame[]>(demoHeadFrames);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<HeadFrame | null>(null);
  const [form, setForm] = useState({ name: '', price: 0, timeDays: 30, imageUrl: '', unban: 'Yes' as 'Yes' | 'No', sort: 100 });

  useEffect(() => {
    addTab({
      id: '/dashboard/head-frame/list',
      label: 'head frame list',
      path: '/dashboard/head-frame/list',
      breadcrumbs: ['Home', 'Prop management', 'head frame', 'head frame list'],
    });
  }, [addTab]);

  const handleAdd = () => {
    setEditing(null);
    setForm({ name: '', price: 0, timeDays: 30, imageUrl: 'https://picsum.photos/64/64', unban: 'Yes', sort: 100 });
    setEditOpen(true);
  };

  const handleEdit = (row: HeadFrame) => {
    setEditing(row);
    setForm({ name: row.name, price: row.price, timeDays: row.timeDays, imageUrl: row.imageUrl, unban: row.unban, sort: row.sort });
    setEditOpen(true);
  };

  const handleDelete = (row: HeadFrame) => {
    if (confirm(`Delete "${row.name}"?`)) {
      setData((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  const handleGifts = (row: HeadFrame) => {
    router.push(`/dashboard/head-frame/gift-record?frameId=${row.id}`);
  };

  const handleSave = () => {
    if (editing) {
      setData((prev) =>
        prev.map((r) =>
          r.id === editing.id
            ? { ...r, name: form.name, price: form.price, timeDays: form.timeDays, imageUrl: form.imageUrl, unban: form.unban, sort: form.sort }
            : r
        )
      );
    } else {
      const nextId = Math.max(...data.map((r) => r.id), 0) + 1;
      const nextNum = Math.max(...data.map((r) => r.number), 0) + 1;
      setData((prev) => [
        ...prev,
        { id: nextId, number: nextNum, name: form.name, price: form.price, timeDays: form.timeDays, imageUrl: form.imageUrl, unban: form.unban, sort: form.sort },
      ]);
    }
    setEditOpen(false);
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Add
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Time(Days)</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>svga/webp</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Unban</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sort</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                Operation
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                <TableCell>{row.number}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.price}</TableCell>
                <TableCell>{row.timeDays}</TableCell>
                <TableCell>
                  <Box sx={{ width: 48, height: 48, position: 'relative', borderRadius: 1, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                    <Image src={row.imageUrl} alt={row.name} fill sizes="48px" style={{ objectFit: 'cover' }} unoptimized />
                  </Box>
                </TableCell>
                <TableCell>{row.unban}</TableCell>
                <TableCell>{row.sort}</TableCell>
                <TableCell align="right" sx={{ width: 56 }}>
                  <OperationButton
                    items={[
                      { label: 'Gifts', onClick: () => handleGifts(row), icon: <CardGiftcard fontSize="small" /> },
                      { label: 'Edit', onClick: () => handleEdit(row), icon: <Edit fontSize="small" /> },
                    ]}
                    dangerItems={[{ label: 'Delete', onClick: () => handleDelete(row), icon: <Delete fontSize="small" /> }]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit' : 'Add'} Head Frame</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} fullWidth required />
          <TextField label="Price" type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: parseInt(e.target.value, 10) || 0 }))} fullWidth />
          <TextField label="Time(Days)" type="number" value={form.timeDays} onChange={(e) => setForm((f) => ({ ...f, timeDays: parseInt(e.target.value, 10) || 0 }))} fullWidth />
          <ImageUpload label="Image (svga/webp)" value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} accept="image/svg+xml,image/webp,image/*" helperText="Upload SVGA or WebP. Files will be stored on AWS S3." />
          <FormControl fullWidth>
            <InputLabel>Unban</InputLabel>
            <Select value={form.unban} label="Unban" onChange={(e) => setForm((f) => ({ ...f, unban: e.target.value as 'Yes' | 'No' }))}>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Sort" type="number" value={form.sort} onChange={(e) => setForm((f) => ({ ...f, sort: parseInt(e.target.value, 10) || 0 }))} fullWidth />
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
