'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  TablePagination,
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
import { Add, Edit, Delete, CardGiftcard } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { ImageUpload } from '@/components/common/ImageUpload';
import { useTabsStore } from '@/store/tabs';
import type { Car } from '@/types/car';
import { demoCars } from '@/lib/demo-data';

export default function CarListPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<Car[]>(demoCars);
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Car | null>(null);
  const [form, setForm] = useState<{ vehicleName: string; vehicleCover: string; sort: number; status: 'Unban' | 'Ban' }>({ vehicleName: '', vehicleCover: '', sort: 0, status: 'Unban' });

  useEffect(() => {
    addTab({
      id: '/dashboard/cars',
      label: 'Car List',
      path: '/dashboard/cars',
      breadcrumbs: ['Home', 'Prop Management', 'Car Management', 'Car List'],
    });
  }, [addTab]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, page, rowsPerPage]);

  const handleAdd = () => {
    setEditing(null);
    setForm({
      vehicleName: '',
      vehicleCover: 'https://picsum.photos/64/48',
      sort: data.length > 0 ? Math.max(...data.map((r) => r.sort), 0) + 1 : 1,
      status: 'Unban',
    });
    setEditOpen(true);
  };

  const handleEdit = (row: Car) => {
    setEditing(row);
    setForm({ vehicleName: row.vehicleName, vehicleCover: row.vehicleCover, sort: row.sort, status: row.status });
    setEditOpen(true);
  };

  const handleDelete = (row: Car) => {
    if (confirm(`Delete "${row.vehicleName}"?`)) {
      setData((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    if (confirm(`Delete ${selected.length} vehicle(s)?`)) {
      setData((prev) => prev.filter((r) => !selected.includes(r.id)));
      setSelected([]);
    }
  };

  const handleSave = () => {
    if (editing) {
      setData((prev) =>
        prev.map((r) => (r.id === editing.id ? { ...r, ...form, number: r.number } : r))
      );
    } else {
      const nextNum = Math.max(...data.map((r) => r.number), 0) + 1;
      setData((prev) => [
        ...prev,
        { id: nextNum, number: nextNum, ...form } as Car,
      ]);
    }
    setEditOpen(false);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelected(paginatedRows.map((r) => r.id));
    else setSelected([]);
  };

  const handleSelectOne = (id: string | number) => {
    if (selected.includes(id)) setSelected(selected.filter((s) => s !== id));
    else setSelected([...selected, id]);
  };

  return (
    <Box>
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
          <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
            + Add
          </Button>
        </Box>
        <TableContainer sx={{ maxHeight: 520, overflowX: 'auto' }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell padding="checkbox" sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < paginatedRows.length}
                    checked={paginatedRows.length > 0 && selected.length === paginatedRows.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 80 }}>Number</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 140 }}>Vehicle name</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 100 }}>Vehicle cover</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 80 }}>Sort</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 90 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 80 }}>SVGA</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 180 }} align="right">Operation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.id} hover selected={selected.includes(row.id)} sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selected.includes(row.id)} onChange={() => handleSelectOne(row.id)} />
                  </TableCell>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.vehicleName}</TableCell>
                  <TableCell>
                    <Box sx={{ width: 64, height: 48, position: 'relative', borderRadius: 1, overflow: 'hidden' }}>
                      <Image src={row.vehicleCover} alt={row.vehicleName} fill sizes="64px" style={{ objectFit: 'cover' }} unoptimized />
                    </Box>
                  </TableCell>
                  <TableCell>{row.sort}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    <Link href="#" style={{ color: '#6366f1', textDecoration: 'underline' }}>
                      View
                    </Link>
                  </TableCell>
                  <TableCell align="right" sx={{ width: 56 }}>
                    <OperationButton
                      items={[
                        { label: 'Gifts', onClick: () => {}, icon: <CardGiftcard fontSize="small" /> },
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
        {selected.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleBulkDelete}>
              Delete
            </Button>
          </Box>
        )}
        <TablePagination
          component="div"
          count={data.length}
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
      </Paper>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit' : 'Add'} Vehicle</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Vehicle name"
            value={form.vehicleName}
            onChange={(e) => setForm((f) => ({ ...f, vehicleName: e.target.value }))}
            fullWidth
            required
          />
          <ImageUpload
            label="Vehicle cover"
            value={form.vehicleCover}
            onChange={(url) => setForm((f) => ({ ...f, vehicleCover: url }))}
          />
          <TextField
            label="Sort"
            type="number"
            value={form.sort}
            onChange={(e) => setForm((f) => ({ ...f, sort: parseInt(e.target.value, 10) || 0 }))}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={form.status} label="Status" onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as 'Unban' | 'Ban' }))}>
              <MenuItem value="Unban">Unban</MenuItem>
              <MenuItem value="Ban">Ban</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
