'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
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
  Select,
  MenuItem,
  Checkbox,
} from '@mui/material';
import { Search, Delete } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useSearchParams } from 'next/navigation';
import { useTabsStore } from '@/store/tabs';
import type { ShortVideoCommentFilters } from '@/types/short-video';
import { fetchShortVideoComments, deleteShortVideoComment, batchDeleteShortVideoComments } from '@/services/short-video';

function ShortVideoCommentsContent() {
  const searchParams = useSearchParams();
  const addTab = useTabsStore((s) => s.addTab);
  const videoIdFromUrl = searchParams.get('videoId');
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchShortVideoComments>>['data']>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [filters, setFilters] = useState<ShortVideoCommentFilters>({
    userId: '',
    miniVideoId: '',
    keyword: '',
    replyCommentNumber: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const hasFilters = Object.values(filters).some((v) => v && v.trim() !== '');
      const res = await fetchShortVideoComments(hasFilters ? filters : undefined, page + 1, perPage);
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filters]);

  useEffect(() => {
    if (videoIdFromUrl) {
      setFilters((p) => ({ ...p, miniVideoId: videoIdFromUrl }));
    }
  }, [videoIdFromUrl]);

  useEffect(() => {
    addTab({
      id: '/dashboard/videos/comments',
      label: 'Short Video Comments',
      path: '/dashboard/videos/comments',
      breadcrumbs: ['Home', 'Short Video Management', 'Short Video Comments'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({ userId: '', miniVideoId: '', keyword: '', replyCommentNumber: '' });
    setPage(0);
  };

  const handleDelete = async (row: { id: number }) => {
    if (!confirm('Delete this comment?')) return;
    await deleteShortVideoComment(row.id);
    setData((prev) => prev.filter((r) => r.id !== row.id));
    setTotal((t) => Math.max(0, t - 1));
  };

  const handleBatchDelete = async () => {
    if (selected.length === 0) return;
    if (!confirm(`Delete ${selected.length} selected comment(s)?`)) return;
    await batchDeleteShortVideoComments(selected);
    setData((prev) => prev.filter((r) => !selected.includes(r.id)));
    setTotal((t) => Math.max(0, t - selected.length));
    setSelected([]);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.checked ? data.map((r) => r.id) : []);
  };

  const handleSelectOne = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const totalPages = Math.ceil(total / perPage) || 1;
  const allSelected = data.length > 0 && selected.length === data.length;

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
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
            label="Mini Video ID"
            placeholder="Please enter the video ID"
            value={filters.miniVideoId}
            onChange={(e) => setFilters((p) => ({ ...p, miniVideoId: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="Keyword"
            placeholder="Please enter keywords"
            value={filters.keyword}
            onChange={(e) => setFilters((p) => ({ ...p, keyword: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="Reply comment number"
            placeholder="Please enter the number"
            value={filters.replyCommentNumber}
            onChange={(e) => setFilters((p) => ({ ...p, replyCommentNumber: e.target.value }))}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
          Q Query
        </Button>
        <Button variant="outlined" color="error" onClick={handleClear}>
          Clear conditions
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell padding="checkbox">
                <Checkbox checked={allSelected} indeterminate={selected.length > 0 && selected.length < data.length} onChange={handleSelectAll} size="small" />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Mini Video ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>User ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>User nickname</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Content</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Release time</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
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
                  <TableCell>{row.miniVideoId}</TableCell>
                  <TableCell>{row.userId}</TableCell>
                  <TableCell>{row.userNickname}</TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>{row.content}</TableCell>
                  <TableCell>{row.releaseTime}</TableCell>
                  <TableCell align="right" sx={{ width: 56 }}>
                    <OperationButton
                      items={[]}
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
            <Select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(0); }} sx={{ height: 32, fontSize: 13 }}>
              <MenuItem value={5}>5/page</MenuItem>
              <MenuItem value={10}>10/page</MenuItem>
              <MenuItem value={25}>25/page</MenuItem>
              <MenuItem value={50}>50/page</MenuItem>
            </Select>
          </FormControl>
          <Pagination count={totalPages} page={page + 1} onChange={(_, p) => setPage(p - 1)} color="primary" size="small" showFirstButton showLastButton />
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
    </Box>
  );
}

export default function ShortVideoCommentsPage() {
  return (
    <Suspense fallback={<Box sx={{ p: 4, textAlign: 'center' }}>Loading...</Box>}>
      <ShortVideoCommentsContent />
    </Suspense>
  );
}
