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
  TablePagination,
  IconButton,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { AnchorTag } from '@/types/anchor-tag';
import {
  fetchAnchorTags,
  createAnchorTag,
  updateAnchorTag,
  deleteAnchorTag,
} from '@/services/anchor-tag';
import { AnchorTagAddDialog } from './AnchorTagAddDialog';
import { AnchorTagEditDialog } from './AnchorTagEditDialog';

export default function AnchorTagsPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<AnchorTag[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<AnchorTag | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAnchorTags(page + 1, perPage);
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage]);

  useEffect(() => {
    addTab({
      id: '/dashboard/users/anchor-tags',
      label: 'Anchor Tags',
      path: '/dashboard/users/anchor-tags',
      breadcrumbs: ['Home', 'User Management', 'Anchor Tags'],
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

  const handleSelect = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleDelete = async (id: number) => {
    await deleteAnchorTag(id);
    setSelected((prev) => prev.filter((x) => x !== id));
    load();
  };

  const handleBulkDelete = async () => {
    for (const id of selected) await deleteAnchorTag(id);
    setSelected([]);
    load();
  };

  const handleAdd = async (label: string, gender: 'Male' | 'Female', color: string) => {
    await createAnchorTag({ label, gender, color });
    setAddOpen(false);
    load();
  };

  const handleEdit = async (
    id: number,
    label: string,
    gender: 'Male' | 'Female',
    color: string
  ) => {
    await updateAnchorTag(id, { label, gender, color });
    setEditItem(null);
    load();
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangePerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPerPage(Number(e.target.value));
    setPage(0);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={() => setAddOpen(true)}>
          Add
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
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
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Label</strong></TableCell>
              <TableCell><strong>Gender</strong></TableCell>
              <TableCell><strong>color</strong></TableCell>
              <TableCell align="right"><strong>Operation</strong></TableCell>
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
                <TableRow key={row.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selected.includes(row.id)} onChange={() => handleSelect(row.id)} />
                  </TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.label}</TableCell>
                  <TableCell>{row.gender}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: 1,
                          bgcolor: row.color,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      />
                      {row.color}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => setEditItem(row)}
                      title="Edit"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(row.id)}
                      title="Delete"
                    >
                      <Delete />
                    </IconButton>
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
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
            p: 1.5,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            disabled={selected.length === 0}
            onClick={handleBulkDelete}
            size="small"
          >
            Delete
          </Button>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={perPage}
            onRowsPerPageChange={handleChangePerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage=""
            labelDisplayedRows={({ from, to, count }) => `Total ${count} • ${from}-${to} of ${count}`}
          />
        </Box>
      </TableContainer>

      <AnchorTagAddDialog open={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} />
      {editItem && (
        <AnchorTagEditDialog
          item={editItem}
          open={!!editItem}
          onClose={() => setEditItem(null)}
          onSave={handleEdit}
        />
      )}
    </Box>
  );
}
