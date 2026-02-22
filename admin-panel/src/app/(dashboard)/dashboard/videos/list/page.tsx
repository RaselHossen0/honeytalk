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
  Checkbox,
} from '@mui/material';
import { Search, Delete, Chat } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useRouter } from 'next/navigation';
import { useTabsStore } from '@/store/tabs';
import type { ShortVideo, ShortVideoFilters } from '@/types/short-video';
import { fetchShortVideos, deleteShortVideo } from '@/services/short-video';

export default function ShortVideoListPage() {
  const router = useRouter();
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<ShortVideo[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [filters, setFilters] = useState<ShortVideoFilters>({
    miniVideoId: '',
    publisherId: '',
    status: 'all',
    recommended: 'all',
    review: 'all',
    releaseTimeStart: '',
    releaseTimeEnd: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const hasFilters = Object.values(filters).some((v) => v && v !== 'all');
      const res = await fetchShortVideos(hasFilters ? filters : undefined, page + 1, perPage);
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filters]);

  useEffect(() => {
    addTab({
      id: '/dashboard/videos/list',
      label: 'Short Video List',
      path: '/dashboard/videos/list',
      breadcrumbs: ['Home', 'Short Video Management', 'Short Video Management', 'Short Video List'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({
      miniVideoId: '',
      publisherId: '',
      status: 'all',
      recommended: 'all',
      review: 'all',
      releaseTimeStart: '',
      releaseTimeEnd: '',
    });
    setPage(0);
  };

  const handleDelete = async (row: ShortVideo) => {
    if (!confirm(`Delete video "${row.publishContent}"?`)) return;
    await deleteShortVideo(row.id);
    setData((prev) => prev.filter((r) => r.id !== row.id));
    setTotal((t) => Math.max(0, t - 1));
  };

  const handleCommentList = (row: ShortVideo) => {
    router.push(`/dashboard/videos/comments?videoId=${row.id}`);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.checked ? data.map((r) => r.id) : []);
  };

  const handleSelectOne = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const totalPages = Math.ceil(total / perPage) || 1;
  const allSelected = data.length > 0 && selected.length === data.length;

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
    minWidth: 90,
    width: 90,
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

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
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
            label="Publisher ID"
            placeholder="Please enter publisher ID"
            value={filters.publisherId}
            onChange={(e) => setFilters((p) => ({ ...p, publisherId: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <FormControl size="small" fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={filters.status} label="Status" onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Valid">Valid</MenuItem>
              <MenuItem value="Invalid">Invalid</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <FormControl size="small" fullWidth>
            <InputLabel>Recommended</InputLabel>
            <Select value={filters.recommended} label="Recommended" onChange={(e) => setFilters((p) => ({ ...p, recommended: e.target.value }))}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <FormControl size="small" fullWidth>
            <InputLabel>Review</InputLabel>
            <Select value={filters.review} label="Review" onChange={(e) => setFilters((p) => ({ ...p, review: e.target.value }))}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            type="date"
            label="Release time"
            InputLabelProps={{ shrink: true }}
            value={filters.releaseTimeStart}
            onChange={(e) => setFilters((p) => ({ ...p, releaseTimeStart: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            type="date"
            label="Release time"
            InputLabelProps={{ shrink: true }}
            value={filters.releaseTimeEnd}
            onChange={(e) => setFilters((p) => ({ ...p, releaseTimeEnd: e.target.value }))}
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

      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer sx={{ overflowX: 'auto', overflowY: 'visible', width: '100%' }}>
          <Table size="small" sx={{ minWidth: 1500 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell padding="checkbox" sx={{ ...stickyFirst }}>
                  <Checkbox checked={allSelected} indeterminate={selected.length > 0 && selected.length < data.length} onChange={handleSelectAll} size="small" />
                </TableCell>
                <TableCell sx={{ ...stickyNumber, fontWeight: 600 }}>Number</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Publisher ID</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Publisher</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 160 }}>Publish Content</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Mini Video</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 100 }} align="right">Gift revenue</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Recommended</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>Release time</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>Review</TableCell>
                <TableCell sx={{ ...stickyLast, fontWeight: 600 }} align="right">Operation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={13} align="center" sx={{ py: 4 }}>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => (
                  <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                    <TableCell padding="checkbox" sx={stickyFirstBody(index % 2 === 1 ? 'grey.50' : 'background.paper')}>
                      <Checkbox checked={selected.includes(row.id)} onChange={() => handleSelectOne(row.id)} size="small" />
                    </TableCell>
                    <TableCell sx={stickyNumberBody(index % 2 === 1 ? 'grey.50' : 'background.paper')}>
                      {row.number}
                    </TableCell>
                    <TableCell>{row.publisherId}</TableCell>
                    <TableCell>{row.publisher}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell sx={{ maxWidth: 160 }}>{row.publishContent}</TableCell>
                    <TableCell>
                      <Box sx={{ position: 'relative', width: 80, height: 45 }}>
                        {row.videoThumbnailUrl ? (
                          <Box
                            component="img"
                            src={row.videoThumbnailUrl}
                            alt=""
                            sx={{ width: 80, height: 45, objectFit: 'cover', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
                          />
                        ) : (
                          <Box sx={{ width: 80, height: 45, bgcolor: 'grey.300', borderRadius: 1 }} />
                        )}
                        <Box
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 1,
                            bgcolor: 'rgba(0,0,0,0.3)',
                          }}
                        >
                          <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                            ▶
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell align="right">{row.giftRevenue != null ? row.giftRevenue.toFixed(2) : 'None'}</TableCell>
                    <TableCell>{row.recommended}</TableCell>
                    <TableCell>{row.releaseTime}</TableCell>
                    <TableCell>{row.review}</TableCell>
                    <TableCell align="right" sx={{ ...stickyLastBody(index % 2 === 1 ? 'grey.50' : 'background.paper'), whiteSpace: 'nowrap' }}>
                      <OperationButton
                        items={[
                          { label: 'Comment list', onClick: () => handleCommentList(row), icon: <Chat fontSize="small" /> },
                        ]}
                        dangerItems={[{ label: 'Delete', onClick: () => handleDelete(row), icon: <Delete fontSize="small" /> }]}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

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
        </Box>
      </Paper>
    </Box>
  );
}
