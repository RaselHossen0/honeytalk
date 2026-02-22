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
} from '@mui/material';
import { Add, Search, Edit, Delete } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import type { WarningContent } from '@/types/warning-content';
import { fetchWarningContent, deleteWarningContent } from '@/services/warning-content';

export default function WarningsPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<WarningContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [keyword, setKeyword] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchWarningContent(keyword || undefined);
      setData(list);
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    addTab({
      id: '/dashboard/live/warnings',
      label: 'Warning Content List',
      path: '/dashboard/live/warnings',
      breadcrumbs: ['Home', 'Live Management', 'Monitoring & Moderation', 'Warning Content List'],
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
    if (!confirm('Delete this item?')) return;
    await deleteWarningContent(id);
    setData((prev) => prev.filter((r) => r.id !== id));
    setSelected((prev) => prev.filter((x) => x !== id));
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0 || !confirm(`Delete ${selected.length} selected item(s)?`)) return;
    await Promise.all(selected.map((id) => deleteWarningContent(id)));
    setData((prev) => prev.filter((r) => !selected.includes(r.id)));
    setSelected([]);
  };

  const handleQuery = () => load();
  const handleClear = () => setKeyword('');

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Button variant="contained" startIcon={<Add />}>
          + Add
        </Button>
        <TextField
          size="small"
          label="Warning Content"
          placeholder="Please enter warning content"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          sx={{ minWidth: 260 }}
        />
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
              <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Warning Content</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
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
                  <TableCell sx={{ maxWidth: 400 }}>{row.content}</TableCell>
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
                  <TableCell sx={{ width: 56 }}>
                    <OperationButton
                      dangerItems={[{ label: 'Delete', onClick: () => handleDelete(row.id), icon: <Delete fontSize="small" /> }]}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderTop: 1, borderColor: 'divider' }}>
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
    </Box>
  );
}
