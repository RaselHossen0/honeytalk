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
import type { EncryptionKeyConfig } from '@/types/encryption-key';
import {
  fetchEncryptionKeys,
  createEncryptionKey,
  updateEncryptionKey,
  deleteEncryptionKey,
} from '@/services/encryption-key';
import { EncryptionKeyAddDialog } from './EncryptionKeyAddDialog';
import { EncryptionKeyEditDialog } from './EncryptionKeyEditDialog';

export default function EncryptionKeyPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<EncryptionKeyConfig[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<EncryptionKeyConfig | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchEncryptionKeys(page + 1, perPage);
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage]);

  useEffect(() => {
    addTab({
      id: '/dashboard/system/encryption-key',
      label: 'Encryption key configuration',
      path: '/dashboard/system/encryption-key',
      breadcrumbs: ['Home', 'System Management', 'Encryption key configuration'],
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
    await deleteEncryptionKey(id);
    setSelected((prev) => prev.filter((x) => x !== id));
    load();
  };

  const handleBulkDelete = async () => {
    for (const id of selected) await deleteEncryptionKey(id);
    setSelected([]);
    load();
  };

  const handleAdd = async (key: string, packingAndFilling: boolean, valid: boolean) => {
    await createEncryptionKey({ key, packingAndFilling, valid });
    setAddOpen(false);
    load();
  };

  const handleEdit = async (
    id: number,
    key: string,
    packingAndFilling: boolean,
    valid: boolean
  ) => {
    await updateEncryptionKey(id, { key, packingAndFilling, valid });
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
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center' }}>
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
              <TableCell><strong>Number</strong></TableCell>
              <TableCell><strong>Encryption key configuration</strong></TableCell>
              <TableCell><strong>Packing and filling</strong></TableCell>
              <TableCell><strong>Valid</strong></TableCell>
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
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.key}</TableCell>
                  <TableCell>{row.packingAndFilling ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{row.valid ? 'Yes' : 'No'}</TableCell>
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
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
          />
        </Box>
      </TableContainer>

      <EncryptionKeyAddDialog open={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} />
      {editItem && (
        <EncryptionKeyEditDialog
          item={editItem}
          open={!!editItem}
          onClose={() => setEditItem(null)}
          onSave={handleEdit}
        />
      )}
    </Box>
  );
}
