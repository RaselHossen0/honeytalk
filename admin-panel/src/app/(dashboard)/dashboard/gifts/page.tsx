'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
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
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add, Edit, Delete, Search, Clear } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import { ImageUpload } from '@/components/common/ImageUpload';
import type { Gift } from '@/types/gift';
import { demoGifts } from '@/lib/demo-data';

export default function GiftListPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<Gift[]>(demoGifts);
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Gift | null>(null);
  const [form, setForm] = useState({
    name: '',
    imageUrl: '',
    points: 0,
    diamond: 0,
    coin: 0,
    pushToAllChannels: 'No' as 'Yes' | 'No',
    type: 'ordinary gift',
    displayAnimation: 'SVGA Gift',
    status: 'Valid',
    sort: 100,
  });
  const [filters, setFilters] = useState({ name: '', displayAnimation: '', type: '' });

  useEffect(() => {
    addTab({
      id: '/dashboard/gifts',
      label: 'Gift List',
      path: '/dashboard/gifts',
      breadcrumbs: ['Home', 'Prop management', 'Gift Management', 'Gift List'],
    });
  }, [addTab]);

  const filtered = useMemo(() => {
    let result = [...data];
    if (filters.name.trim()) {
      const k = filters.name.toLowerCase();
      result = result.filter((r) => r.name.toLowerCase().includes(k));
    }
    if (filters.displayAnimation) {
      result = result.filter((r) => r.displayAnimation === filters.displayAnimation);
    }
    if (filters.type) {
      result = result.filter((r) => r.type === filters.type);
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
      imageUrl: 'https://picsum.photos/48/48',
      points: 10,
      diamond: 10,
      coin: 1,
      pushToAllChannels: 'No',
      type: 'ordinary gift',
      displayAnimation: 'SVGA Gift',
      status: 'Valid',
      sort: 100,
    });
    setEditOpen(true);
  };

  const handleEdit = (row: Gift) => {
    setEditing(row);
    setForm({
      name: row.name,
      imageUrl: row.imageUrl,
      points: row.points,
      diamond: row.diamond,
      coin: row.coin,
      pushToAllChannels: row.pushToAllChannels,
      type: row.type,
      displayAnimation: row.displayAnimation,
      status: row.status,
      sort: row.sort,
    });
    setEditOpen(true);
  };

  const handleDelete = (row: Gift) => {
    if (confirm(`Delete "${row.name}"?`)) {
      setData((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    if (confirm(`Delete ${selected.length} gift(s)?`)) {
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
      setData((prev) => [...prev, { id: nextNum, number: nextNum, ...form } as Gift]);
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

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({ name: '', displayAnimation: '', type: '' });
    setPage(0);
  };

  const stickyFirst = {
    position: 'sticky' as const,
    left: 0,
    zIndex: 3,
    minWidth: 48,
    width: 48,
    bgcolor: 'grey.50',
    boxShadow: '2px 0 4px -2px rgba(0,0,0,0.08)',
  };
  const stickyNumber = {
    position: 'sticky' as const,
    left: 48,
    zIndex: 3,
    minWidth: 80,
    width: 80,
    bgcolor: 'grey.50',
    boxShadow: '2px 0 4px -2px rgba(0,0,0,0.08)',
  };
  const stickyLast = {
    position: 'sticky' as const,
    right: 0,
    zIndex: 3,
    minWidth: 100,
    width: 100,
    bgcolor: 'grey.50',
    boxShadow: '-2px 0 4px -2px rgba(0,0,0,0.08)',
  };
  const stickyFirstBody = (bg: string) => ({ ...stickyFirst, zIndex: 2, bgcolor: bg });
  const stickyNumberBody = (bg: string) => ({ ...stickyNumber, zIndex: 2, bgcolor: bg });
  const stickyLastBody = (bg: string) => ({ ...stickyLast, zIndex: 2, bgcolor: bg });

  const types = Array.from(new Set(data.map((r) => r.type)));
  const animations = Array.from(new Set(data.map((r) => r.displayAnimation)));

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
          <Button variant="contained" startIcon={<Add />} onClick={handleAdd} sx={{ mr: 2 }}>
            Add
          </Button>
          <TextField
            size="small"
            label="Name"
            placeholder="Please enter a name"
            value={filters.name}
            onChange={(e) => setFilters((p) => ({ ...p, name: e.target.value }))}
            sx={{ minWidth: 180 }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Display animation</InputLabel>
            <Select
              value={filters.displayAnimation}
              label="Display animation"
              onChange={(e) => setFilters((p) => ({ ...p, displayAnimation: e.target.value }))}
            >
              <MenuItem value="">All</MenuItem>
              {animations.map((a) => (
                <MenuItem key={a} value={a}>{a}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={filters.type}
              label="Type"
              onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}
            >
              <MenuItem value="">Select</MenuItem>
              {types.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
            Query
          </Button>
          <Button variant="outlined" color="error" startIcon={<Clear />} onClick={handleClear}>
            Clear conditions
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        <TableContainer sx={{ maxHeight: 520, overflowX: 'auto', overflowY: 'auto', width: '100%' }}>
          <Table size="small" stickyHeader sx={{ minWidth: 1400 }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ ...stickyFirst, bgcolor: 'grey.50' }}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < paginatedRows.length}
                    checked={paginatedRows.length > 0 && selected.length === paginatedRows.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell sx={{ ...stickyNumber, fontWeight: 600, bgcolor: 'grey.50' }}>Number</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 120 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 70 }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 80 }}>Points</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 80 }}>Diamond</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 90 }}>Coin</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 160 }}>Whether to push to all channels</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 110 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 120 }}>Display animation</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 80 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 70 }}>Sort</TableCell>
                <TableCell sx={{ ...stickyLast, fontWeight: 600, bgcolor: 'grey.50' }} align="right">Operation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row, index) => (
                <TableRow key={row.id} hover selected={selected.includes(row.id)} sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell padding="checkbox" sx={stickyFirstBody(index % 2 === 1 ? 'grey.50' : 'background.paper')}>
                    <Checkbox checked={selected.includes(row.id)} onChange={() => handleSelectOne(row.id)} />
                  </TableCell>
                  <TableCell sx={stickyNumberBody(index % 2 === 1 ? 'grey.50' : 'background.paper')}>
                    {row.number}
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    <Box sx={{ width: 40, height: 40, position: 'relative', borderRadius: 1, overflow: 'hidden' }}>
                      <Image src={row.imageUrl} alt={row.name} fill sizes="40px" style={{ objectFit: 'cover' }} unoptimized />
                    </Box>
                  </TableCell>
                  <TableCell>{row.points}</TableCell>
                  <TableCell>{row.diamond}</TableCell>
                  <TableCell>{row.coin.toFixed(2)}</TableCell>
                  <TableCell>{row.pushToAllChannels}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.displayAnimation}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.sort}</TableCell>
                  <TableCell align="right" sx={{ ...stickyLastBody(index % 2 === 1 ? 'grey.50' : 'background.paper'), whiteSpace: 'nowrap' }}>
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
            <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleBulkDelete}>
              Delete ({selected.length} selected)
            </Button>
          </Box>
        )}
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
        <DialogTitle>{editing ? 'Edit' : 'Add'} Gift</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1, overflowY: 'auto', maxHeight: '70vh' }}>
          <TextField label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} fullWidth required />
          <ImageUpload label="Image" value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />
          <TextField label="Points" type="number" value={form.points} onChange={(e) => setForm((f) => ({ ...f, points: parseInt(e.target.value, 10) || 0 }))} fullWidth />
          <TextField label="Diamond" type="number" value={form.diamond} onChange={(e) => setForm((f) => ({ ...f, diamond: parseInt(e.target.value, 10) || 0 }))} fullWidth />
          <TextField label="Coin" type="number" value={form.coin} onChange={(e) => setForm((f) => ({ ...f, coin: parseFloat(e.target.value) || 0 }))} fullWidth />
          <FormControl fullWidth>
            <InputLabel>Whether to push to all channels</InputLabel>
            <Select value={form.pushToAllChannels} label="Whether to push to all channels" onChange={(e) => setForm((f) => ({ ...f, pushToAllChannels: e.target.value as 'Yes' | 'No' }))} MenuProps={{ sx: { zIndex: 1400 } }}>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select value={form.type} label="Type" onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} MenuProps={{ sx: { zIndex: 1400 } }}>
              <MenuItem value="ordinary gift">ordinary gift</MenuItem>
              <MenuItem value="Guardian Gift">Guardian Gift</MenuItem>
              <MenuItem value="Noble gift">Noble gift</MenuItem>
              <MenuItem value="Lucky gift">Lucky gift</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Display animation</InputLabel>
            <Select value={form.displayAnimation} label="Display animation" onChange={(e) => setForm((f) => ({ ...f, displayAnimation: e.target.value }))} MenuProps={{ sx: { zIndex: 1400 } }}>
              <MenuItem value="SVGA Gift">SVGA Gift</MenuItem>
              <MenuItem value="ordinary gift">ordinary gift</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={form.status} label="Status" onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} MenuProps={{ sx: { zIndex: 1400 } }}>
              <MenuItem value="Valid">Valid</MenuItem>
              <MenuItem value="Invalid">Invalid</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Sort" type="number" value={form.sort} onChange={(e) => setForm((f) => ({ ...f, sort: parseInt(e.target.value, 10) || 0 }))} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
