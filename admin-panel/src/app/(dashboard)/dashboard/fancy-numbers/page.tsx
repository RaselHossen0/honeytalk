'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Pagination,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { Add, Edit, Delete, Search, Close, Recycling, Sell } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import type { FancyNumber, FancyNumberPayload } from '@/types/fancy-number';
import type { FancyNumberFilters } from '@/types/fancy-number';
import {
  fetchFancyNumbers,
  createFancyNumber,
  updateFancyNumber,
  deleteFancyNumber,
  recycleFancyNumber,
  sellFancyNumber,
} from '@/services/fancy-number';

export default function FancyNumbersPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<FancyNumber[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FancyNumberFilters>({
    fancyNumberId: '',
    userNickname: '',
    userId: '',
    uid: '',
    purchased: 'all',
    type: 'all',
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FancyNumberPayload>({
    fancyNumber: '',
    price: 0,
    type: 'Ordinary',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const hasFilters = Object.values(filters).some(
        (v) => v && v !== 'all'
      );
      const res = await fetchFancyNumbers(
        hasFilters ? filters : undefined,
        page + 1,
        perPage
      );
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filters]);

  useEffect(() => {
    addTab({
      id: '/dashboard/fancy-numbers',
      label: 'Fancy Number Management',
      path: '/dashboard/fancy-numbers',
      breadcrumbs: ['Home', 'Prop management', 'Fancy Number Management', 'Fancy Number Management'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({
      fancyNumberId: '',
      userNickname: '',
      userId: '',
      uid: '',
      purchased: 'all',
      type: 'all',
    });
    setPage(0);
  };

  const handleAdd = () => {
    setEditingId(null);
    setForm({ fancyNumber: '', price: 0, type: 'Ordinary' });
    setDialogOpen(true);
  };

  const handleEdit = (row: FancyNumber) => {
    setEditingId(row.id);
    setForm({
      fancyNumber: row.fancyNumber,
      price: row.price,
      type: row.type,
    });
    setDialogOpen(true);
  };

  const handleDialogConfirm = async () => {
    if (editingId) {
      await updateFancyNumber(editingId, form);
      setData((prev) =>
        prev.map((r) => (r.id === editingId ? { ...r, ...form } : r))
      );
    } else {
      await createFancyNumber(form);
      load();
    }
    setDialogOpen(false);
  };

  const handleDelete = async (row: FancyNumber) => {
    if (!confirm(`Delete fancy number "${row.fancyNumber}"?`)) return;
    await deleteFancyNumber(row.id);
    setData((prev) => prev.filter((r) => r.id !== row.id));
    setTotal((t) => Math.max(0, t - 1));
  };

  const handleRecycle = async (row: FancyNumber) => {
    await recycleFancyNumber(row.id);
    setData((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, purchased: false, userId: 0, anchorNickname: '-' } : r))
    );
  };

  const handleSell = async (row: FancyNumber) => {
    await sellFancyNumber(row.id);
    setData((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, purchased: true } : r))
    );
  };

  const totalPages = Math.ceil(total / perPage) || 1;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Add
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="Beautiful number ID"
            placeholder="Please enter"
            value={filters.fancyNumberId}
            onChange={(e) => setFilters((p) => ({ ...p, fancyNumberId: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="User nickname"
            placeholder="Please enter user nickname"
            value={filters.userNickname}
            onChange={(e) => setFilters((p) => ({ ...p, userNickname: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="User ID"
            placeholder="Please enter"
            value={filters.userId}
            onChange={(e) => setFilters((p) => ({ ...p, userId: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="UID"
            placeholder="Please enter"
            value={filters.uid}
            onChange={(e) => setFilters((p) => ({ ...p, uid: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <FormControl size="small" fullWidth>
            <InputLabel>Whether it has been purchased</InputLabel>
            <Select
              value={filters.purchased}
              label="Whether it has been purchased"
              onChange={(e) => setFilters((p) => ({ ...p, purchased: e.target.value }))}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <FormControl size="small" fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={filters.type}
              label="Type"
              onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Ordinary">Ordinary</MenuItem>
              <MenuItem value="Noble">Noble</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
          Query
        </Button>
        <Button variant="outlined" color="error" onClick={handleClear}>
          Clear conditions
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600 }}>Fancy number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>User ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Anchor Nickname</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Whether it has been purchased</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Price</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell>{row.fancyNumber}</TableCell>
                  <TableCell>{row.userId || '-'}</TableCell>
                  <TableCell>{row.anchorNickname}</TableCell>
                  <TableCell>{row.purchased ? 'Yes' : 'No'}</TableCell>
                  <TableCell align="right">{row.price}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell sx={{ width: 56 }}>
                    <OperationButton
                      items={[
                        ...(row.purchased ? [{ label: 'Recycle', onClick: () => handleRecycle(row), icon: <Recycling fontSize="small" /> }] : [{ label: 'Sell', onClick: () => handleSell(row), icon: <Sell fontSize="small" /> }]),
                        { label: 'Edit', onClick: () => handleEdit(row), icon: <Edit fontSize="small" /> },
                      ]}
                      dangerItems={[{ label: 'Delete', onClick: () => handleDelete(row), icon: <Delete fontSize="small" /> }]}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 2,
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Total {total}
          </Typography>
          <FormControl size="small" sx={{ minWidth: 90 }}>
            <Select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(0);
              }}
              sx={{ height: 32, fontSize: 13 }}
            >
              <MenuItem value={5}>5/page</MenuItem>
              <MenuItem value={10}>10/page</MenuItem>
              <MenuItem value={25}>25/page</MenuItem>
              <MenuItem value={50}>50/page</MenuItem>
            </Select>
          </FormControl>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(_, p) => setPage(p - 1)}
            color="primary"
            size="small"
            showFirstButton
            showLastButton
          />
        </Box>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editingId ? 'Edit Fancy Number' : 'Add Fancy Number'}
          <IconButton size="small" onClick={() => setDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              label="Fancy number"
              value={form.fancyNumber}
              onChange={(e) => setForm((p) => ({ ...p, fancyNumber: e.target.value }))}
              placeholder="e.g. 33334444"
              disabled={!!editingId}
            />
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) || 0 }))}
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={form.type}
                label="Type"
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as 'Ordinary' | 'Noble' }))}
              >
                <MenuItem value="Ordinary">Ordinary</MenuItem>
                <MenuItem value="Noble">Noble</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleDialogConfirm} disabled={!form.fancyNumber.trim()}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
