'use client';

import { useState, useEffect } from 'react';
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
import type { GuardianPrivilege } from '@/types/guardian';
import { demoGuardianPrivileges } from '@/lib/demo-data';

export default function GuardianPrivilegePage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<GuardianPrivilege[]>(demoGuardianPrivileges);
  const [selected, setSelected] = useState<number[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<GuardianPrivilege | null>(null);
  const [form, setForm] = useState({ name: '', selectedIconUrl: '', defaultIconUrl: '', sort: 0 });

  useEffect(() => {
    addTab({
      id: '/dashboard/guardian/privileges',
      label: 'Privilege List',
      path: '/dashboard/guardian/privileges',
      breadcrumbs: ['Home', 'Prop Management', 'Guardian Management', 'Privilege List'],
    });
  }, [addTab]);

  const handleAdd = () => {
    setEditing(null);
    setForm({
      name: '',
      selectedIconUrl: 'https://picsum.photos/32/32',
      defaultIconUrl: 'https://picsum.photos/32/32',
      sort: 0,
    });
    setEditOpen(true);
  };

  const handleEdit = (row: GuardianPrivilege) => {
    setEditing(row);
    setForm({
      name: row.name,
      selectedIconUrl: row.selectedIconUrl,
      defaultIconUrl: row.defaultIconUrl,
      sort: row.sort,
    });
    setEditOpen(true);
  };

  const handleDelete = (row: GuardianPrivilege) => {
    if (confirm(`Delete "${row.name}"?`)) {
      setData((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    if (confirm(`Delete ${selected.length} privilege(s)?`)) {
      setData((prev) => prev.filter((r) => !selected.includes(r.id)));
      setSelected([]);
    }
  };

  const handleSave = () => {
    if (editing) {
      setData((prev) =>
        prev.map((r) =>
          r.id === editing.id
            ? { ...r, name: form.name, selectedIconUrl: form.selectedIconUrl, defaultIconUrl: form.defaultIconUrl, sort: form.sort }
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
          selectedIconUrl: form.selectedIconUrl,
          defaultIconUrl: form.defaultIconUrl,
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
          Add
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
              <TableCell sx={{ fontWeight: 600 }}>Selected</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Default</TableCell>
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
                  <Box sx={{ width: 32, height: 32, position: 'relative', borderRadius: 1, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                    <Image src={row.selectedIconUrl} alt={`${row.name} selected`} fill sizes="32px" style={{ objectFit: 'cover' }} unoptimized />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ width: 32, height: 32, position: 'relative', borderRadius: 1, overflow: 'hidden', border: '1px solid', borderColor: 'divider', opacity: 0.7 }}>
                    <Image src={row.defaultIconUrl} alt={`${row.name} default`} fill sizes="32px" style={{ objectFit: 'cover' }} unoptimized />
                  </Box>
                </TableCell>
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
        <DialogTitle>{editing ? 'Edit' : 'Add'} Privilege</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} fullWidth required />
          <TextField label="Selected Icon URL" value={form.selectedIconUrl} onChange={(e) => setForm((f) => ({ ...f, selectedIconUrl: e.target.value }))} fullWidth />
          <TextField label="Default Icon URL" value={form.defaultIconUrl} onChange={(e) => setForm((f) => ({ ...f, defaultIconUrl: e.target.value }))} fullWidth />
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
