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
import type { CarPrice } from '@/types/car';
import { demoCarPrices } from '@/lib/demo-data';

export default function CarPricesPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<CarPrice[]>(demoCarPrices);
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<CarPrice | null>(null);
  const [form, setForm] = useState<{ vehicleName: string; diamond: number; days: string; points: number; sort: number; status: 'Valid' | 'Invalid' }>({ vehicleName: '', diamond: 0, days: '', points: 0, sort: 0, status: 'Valid' });

  useEffect(() => {
    addTab({
      id: '/dashboard/cars/prices',
      label: 'Price configuration',
      path: '/dashboard/cars/prices',
      breadcrumbs: ['Home', 'Prop Management', 'Car Management', 'Price configuration'],
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
      diamond: 1000,
      days: '7 Days',
      points: 0,
      sort: data.length > 0 ? Math.max(...data.map((r) => r.sort), 0) + 1 : 1,
      status: 'Valid',
    });
    setEditOpen(true);
  };

  const handleEdit = (row: CarPrice) => {
    setEditing(row);
    setForm({
      vehicleName: row.vehicleName,
      diamond: row.diamond,
      days: row.days,
      points: row.points,
      sort: row.sort,
      status: row.status,
    });
    setEditOpen(true);
  };

  const handleDelete = (row: CarPrice) => {
    if (confirm(`Delete "${row.vehicleName}"?`)) {
      setData((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    if (confirm(`Delete ${selected.length} price configuration(s)?`)) {
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
        { id: nextNum, number: nextNum, ...form } as CarPrice,
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
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 100 }}>Diamond</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 100 }}>Days</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 90 }}>Points</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 80 }}>Sort</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 90 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 140 }} align="right">Operation</TableCell>
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
                  <TableCell>{row.diamond}</TableCell>
                  <TableCell>{row.days}</TableCell>
                  <TableCell>{row.points}</TableCell>
                  <TableCell>{row.sort}</TableCell>
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
        <DialogTitle>{editing ? 'Edit' : 'Add'} Price Configuration</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Vehicle name"
            value={form.vehicleName}
            onChange={(e) => setForm((f) => ({ ...f, vehicleName: e.target.value }))}
            fullWidth
            required
          />
          <TextField
            label="Diamond"
            type="number"
            value={form.diamond}
            onChange={(e) => setForm((f) => ({ ...f, diamond: parseInt(e.target.value, 10) || 0 }))}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Days</InputLabel>
            <Select value={form.days} label="Days" onChange={(e) => setForm((f) => ({ ...f, days: e.target.value }))}>
              <MenuItem value="7 Days">7 Days</MenuItem>
              <MenuItem value="30 Days">30 Days</MenuItem>
              <MenuItem value="1 Month">1 Month</MenuItem>
              <MenuItem value="3 Month">3 Month</MenuItem>
              <MenuItem value="6 Month">6 Month</MenuItem>
              <MenuItem value="9 Month">9 Month</MenuItem>
              <MenuItem value="12 Month">12 Month</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Points"
            type="number"
            value={form.points}
            onChange={(e) => setForm((f) => ({ ...f, points: parseInt(e.target.value, 10) || 0 }))}
            fullWidth
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
            <Select value={form.status} label="Status" onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as 'Valid' | 'Invalid' }))}>
              <MenuItem value="Valid">Valid</MenuItem>
              <MenuItem value="Invalid">Invalid</MenuItem>
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
