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
  Pagination,
  Typography,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import type { ArticleCategory, ArticleCategoryPayload, ArticleType } from '@/types/article-category';
import {
  fetchArticleCategories,
  createArticleCategory,
  updateArticleCategory,
  deleteArticleCategory,
  batchDeleteArticleCategories,
} from '@/services/article-category';

const ARTICLE_TYPES: ArticleType[] = ['Regular article', 'Announcement article', 'News announcement'];

export default function CategoryManagementListPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<ArticleCategory[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ArticleCategoryPayload>({
    categoryName: '',
    articleType: 'Regular article',
    status: 'Valid',
    sort: 0,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchArticleCategories(page + 1, perPage);
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage]);

  useEffect(() => {
    addTab({
      id: '/dashboard/article/categories',
      label: 'Category Management List',
      path: '/dashboard/article/categories',
      breadcrumbs: ['Home', 'Article Management', 'Category Management List'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = () => {
    setEditingId(null);
    setForm({ categoryName: '', articleType: 'Regular article', status: 'Valid', sort: 0 });
    setDialogOpen(true);
  };

  const handleEdit = (row: ArticleCategory) => {
    setEditingId(row.id);
    setForm({
      categoryName: row.categoryName,
      articleType: row.articleType,
      status: row.status,
      sort: row.sort,
    });
    setDialogOpen(true);
  };

  const handleDialogConfirm = async () => {
    if (editingId) {
      await updateArticleCategory(editingId, form);
    } else {
      await createArticleCategory(form);
    }
    setDialogOpen(false);
    load();
  };

  const handleDelete = async (row: ArticleCategory) => {
    if (!confirm(`Delete "${row.categoryName}"?`)) return;
    await deleteArticleCategory(row.id);
    load();
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.checked ? data.map((r) => r.id) : []);
  };

  const handleSelectOne = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleBatchDelete = async () => {
    if (selected.length === 0) return;
    if (!confirm(`Delete ${selected.length} selected?`)) return;
    await batchDeleteArticleCategories(selected);
    setSelected([]);
    load();
  };

  const totalPages = Math.ceil(total / perPage) || 1;
  const allSelected = data.length > 0 && selected.length === data.length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
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
                  checked={allSelected}
                  indeterminate={selected.length > 0 && selected.length < data.length}
                  onChange={handleSelectAll}
                  size="small"
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Article Type</TableCell>
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
                  <TableCell padding="checkbox">
                    <Checkbox checked={selected.includes(row.id)} onChange={() => handleSelectOne(row.id)} size="small" />
                  </TableCell>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>
                    <Typography
                      component="a"
                      href="#"
                      variant="body2"
                      color="primary"
                      sx={{ cursor: 'pointer', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleEdit(row);
                      }}
                    >
                      {row.categoryName}
                    </Typography>
                  </TableCell>
                  <TableCell>{row.articleType}</TableCell>
                  <TableCell>
                    <Box
                      component="span"
                      sx={{
                        color: row.status === 'Valid' ? 'primary.main' : 'error.main',
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
                      dangerItems={[{ label: 'Delete', onClick: () => handleDelete(row), icon: <Delete fontSize="small" /> }]}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {selected.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleBatchDelete}>
              Delete ({selected.length})
            </Button>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, p: 2, borderTop: 1, borderColor: 'divider' }}>
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Go to
            </Typography>
            <TextField
              size="small"
              type="number"
              value={page + 1}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!isNaN(v) && v >= 1 && v <= totalPages) setPage(v - 1);
              }}
              inputProps={{ min: 1, max: totalPages }}
              sx={{ width: 60 }}
            />
          </Box>
        </Box>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editingId ? 'Edit Category' : 'Add Category'}
          <IconButton size="small" onClick={() => setDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              label="Category name"
              value={form.categoryName}
              onChange={(e) => setForm((p) => ({ ...p, categoryName: e.target.value }))}
              placeholder="e.g. Withdrawal agreement"
            />
            <FormControl fullWidth>
              <Box component="label" sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5, display: 'block' }}>
                Article Type
              </Box>
              <Select
                value={form.articleType}
                onChange={(e) => setForm((p) => ({ ...p, articleType: e.target.value as ArticleType }))}
                size="small"
                sx={{ mt: 0 }}
              >
                {ARTICLE_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              type="number"
              label="Sort"
              value={form.sort ?? 0}
              onChange={(e) => setForm((p) => ({ ...p, sort: parseInt(e.target.value, 10) || 0 }))}
              inputProps={{ min: 0 }}
            />
            {editingId && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button size="small" variant={form.status === 'Valid' ? 'contained' : 'outlined'} onClick={() => setForm((p) => ({ ...p, status: 'Valid' }))}>
                  Valid
                </Button>
                <Button
                  size="small"
                  variant={form.status === 'Invalid' ? 'contained' : 'outlined'}
                  color="error"
                  onClick={() => setForm((p) => ({ ...p, status: 'Invalid' }))}
                >
                  Invalid
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleDialogConfirm} disabled={!form.categoryName.trim()}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
