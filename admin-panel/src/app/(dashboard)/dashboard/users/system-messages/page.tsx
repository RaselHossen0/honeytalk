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
  Checkbox,
  Typography,
  Link,
  Grid,
  Pagination,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { Add, Search, Delete, Image as ImageIcon } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { SystemMessage, SystemMessageFilters } from '@/types/system-message';
import { fetchSystemMessages, deleteSystemMessage } from '@/services/system-message';

const CONTENT_MAX_LEN = 40;

function truncateContent(content: string): { display: string; full: string } {
  const full = content;
  const display = content.length > CONTENT_MAX_LEN ? content.slice(0, CONTENT_MAX_LEN) + '...' : content;
  return { display, full };
}

export default function SystemMessagesPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<SystemMessage[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [expandedContent, setExpandedContent] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    userId: '',
    dateStart: '',
    dateEnd: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const f: SystemMessageFilters = {};
      if (filters.userId) f.userId = filters.userId;
      if (filters.dateStart) f.dateStart = filters.dateStart;
      if (filters.dateEnd) f.dateEnd = filters.dateEnd;
      const res = await fetchSystemMessages(f, page + 1, perPage);
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filters]);

  useEffect(() => {
    addTab({
      id: '/dashboard/users/system-messages',
      label: 'System Message Management',
      path: '/dashboard/users/system-messages',
      breadcrumbs: ['Home', 'User Management', 'System Message Management'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleQuery = () => {
    setPage(0);
    load();
  };

  const handleClear = () => {
    setFilters({ userId: '', dateStart: '', dateEnd: '' });
    setPage(0);
  };

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
    if (!confirm('Delete this message?')) return;
    await deleteSystemMessage(id);
    setData((prev) => prev.filter((r) => r.id !== id));
    setTotal((t) => Math.max(0, t - 1));
    setSelected((prev) => prev.filter((x) => x !== id));
  };

  const handleAdd = () => {
    // TODO: open add/edit modal or navigate
  };

  const totalPages = Math.ceil(total / perPage) || 1;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          + Add
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            size="small"
            fullWidth
            label="User ID"
            placeholder="Please enter"
            value={filters.userId}
            onChange={(e) => setFilters((p) => ({ ...p, userId: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            size="small"
            fullWidth
            type="date"
            label="Date"
            InputLabelProps={{ shrink: true }}
            value={filters.dateStart}
            onChange={(e) => setFilters((p) => ({ ...p, dateStart: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            size="small"
            fullWidth
            type="date"
            label="Date"
            InputLabelProps={{ shrink: true }}
            value={filters.dateEnd}
            onChange={(e) => setFilters((p) => ({ ...p, dateEnd: e.target.value }))}
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
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < data.length}
                  checked={data.length > 0 && selected.length === data.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Content</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Cover image</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Link</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Release time</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>User ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => {
                const { display, full } = truncateContent(row.content);
                const showMore = row.content.length > CONTENT_MAX_LEN;
                return (
                  <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(row.id)}
                        onChange={() => handleSelectOne(row.id)}
                      />
                    </TableCell>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.title}</TableCell>
                    <TableCell sx={{ maxWidth: 220 }}>
                      {expandedContent === row.id ? (
                        <>
                          {full}{' '}
                          <Link
                            component="button"
                            variant="body2"
                            onClick={() => setExpandedContent(null)}
                            sx={{ cursor: 'pointer' }}
                          >
                            Less
                          </Link>
                        </>
                      ) : (
                        <>
                          {display}
                          {showMore && (
                            <>
                              {' '}
                              <Link
                                component="button"
                                variant="body2"
                                onClick={() => setExpandedContent(row.id)}
                                sx={{ cursor: 'pointer' }}
                              >
                                More
                              </Link>
                            </>
                          )}
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: 'grey.200',
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ImageIcon sx={{ color: 'grey.500', fontSize: 28 }} />
                      </Box>
                    </TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.link || '-'}</TableCell>
                    <TableCell>{row.releaseTime}</TableCell>
                    <TableCell>{row.userId}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        color="error"
                        variant="text"
                        startIcon={<Delete />}
                        onClick={() => handleDelete(row.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
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
    </Box>
  );
}
