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
  Pagination,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { Add, Edit, Delete, Visibility, Close } from '@mui/icons-material';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { useTabsStore } from '@/store/tabs';
import type { Article, ArticlePayload } from '@/types/article';
import {
  fetchArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  batchDeleteArticles,
  fetchArticleCategoryOptions,
} from '@/services/article';

export default function ArticleManagementListPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState({ category: 'All', name: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ArticlePayload>({ articleTitle: '', category: '', content: '', status: 'Valid', sort: 0 });
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchArticles(page + 1, perPage, {
        category: filters.category === 'All' ? undefined : filters.category,
        name: filters.name || undefined,
      });
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filters.category, filters.name]);

  const loadCategories = useCallback(async () => {
    const names = await fetchArticleCategoryOptions();
    setCategories(['All', ...names]);
  }, []);

  useEffect(() => {
    addTab({
      id: '/dashboard/article/list',
      label: 'Article Management List',
      path: '/dashboard/article/list',
      breadcrumbs: ['Home', 'Article Management', 'Article Management List'],
    });
  }, [addTab]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    load();
  }, [load]);

  const handleQuery = () => load();

  const handleClearFilters = () => {
    setFilters({ category: 'All', name: '' });
    setPage(0);
  };

  const handleAdd = () => {
    setEditingId(null);
    const defaultCat = categories.find((c) => c !== 'All') ?? '';
    setForm({ articleTitle: '', category: defaultCat, content: '', status: 'Valid', sort: 0 });
    setDialogOpen(true);
  };

  const handleEdit = (row: Article) => {
    setEditingId(row.id);
    setForm({
      articleTitle: row.articleTitle,
      category: row.category,
      content: row.content ?? '',
      status: row.status,
      sort: row.sort,
    });
    setDialogOpen(true);
  };

  const handlePreview = (row: Article) => {
    setPreviewArticle(row);
    setPreviewOpen(true);
  };

  const handleDialogConfirm = async () => {
    if (editingId) {
      await updateArticle(editingId, form);
    } else {
      await createArticle(form);
    }
    setDialogOpen(false);
    load();
  };

  const handleDelete = async (row: Article) => {
    if (!confirm(`Delete "${row.articleTitle}"?`)) return;
    await deleteArticle(row.id);
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
    await batchDeleteArticles(selected);
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

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">Category:</Typography>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={filters.category}
              onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}
              sx={{ height: 36 }}
            >
              {categories.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">Name</Typography>
          <TextField
            size="small"
            placeholder="Please enter a name"
            value={filters.name}
            onChange={(e) => setFilters((p) => ({ ...p, name: e.target.value }))}
            sx={{ width: 200 }}
          />
        </Box>
        <Button variant="contained" onClick={handleQuery}>
          Query
        </Button>
        <Button variant="outlined" color="error" onClick={handleClearFilters}>
          Clear conditions
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
              <TableCell sx={{ fontWeight: 600 }}>Article title</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Creation time</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Update Time</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sort</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Click count</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
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
                      {row.articleTitle}
                    </Typography>
                  </TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>
                    <Box component="span" sx={{ color: row.status === 'Valid' ? 'success.main' : 'error.main', fontWeight: 500 }}>
                      {row.status}
                    </Box>
                  </TableCell>
                  <TableCell>{row.creationTime}</TableCell>
                  <TableCell>{row.updateTime}</TableCell>
                  <TableCell>{row.sort}</TableCell>
                  <TableCell>{row.clickCount}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Button size="small" variant="contained" color="primary" startIcon={<Edit fontSize="small" />} onClick={() => handleEdit(row)}>
                        Edit
                      </Button>
                      <Button size="small" variant="contained" color="success" startIcon={<Visibility fontSize="small" />} onClick={() => handlePreview(row)}>
                        Preview
                      </Button>
                      <Button size="small" variant="outlined" color="error" startIcon={<Delete fontSize="small" />} onClick={() => handleDelete(row)}>
                        Delete
                      </Button>
                    </Box>
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
            <Select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(0); }} sx={{ height: 32, fontSize: 13 }}>
              <MenuItem value={10}>10/page</MenuItem>
              <MenuItem value={25}>25/page</MenuItem>
              <MenuItem value={50}>50/page</MenuItem>
            </Select>
          </FormControl>
          <Pagination count={totalPages} page={page + 1} onChange={(_, p) => setPage(p - 1)} color="primary" size="small" />
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editingId ? 'Edit' : 'Add'}
          <IconButton size="small" onClick={() => setDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              required
              label="* Article title"
              value={form.articleTitle}
              onChange={(e) => setForm((p) => ({ ...p, articleTitle: e.target.value }))}
            />
            <TextField fullWidth type="number" label="Sort" value={form.sort ?? 0} onChange={(e) => setForm((p) => ({ ...p, sort: parseInt(e.target.value, 10) || 0 }))} />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={form.category} label="Category" onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
                {categories.filter((c) => c !== 'All').map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Status
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" variant={form.status === 'Valid' ? 'contained' : 'outlined'} onClick={() => setForm((p) => ({ ...p, status: 'Valid' }))}>
                  Valid
                </Button>
                <Button size="small" variant={form.status === 'Invalid' ? 'contained' : 'outlined'} color="error" onClick={() => setForm((p) => ({ ...p, status: 'Invalid' }))}>
                  Invalid
                </Button>
              </Box>
            </Box>
            <RichTextEditor
              label={`${form.category || 'Article'} Description`}
              value={form.content ?? ''}
              onChange={(content) => setForm((p) => ({ ...p, content }))}
              minHeight={320}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleDialogConfirm} disabled={!form.articleTitle.trim()}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Preview
          <IconButton size="small" onClick={() => setPreviewOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {previewArticle && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {previewArticle.articleTitle}
              </Typography>
              <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                {previewArticle.category} Description
              </Typography>
              {previewArticle.content ? (
                <Box sx={{ mb: 2, '& img': { maxWidth: '100%' }, fontSize: 14 }} dangerouslySetInnerHTML={{ __html: previewArticle.content }} />
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  (No content)
                </Typography>
              )}
              <Typography component="span" variant="body2" sx={{ color: 'error.main', fontWeight: 500 }}>
                Access link address:
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, wordBreak: 'break-all' }}>
                {(process.env.NEXT_PUBLIC_ARTICLE_BASE_URL || 'https://mapi.bogolive.net')}/wap/index.php?ctl=settings&act=article_show&article_id={previewArticle.number}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="contained"
            onClick={() => {
              if (!previewArticle) return;
              const base = process.env.NEXT_PUBLIC_ARTICLE_BASE_URL || 'https://mapi.bogolive.net';
              const url = `${base}/wap/index.php?ctl=settings&act=article_show&article_id=${previewArticle.number}`;
              navigator.clipboard.writeText(url);
            }}
          >
            Copy link
          </Button>
          <Button onClick={() => setPreviewOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
