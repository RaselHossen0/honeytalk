'use client';

import { useState, useMemo, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Search, Add, Edit, Delete, Clear } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import { ImageUpload } from '@/components/common/ImageUpload';
import type { Country } from '@/types/country';
import { demoCountries } from '@/lib/demo-data';

export default function CountryPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'all' | 'yes' | 'no'>('all');
  const [data, setData] = useState<Country[]>(demoCountries);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Country | null>(null);
  const [form, setForm] = useState({ name: '', imageUrl: '', countryCode: 0, displaySearch: true, sort: 0 });

  useEffect(() => {
    addTab({
      id: '/dashboard/system/country',
      label: 'country',
      path: '/dashboard/system/country',
      breadcrumbs: ['Home', 'System Management', 'country'],
    });
  }, [addTab]);

  const filtered = useMemo(() => {
    let result = [...data];
    if (name.trim()) {
      const k = name.toLowerCase();
      result = result.filter((r) => r.name.toLowerCase().includes(k));
    }
    if (status === 'yes') result = result.filter((r) => r.displaySearch);
    if (status === 'no') result = result.filter((r) => !r.displaySearch);
    return result;
  }, [data, name, status]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setName('');
    setStatus('all');
    setPage(0);
  };

  const handleAdd = () => {
    setEditing(null);
    setForm({ name: '', imageUrl: '', countryCode: 0, displaySearch: true, sort: 0 });
    setEditOpen(true);
  };

  const handleEdit = (row: Country) => {
    setEditing(row);
    setForm({
      name: row.name,
      imageUrl: row.imageUrl,
      countryCode: row.countryCode,
      displaySearch: row.displaySearch,
      sort: row.sort,
    });
    setEditOpen(true);
  };

  const handleDelete = (row: Country) => {
    if (confirm(`Delete "${row.name}"?`)) {
      setData((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  const handleSave = () => {
    if (editing) {
      setData((prev) =>
        prev.map((r) => (r.id === editing.id ? { ...r, ...form } : r))
      );
    } else {
      const nextNum = Math.max(...data.map((r) => r.number), 0) + 1;
      setData((prev) => [
        ...prev,
        { id: nextNum, number: nextNum, addTime: new Date().toISOString().slice(0, 19).replace('T', ' '), ...form } as Country,
      ]);
    }
    setEditOpen(false);
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Name"
            placeholder="Search by country name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
            sx={{ minWidth: 180 }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value as typeof status)}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="yes">Display search: Yes</MenuItem>
              <MenuItem value="no">Display search: No</MenuItem>
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

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        <TableContainer sx={{ maxHeight: 520 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 80 }}>Number</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 120 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 70 }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 180 }}>country</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 120 }}>Display search</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 80 }}>Sort</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 160 }}>Add Time</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 120 }} align="right">
                  Operation
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    <Box sx={{ width: 32, height: 24, position: 'relative', borderRadius: 0.5, overflow: 'hidden' }}>
                      <img src={row.imageUrl} alt={row.name} width={32} height={24} style={{ objectFit: 'cover' }} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    {row.name} ({row.countryCode})
                  </TableCell>
                  <TableCell>{row.displaySearch ? 'Yes' : 'No'}</TableCell>
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
      </Paper>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit' : 'Add'} Country</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            fullWidth
            required
          />
          <ImageUpload
            label="Flag image"
            value={form.imageUrl}
            onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
            helperText="Upload country flag (e.g. from flagcdn.com or upload from device)"
          />
          <TextField
            label="Country Code"
            type="number"
            value={form.countryCode || ''}
            onChange={(e) => setForm((f) => ({ ...f, countryCode: parseInt(e.target.value, 10) || 0 }))}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Display search</InputLabel>
            <Select
              value={form.displaySearch ? 'yes' : 'no'}
              label="Display search"
              onChange={(e) => setForm((f) => ({ ...f, displaySearch: e.target.value === 'yes' }))}
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
          </FormControl>
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
