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
import { Add, Edit, Delete, Search, Close } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import { ImageUpload } from '@/components/common/ImageUpload';
import type { Emoji, EmojiPayload } from '@/types/emoji';
import type { EmojiFilters } from '@/types/emoji';
import {
  fetchEmojis,
  createEmoji,
  updateEmoji,
  deleteEmoji,
  getEmojiCategories,
} from '@/services/emoji';

export default function EmojiListPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<Emoji[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState<EmojiFilters>({
    name: '',
    categoryName: 'all',
    status: 'all',
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<EmojiPayload>({
    name: '',
    imageUrl: '',
    categoryName: '',
    sort: 1,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const hasFilters =
        filters.name ||
        (filters.categoryName && filters.categoryName !== 'all') ||
        (filters.status && filters.status !== 'all');
      const res = await fetchEmojis(hasFilters ? filters : undefined, page + 1, perPage);
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filters]);

  const loadCategories = useCallback(async () => {
    const cats = await getEmojiCategories();
    setCategories(cats);
  }, []);

  useEffect(() => {
    addTab({
      id: '/dashboard/emoji/list',
      label: 'Emoji List',
      path: '/dashboard/emoji/list',
      breadcrumbs: ['Home', 'Prop management', 'Emoji management', 'Emoji List'],
    });
  }, [addTab]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    load();
  }, [load]);

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({ name: '', categoryName: 'all', status: 'all' });
    setPage(0);
  };

  const handleAdd = () => {
    setEditingId(null);
    setForm({
      name: '',
      imageUrl: '',
      categoryName: categories[0] ?? '',
      sort: 1,
    });
    setDialogOpen(true);
  };

  const handleEdit = (row: Emoji) => {
    setEditingId(row.id);
    setForm({
      name: row.name,
      imageUrl: row.imageUrl ?? '',
      categoryName: row.categoryName,
      sort: row.sort,
    });
    setDialogOpen(true);
  };

  const handleDialogConfirm = async () => {
    if (editingId) {
      await updateEmoji(editingId, form);
      setData((prev) =>
        prev.map((r) => (r.id === editingId ? { ...r, ...form } : r))
      );
    } else {
      const created = await createEmoji(form);
      setData((prev) => [...prev, created]);
      setTotal((t) => t + 1);
    }
    setDialogOpen(false);
  };

  const handleDelete = async (row: Emoji) => {
    if (!confirm(`Delete "${row.name}"?`)) return;
    await deleteEmoji(row.id);
    setData((prev) => prev.filter((r) => r.id !== row.id));
    setTotal((t) => Math.max(0, t - 1));
  };

  const totalPages = Math.ceil(total / perPage) || 1;

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="Name"
            placeholder="Please enter"
            value={filters.name}
            onChange={(e) => setFilters((p) => ({ ...p, name: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <FormControl size="small" fullWidth>
            <InputLabel>Category name</InputLabel>
            <Select
              value={filters.categoryName}
              label="Category name"
              onChange={(e) => setFilters((p) => ({ ...p, categoryName: e.target.value }))}
            >
              <MenuItem value="all">All</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <FormControl size="small" fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Unban">Unban</MenuItem>
              <MenuItem value="Ban">Ban</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
          Q Query
        </Button>
        <Button variant="outlined" color="error" onClick={handleClear}>
          Clear conditions
        </Button>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd} sx={{ ml: 'auto' }}>
          + Add
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sort</TableCell>
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
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    {row.imageUrl ? (
                      <Box component="img" src={row.imageUrl} alt="" sx={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 1 }} />
                    ) : (
                      <Box sx={{ width: 36, height: 36, bgcolor: 'grey.300', borderRadius: 1 }} />
                    )}
                  </TableCell>
                  <TableCell>{row.categoryName}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.sort}</TableCell>
                  <TableCell sx={{ width: 56 }}>
                    <OperationButton
                      items={[{ label: 'Edit', onClick: () => handleEdit(row), icon: <Edit fontSize="small" /> }]}
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
          {editingId ? 'Edit Emoji' : 'Add Emoji'}
          <IconButton size="small" onClick={() => setDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField fullWidth label="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Slot-machine" />
            <ImageUpload label="Image" value={form.imageUrl} onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))} />
            <FormControl fullWidth>
              <InputLabel>Category name</InputLabel>
              <Select
                value={form.categoryName}
                label="Category name"
                onChange={(e) => setForm((p) => ({ ...p, categoryName: e.target.value }))}
              >
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField fullWidth label="Sort" type="number" value={form.sort} onChange={(e) => setForm((p) => ({ ...p, sort: Number(e.target.value) || 0 }))} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleDialogConfirm} disabled={!form.name.trim() || !form.categoryName}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
