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
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import { ImageUpload } from '@/components/common/ImageUpload';
import type { GuardianCategory } from '@/types/guardian';
import { demoGuardianCategories } from '@/lib/demo-data';

export default function GuardianCategoryPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<GuardianCategory[]>(demoGuardianCategories);
  const [selected, setSelected] = useState<number[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<GuardianCategory | null>(null);
  const [form, setForm] = useState({ name: '', imageUrl: '', privileges: '', sort: 0 });

  useEffect(() => {
    addTab({
      id: '/dashboard/guardian/categories',
      label: 'Guardian Category',
      path: '/dashboard/guardian/categories',
      breadcrumbs: ['Home', 'Prop Management', 'Guardian Management', 'Guardian Category'],
    });
  }, [addTab]);

  const handleAdd = () => {
    setEditing(null);
    setForm({ name: '', imageUrl: 'https://picsum.photos/48/48', privileges: '', sort: 0 });
    setEditOpen(true);
  };

  const handleEdit = (row: GuardianCategory) => {
    setEditing(row);
    setForm({
      name: row.name,
      imageUrl: row.imageUrl,
      privileges: row.privileges,
      sort: row.sort,
    });
    setEditOpen(true);
  };

  const handleDelete = (row: GuardianCategory) => {
    if (confirm(`Delete "${row.name}"?`)) {
      setData((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    if (confirm(`Delete ${selected.length} category(ies)?`)) {
      setData((prev) => prev.filter((r) => !selected.includes(r.id)));
      setSelected([]);
    }
  };

  const handleSave = () => {
    if (editing) {
      setData((prev) =>
        prev.map((r) =>
          r.id === editing.id
            ? { ...r, name: form.name, imageUrl: form.imageUrl, privileges: form.privileges, sort: form.sort }
            : r
        )
      );
    } else {
      const nextId = Math.max(...data.map((r) => r.id), 0) + 1;
      const nextNum = Math.max(...data.map((r) => r.number), 0) + 1;
      setData((prev) => [
        ...prev,
        {
          id: nextId,
          number: nextNum,
          name: form.name,
          imageUrl: form.imageUrl,
          privileges: form.privileges,
          sort: form.sort,
        },
      ]);
    }
    setEditOpen(false);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelected(data.map((r) => r.id));
    else setSelected([]);
  };

  const handleSelectOne = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          + Add
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < data.length}
                  checked={data.length > 0 && selected.length === data.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Guardian image</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 280 }}>Guardian privileges</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sort</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                Operation
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                <TableCell padding="checkbox">
                  <Checkbox checked={selected.includes(row.id)} onChange={() => handleSelectOne(row.id)} />
                </TableCell>
                <TableCell>{row.number}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  <Box sx={{ width: 40, height: 40, position: 'relative', borderRadius: 1, overflow: 'hidden' }}>
                    <Image src={row.imageUrl} alt={row.name} fill sizes="40px" style={{ objectFit: 'cover' }} unoptimized />
                  </Box>
                </TableCell>
                <TableCell sx={{ maxWidth: 320 }}>{row.privileges}</TableCell>
                <TableCell>{row.sort}</TableCell>
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
        {selected.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleBulkDelete}>
              Delete
            </Button>
          </Box>
        )}
      </TableContainer>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit' : 'Add'} Guardian Category</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} fullWidth required />
          <ImageUpload label="Image" value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />
          <TextField label="Guardian privileges" value={form.privileges} onChange={(e) => setForm((f) => ({ ...f, privileges: e.target.value }))} fullWidth multiline rows={3} />
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
