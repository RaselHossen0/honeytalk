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
  TablePagination,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Add, Search, Delete } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { NicknameRestriction, NicknameRestrictionFilters } from '@/types/nickname-restriction';
import { fetchNicknameRestrictions, createNicknameRestriction, deleteNicknameRestriction } from '@/services/nickname-restriction';
import { NicknameRestrictionAddDialog } from './NicknameRestrictionAddDialog';

export default function NicknameRestrictionPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<NicknameRestriction[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [filterInputs, setFilterInputs] = useState({ nickname: '', id: '' });
  const [addOpen, setAddOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const f: NicknameRestrictionFilters = {};
      if (filterInputs.nickname) f.nickname = filterInputs.nickname;
      if (filterInputs.id) f.id = filterInputs.id;
      const res = await fetchNicknameRestrictions(f, page + 1, perPage);
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filterInputs.nickname, filterInputs.id]);

  useEffect(() => {
    addTab({
      id: '/dashboard/system/nickname-restriction',
      label: 'Nickname Restriction Configuration',
      path: '/dashboard/system/nickname-restriction',
      breadcrumbs: ['Home', 'System Management', 'Nickname Restriction Configuration'],
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
    setFilterInputs({ nickname: '', id: '' });
    setPage(0);
  };

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
    await deleteNicknameRestriction(id);
    setSelected((prev) => prev.filter((x) => x !== id));
    load();
  };

  const handleBulkDelete = async () => {
    for (const id of selected) await deleteNicknameRestriction(id);
    setSelected([]);
    load();
  };

  const handleAdd = async (nickname: string) => {
    await createNicknameRestriction({ nickname });
    setAddOpen(false);
    load();
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangePerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPerPage(Number(e.target.value));
    setPage(0);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center' }}>
        <Button variant="contained" startIcon={<Add />} onClick={() => setAddOpen(true)}>
          Add
        </Button>
        <TextField
          size="small"
          placeholder="Nickname Restriction"
          value={filterInputs.nickname}
          onChange={(e) => setFilterInputs((p) => ({ ...p, nickname: e.target.value }))}
          sx={{ minWidth: 180 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          size="small"
          placeholder="ID"
          value={filterInputs.id}
          onChange={(e) => setFilterInputs((p) => ({ ...p, id: e.target.value }))}
          sx={{ minWidth: 120 }}
        />
        <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
          Query
        </Button>
        <Button variant="outlined" color="error" onClick={handleClear}>
          Clear conditions
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
              <TableCell><strong>Nickname Restriction</strong></TableCell>
              <TableCell align="right"><strong>Operation</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
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
                  <TableCell>{row.nickname}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="error" onClick={() => handleDelete(row.id)} title="Delete">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, p: 1.5, borderTop: 1, borderColor: 'divider' }}>
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
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
          />
        </Box>
      </TableContainer>

      <NicknameRestrictionAddDialog open={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} />
    </Box>
  );
}
