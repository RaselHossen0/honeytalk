'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import type { LiveCategory } from '@/types/category';
import { fetchCategories, deleteCategory, updateCategory, createCategory } from '@/services/category';

export default function CategoryManagementPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<LiveCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    categoryName: '',
    name: '',
    status: 'Valid' as 'Valid' | 'Invalid',
    sort: 0,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchCategories();
      setData(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    addTab({
      id: '/dashboard/live/categories',
      label: 'Category Management',
      path: '/dashboard/live/categories',
      breadcrumbs: ['Home', 'Live Management', 'Category Management'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected(data.map((r) => r.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category?')) return;
    await deleteCategory(id);
    setData((prev) => prev.filter((r) => r.id !== id));
    setSelected((prev) => prev.filter((x) => x !== id));
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0 || !confirm(`Delete ${selected.length} selected category(ies)?`)) return;
    await Promise.all(selected.map((id) => deleteCategory(id)));
    setData((prev) => prev.filter((r) => !selected.includes(r.id)));
    setSelected([]);
  };

  const handleEdit = (row: LiveCategory) => {
    setEditingId(row.id);
    setForm({
      categoryName: row.categoryName,
      name: row.name ?? '',
      status: row.status,
      sort: row.sort,
    });
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setForm({
      categoryName: '',
      name: '',
      status: 'Valid',
      sort: data.length > 0 ? Math.max(...data.map((r) => r.sort)) + 1 : 1,
    });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingId(null);
  };

  const handleDialogConfirm = async () => {
    if (!form.categoryName.trim()) return;
    if (editingId) {
      await updateCategory(editingId, {
        categoryName: form.categoryName.trim(),
        name: form.name.trim() || undefined,
        status: form.status,
        sort: form.sort,
      });
      setData((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? { ...r, categoryName: form.categoryName.trim(), name: form.name.trim() || undefined, status: form.status, sort: form.sort }
            : r
        )
      );
    } else {
      const created = await createCategory({
        categoryName: form.categoryName.trim(),
        name: form.name.trim() || undefined,
        status: form.status,
        sort: form.sort,
      });
      setData((prev) => [...prev, created].sort((a, b) => a.sort - b.sort));
    }
    handleDialogClose();
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
              <TableCell sx={{ fontWeight: 600 }}>Category name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sort</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(row.id)}
                      onChange={() => handleSelectOne(row.id)}
                    />
                  </TableCell>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.categoryName}</TableCell>
                  <TableCell>
                    <Box
                      component="span"
                      sx={{
                        color: row.status === 'Valid' ? 'primary.main' : 'text.secondary',
                        fontWeight: 500,
                      }}
                    >
                      {row.status}
                    </Box>
                  </TableCell>
                  <TableCell>{row.sort}</TableCell>
                  <TableCell sx={{ width: 56 }}>
                    <OperationButton
                      items={[{ label: 'Edit', onClick: () => handleEdit(row), icon: <Edit fontSize="small" /> }]}
                      dangerItems={[{ label: 'Delete', onClick: () => handleDelete(row.id), icon: <Delete fontSize="small" /> }]}
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
            alignItems: 'center',
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<Delete />}
            onClick={handleBulkDelete}
            disabled={selected.length === 0}
          >
            Delete
          </Button>
        </Box>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
          {editingId ? 'Edit' : 'Add'}
          <IconButton size="small" onClick={handleDialogClose} aria-label="Close">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Category"
              required
              fullWidth
              value={form.categoryName}
              onChange={(e) => setForm((p) => ({ ...p, categoryName: e.target.value }))}
              placeholder="e.g. Sing"
              variant="outlined"
            />
            <TextField
              label="name"
              fullWidth
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Optional name"
              variant="outlined"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Status
              </Typography>
              <ToggleButtonGroup
                value={form.status}
                exclusive
                onChange={(_, v) => v != null && setForm((p) => ({ ...p, status: v }))}
                size="small"
                sx={{ alignSelf: 'flex-start' }}
              >
                <ToggleButton value="Valid" sx={{ px: 2 }}>
                  Valid
                </ToggleButton>
                <ToggleButton value="Invalid" sx={{ px: 2 }}>
                  Invalid
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <TextField
              label="Sort"
              required
              type="number"
              fullWidth
              value={form.sort}
              onChange={(e) => setForm((p) => ({ ...p, sort: Number(e.target.value) || 0 }))}
              inputProps={{ min: 0 }}
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button variant="outlined" color="inherit" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDialogConfirm}
            disabled={!form.categoryName.trim()}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
