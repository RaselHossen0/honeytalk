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
import { Add, Edit, Delete } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { FamilyLevelEditModal } from './FamilyLevelEditModal';
import { useTabsStore } from '@/store/tabs';
import type { FamilyLevel } from '@/types/family-level';
import { fetchFamilyLevels, deleteFamilyLevel } from '@/services/family-level';

export default function FamilyLevelListPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<FamilyLevel[]>([]);
  const [total, setTotal] = useState(103);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [goToPage, setGoToPage] = useState('1');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<FamilyLevel | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchFamilyLevels(page + 1, perPage);
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage]);

  useEffect(() => {
    addTab({
      id: '/dashboard/users/family/levels',
      label: 'Family Level List',
      path: '/dashboard/users/family/levels',
      breadcrumbs: ['Home', 'User Management', 'Family Management', 'Family Level List'],
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
    if (!confirm('Delete this level?')) return;
    await deleteFamilyLevel(id);
    setData((prev) => prev.filter((r) => r.id !== id));
    setTotal((t) => Math.max(0, t - 1));
    setSelected((prev) => prev.filter((x) => x !== id));
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0 || !confirm(`Delete ${selected.length} selected level(s)?`)) return;
    await Promise.all(selected.map((id) => deleteFamilyLevel(id)));
    setData((prev) => prev.filter((r) => !selected.includes(r.id)));
    setTotal((t) => Math.max(0, t - selected.length));
    setSelected([]);
  };

  const handleEdit = (row: FamilyLevel) => {
    setEditingLevel(row);
    setEditModalOpen(true);
  };

  const handleAdd = () => {
    setEditingLevel(null);
    setEditModalOpen(true);
  };

  const handleEditSaved = (mode: 'edit' | 'add', level: FamilyLevel) => {
    if (mode === 'edit') {
      setData((prev) => prev.map((r) => (r.id === level.id ? level : r)));
    } else {
      setData((prev) => [...prev, level].sort((a, b) => a.level - b.level));
      setTotal((t) => t + 1);
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage - 1);
    setGoToPage(String(newPage));
  };

  const handleGoToPage = () => {
    const p = Math.max(1, Math.min(totalPages, parseInt(goToPage, 10) || 1));
    setPage(p - 1);
    setGoToPage(String(p));
  };

  const totalPages = Math.ceil(total / perPage) || 1;

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
              <TableCell sx={{ fontWeight: 600 }}>Level Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Level</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Required integral value</TableCell>
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
                  <TableCell>{row.levelName}</TableCell>
                  <TableCell>{row.level}</TableCell>
                  <TableCell>{row.requiredIntegralValue}</TableCell>
                  <TableCell align="right" sx={{ width: 56 }}>
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
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 2,
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
          <Box sx={{ flex: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Total {total}
          </Typography>
          <FormControl size="small" sx={{ minWidth: 90 }}>
            <Select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(0);
                setGoToPage('1');
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
            onChange={handleChangePage}
            color="primary"
            size="small"
            showFirstButton
            showLastButton
            siblingCount={2}
            boundaryCount={1}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Go to
            </Typography>
            <TextField
              size="small"
              value={goToPage}
              onChange={(e) => setGoToPage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGoToPage()}
              type="number"
              inputProps={{ min: 1, max: totalPages }}
              sx={{ width: 56, '& .MuiInputBase-input': { py: 0.75, textAlign: 'center' } }}
            />
            <Button size="small" variant="outlined" onClick={handleGoToPage}>
              Go
            </Button>
          </Box>
        </Box>
      </TableContainer>

      <FamilyLevelEditModal
        open={editModalOpen}
        level={editingLevel}
        onClose={() => {
          setEditModalOpen(false);
          setEditingLevel(null);
        }}
        onSaved={handleEditSaved}
      />
    </Box>
  );
}
