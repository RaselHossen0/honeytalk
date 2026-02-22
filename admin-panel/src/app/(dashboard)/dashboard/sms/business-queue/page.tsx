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
import { Delete, Send } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import { fetchBusinessQueue, sendBusinessQueueItem, deleteBusinessQueueItem, batchDeleteBusinessQueue } from '@/services/sms';

export default function BusinessQueueListPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchBusinessQueue>>['data']>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchBusinessQueue(page + 1, perPage);
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage]);

  useEffect(() => {
    addTab({
      id: '/dashboard/sms/business-queue',
      label: 'Business queue list',
      path: '/dashboard/sms/business-queue',
      breadcrumbs: ['Home', 'SMS Management', 'Business queue list'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSend = async (row: { id: number }) => {
    await sendBusinessQueueItem(row.id);
    load();
  };

  const handleDelete = async (row: { id: number }) => {
    if (!confirm('Delete this queue item?')) return;
    await deleteBusinessQueueItem(row.id);
    setData((prev) => prev.filter((r) => r.id !== row.id));
    setTotal((t) => Math.max(0, t - 1));
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.checked ? data.map((r) => r.id) : []);
  };

  const handleSelectOne = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleBatchDelete = async () => {
    if (selected.length === 0) return;
    if (!confirm(`Delete ${selected.length} selected item(s)?`)) return;
    await batchDeleteBusinessQueue(selected);
    setData((prev) => prev.filter((r) => !selected.includes(r.id)));
    setTotal((t) => Math.max(0, t - selected.length));
    setSelected([]);
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
                <Checkbox checked={allSelected} indeterminate={selected.length > 0 && selected.length < data.length} onChange={handleSelectAll} size="small" />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Recipient</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>User ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Content</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Verification Code</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Creation time</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Result</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Log information</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={12} align="center" sx={{ py: 4 }}>
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
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.recipient}</TableCell>
                  <TableCell>{row.userId}</TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>
                    <Typography component="a" href="#" variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                      {row.content}
                    </Typography>
                  </TableCell>
                  <TableCell>{row.verificationCode}</TableCell>
                  <TableCell>{row.creationTime}</TableCell>
                  <TableCell>{row.status ?? '-'}</TableCell>
                  <TableCell>{row.result ?? '-'}</TableCell>
                  <TableCell>{row.logInformation ?? '-'}</TableCell>
                  <TableCell sx={{ width: 56 }}>
                    <OperationButton
                      items={[{ label: 'Send', onClick: () => handleSend(row), icon: <Send fontSize="small" /> }]}
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
