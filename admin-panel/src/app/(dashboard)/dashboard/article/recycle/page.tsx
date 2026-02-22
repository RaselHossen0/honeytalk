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
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { Delete, Restore } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import type { Article } from '@/types/article';
import {
  fetchArticleRecycleBin,
  restoreArticle,
  batchRestoreArticles,
  permanentDeleteArticle,
  batchPermanentDeleteArticles,
} from '@/services/article';

export default function ArticleRecycleBinPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchArticleRecycleBin(page + 1, perPage);
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage]);

  useEffect(() => {
    addTab({
      id: '/dashboard/article/recycle',
      label: 'Article Management Recycle Bin',
      path: '/dashboard/article/recycle',
      breadcrumbs: ['Home', 'Article Management', 'Article Management Recycle Bin'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRestore = async (row: Article) => {
    await restoreArticle(row.id);
    load();
  };

  const handleDelete = async (row: Article) => {
    if (!confirm(`Permanently delete "${row.articleTitle}"?`)) return;
    await permanentDeleteArticle(row.id);
    load();
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.checked ? data.map((r) => r.id) : []);
  };

  const handleSelectOne = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleBatchRestore = async () => {
    if (selected.length === 0) return;
    await batchRestoreArticles(selected);
    setSelected([]);
    load();
  };

  const handleBatchDelete = async () => {
    if (selected.length === 0) return;
    if (!confirm(`Permanently delete ${selected.length} selected?`)) return;
    await batchPermanentDeleteArticles(selected);
    setSelected([]);
    load();
  };

  const totalPages = Math.ceil(total / perPage) || 1;
  const allSelected = data.length > 0 && selected.length === data.length;

  return (
    <Box>
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
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                  No Data
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selected.includes(row.id)} onChange={() => handleSelectOne(row.id)} size="small" />
                  </TableCell>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.articleTitle}</TableCell>
                  <TableCell sx={{ width: 56 }}>
                    <OperationButton
                      items={[{ label: 'Restore', onClick: () => handleRestore(row), icon: <Restore fontSize="small" /> }]}
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
            <Button variant="outlined" color="primary" startIcon={<Restore />} onClick={handleBatchRestore}>
              Restore ({selected.length})
            </Button>
          </Box>
        )}

        {total > 0 && (
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
        )}
      </TableContainer>
    </Box>
  );
}
