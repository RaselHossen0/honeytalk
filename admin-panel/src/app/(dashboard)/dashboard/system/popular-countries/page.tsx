'use client';

import { useState, useMemo, useEffect } from 'react';
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import { ImageUpload } from '@/components/common/ImageUpload';
import type { PopularCountry } from '@/types/popular-country';
import { demoPopularCountries } from '@/lib/demo-data';

export default function PopularCountriesPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<PopularCountry[]>(demoPopularCountries);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<PopularCountry | null>(null);
  const [form, setForm] = useState({ groupName: '', imageUrls: [''] as string[], sort: 0 });

  useEffect(() => {
    addTab({
      id: '/dashboard/system/popular-countries',
      label: 'Popular countries',
      path: '/dashboard/system/popular-countries',
      breadcrumbs: ['Home', 'System Management', 'Popular countries'],
    });
  }, [addTab]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, page, rowsPerPage]);

  const handleAdd = () => {
    setEditing(null);
    setForm({ groupName: '', imageUrls: [''], sort: 0 });
    setEditOpen(true);
  };

  const handleEdit = (row: PopularCountry) => {
    setEditing(row);
    setForm({
      groupName: row.groupName,
      imageUrls: row.imageUrls.length ? row.imageUrls : [''],
      sort: row.sort,
    });
    setEditOpen(true);
  };

  const handleDelete = (row: PopularCountry) => {
    if (confirm(`Delete "${row.groupName}"?`)) {
      setData((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  const handleSave = () => {
    const urls = form.imageUrls.filter(Boolean);
    if (editing) {
      setData((prev) =>
        prev.map((r) =>
          r.id === editing.id ? { ...r, groupName: form.groupName, imageUrls: urls, sort: form.sort } : r
        )
      );
    } else {
      const nextNum = Math.max(...data.map((r) => r.number), 0) + 1;
      setData((prev) => [
        ...prev,
        {
          id: nextNum,
          number: nextNum,
          groupName: form.groupName,
          imageUrls: urls,
          sort: form.sort,
          addTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        } as PopularCountry,
      ]);
    }
    setEditOpen(false);
  };

  const addImageUrl = () => setForm((f) => ({ ...f, imageUrls: [...f.imageUrls, ''] }));
  const updateImageUrl = (i: number, v: string) => {
    setForm((f) => ({
      ...f,
      imageUrls: f.imageUrls.map((url, idx) => (idx === i ? v : url)),
    }));
  };
  const removeImageUrl = (i: number) => {
    setForm((f) => ({ ...f, imageUrls: f.imageUrls.filter((_, idx) => idx !== i) }));
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Add
        </Button>
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        <TableContainer sx={{ maxHeight: 520 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 80 }}>Number</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 140 }}>Group name</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 180 }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 80 }}>Sort</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 170 }}>Add Time</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 120 }} align="right">
                  Operation
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.groupName}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {row.imageUrls.map((url, i) => (
                        <Box
                          key={i}
                          sx={{
                            width: 32,
                            height: 24,
                            borderRadius: 0.5,
                            overflow: 'hidden',
                            flexShrink: 0,
                          }}
                        >
                          <img src={url} alt="" width={32} height={24} style={{ objectFit: 'cover' }} />
                        </Box>
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>{row.sort}</TableCell>
                  <TableCell>{row.addTime}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary" onClick={() => handleEdit(row)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(row)}>
                      <Delete fontSize="small" />
                    </IconButton>
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
        <DialogTitle>{editing ? 'Edit' : 'Add'} Popular country</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Group name"
            value={form.groupName}
            onChange={(e) => setForm((f) => ({ ...f, groupName: e.target.value }))}
            fullWidth
            required
            placeholder="e.g. India, Bangladesh, or all"
          />
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box component="span" sx={{ fontSize: 14, color: 'text.secondary' }}>
                Flag images (upload one per country)
              </Box>
              <Button size="small" onClick={addImageUrl}>
                + Add image
              </Button>
            </Box>
            {form.imageUrls.map((url, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <ImageUpload
                    value={url}
                    onChange={(newUrl) => updateImageUrl(i, newUrl)}
                    helperText={i === 0 ? undefined : ''}
                    label={form.imageUrls.length > 1 ? `Flag ${i + 1}` : 'Flag'}
                  />
                </Box>
                <IconButton size="small" color="error" onClick={() => removeImageUrl(i)} disabled={form.imageUrls.length <= 1} sx={{ mt: 2 }}>
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
          <TextField
            label="Sort"
            type="number"
            value={form.sort || ''}
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
