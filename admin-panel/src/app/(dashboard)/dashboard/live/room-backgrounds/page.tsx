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
  TablePagination,
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
import type { RoomBackground } from '@/types/room-background';
import { demoRoomBackgrounds } from '@/lib/demo-data';

export default function RoomBackgroundsPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<RoomBackground[]>(demoRoomBackgrounds);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<RoomBackground | null>(null);
  const [form, setForm] = useState({ title: '', imageUrl: '', status: 'Valid', sort: 0 });

  useEffect(() => {
    addTab({
      id: '/dashboard/live/room-backgrounds',
      label: 'Room background cover',
      path: '/dashboard/live/room-backgrounds',
      breadcrumbs: ['Home', 'Live Management', 'Room Configuration', 'Room background cover'],
    });
  }, [addTab]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, page, rowsPerPage]);

  const handleAdd = () => {
    setEditing(null);
    setForm({ title: '', imageUrl: 'https://picsum.photos/80/60', status: 'Valid', sort: data.length > 0 ? Math.max(...data.map((r) => r.sort), 0) + 1 : 1 });
    setEditOpen(true);
  };

  const handleEdit = (row: RoomBackground) => {
    setEditing(row);
    setForm({ title: row.title, imageUrl: row.imageUrl, status: row.status, sort: row.sort });
    setEditOpen(true);
  };

  const handleDelete = (row: RoomBackground) => {
    if (confirm(`Delete "${row.title}"?`)) {
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
        { id: nextNum, number: nextNum, ...form } as RoomBackground,
      ]);
    }
    setEditOpen(false);
  };

  return (
    <Box>
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
          <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
            Add
          </Button>
        </Box>
        <TableContainer sx={{ maxHeight: 520, overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>Number</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 80 }}>Sort</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 140 }} align="right">
                  Operation
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>
                    <Box sx={{ width: 56, height: 42, position: 'relative', borderRadius: 1, overflow: 'hidden' }}>
                      <Image
                        src={row.imageUrl}
                        alt={row.title}
                        fill
                        sizes="56px"
                        style={{ objectFit: 'cover' }}
                        unoptimized
                      />
                    </Box>
                  </TableCell>
                  <TableCell>{row.status}</TableCell>
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
        </TableContainer>
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
        <DialogTitle>{editing ? 'Edit' : 'Add'} Room Background</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            fullWidth
            required
          />
          <ImageUpload
            label="Image"
            value={form.imageUrl}
            onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={form.status}
              label="Status"
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            >
              <MenuItem value="Valid">Valid</MenuItem>
              <MenuItem value="Invalid">Invalid</MenuItem>
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
