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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { Add, Edit, Delete, Search, Close } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import { ImageUpload } from '@/components/common/ImageUpload';
import type { NoblePrivilege, NoblePrivilegePayload } from '@/types/noble';
import type { NoblePrivilegeFilters } from '@/types/noble';
import {
  fetchNoblePrivileges,
  createNoblePrivilege,
  updateNoblePrivilege,
  deleteNoblePrivilege,
} from '@/services/noble';

export default function NoblePrivilegesPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<NoblePrivilege[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<NoblePrivilegeFilters>({
    nobleClassification: '',
    noblePrivilege: '',
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<NoblePrivilegePayload>({
    nobleName: '',
    nobleType: '',
    nobleDetailsTitle: '',
    imageUrl: '',
    nobleDetails: '',
    sort: 1,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const hasFilters = filters.nobleClassification || filters.noblePrivilege;
      const list = await fetchNoblePrivileges(hasFilters ? filters : undefined);
      setData(list);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    addTab({
      id: '/dashboard/noble/privileges',
      label: 'Noble Privileges',
      path: '/dashboard/noble/privileges',
      breadcrumbs: ['Home', 'Prop management', 'Noble Management', 'Noble Privileges'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = () => {
    setEditingId(null);
    setForm({
      nobleName: '',
      nobleType: '',
      nobleDetailsTitle: '',
      imageUrl: '',
      nobleDetails: '',
      sort: 1,
    });
    setDialogOpen(true);
  };

  const handleEdit = (row: NoblePrivilege) => {
    setEditingId(row.id);
    setForm({
      nobleName: row.nobleName,
      nobleType: row.nobleType,
      nobleDetailsTitle: row.nobleDetailsTitle,
      imageUrl: row.imageUrl ?? '',
      nobleDetails: row.nobleDetails,
      sort: row.sort,
    });
    setDialogOpen(true);
  };

  const handleDialogConfirm = async () => {
    if (editingId) {
      await updateNoblePrivilege(editingId, form);
      setData((prev) =>
        prev.map((r) => (r.id === editingId ? { ...r, ...form } : r))
      );
    } else {
      const created = await createNoblePrivilege(form);
      setData((prev) => [...prev, created]);
    }
    setDialogOpen(false);
  };

  const handleDelete = async (row: NoblePrivilege) => {
    if (!confirm(`Delete privilege "${row.nobleType}"?`)) return;
    await deleteNoblePrivilege(row.id);
    setData((prev) => prev.filter((r) => r.id !== row.id));
  };

  const handleQuery = () => load();
  const handleClear = () => {
    setFilters({ nobleClassification: '', noblePrivilege: '' });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Add
        </Button>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Noble classification</InputLabel>
          <Select
            value={filters.nobleClassification}
            label="Noble classification"
            onChange={(e) => setFilters((p) => ({ ...p, nobleClassification: e.target.value }))}
          >
            <MenuItem value="">Select</MenuItem>
            <MenuItem value="Knight">Knight</MenuItem>
            <MenuItem value="Viscount">Viscount</MenuItem>
            <MenuItem value="Earl">Earl</MenuItem>
            <MenuItem value="Marquis">Marquis</MenuItem>
            <MenuItem value="Duke">Duke</MenuItem>
            <MenuItem value="Emperor">Emperor</MenuItem>
            <MenuItem value="God">God</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Noble Privilege</InputLabel>
          <Select
            value={filters.noblePrivilege}
            label="Noble Privilege"
            onChange={(e) => setFilters((p) => ({ ...p, noblePrivilege: e.target.value }))}
          >
            <MenuItem value="">Select</MenuItem>
            <MenuItem value="Noble Account">Noble Account</MenuItem>
            <MenuItem value="Invisible">Invisible in the list</MenuItem>
            <MenuItem value="Noble Gift">Noble Gift</MenuItem>
            <MenuItem value="Turn on notifications">Turn on notifications</MenuItem>
            <MenuItem value="Entry Effect">Entry Effect</MenuItem>
            <MenuItem value="Rank Top">Rank Top</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
          Query
        </Button>
        <Button variant="outlined" color="error" onClick={handleClear}>
          Clear conditions
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Noble name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Noble Types</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Noble details title</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 200 }}>Noble Details</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sort</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
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
              data.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell>{row.number}</TableCell>
                  <TableCell sx={{ maxWidth: 180 }}>{row.nobleName}</TableCell>
                  <TableCell>{row.nobleType}</TableCell>
                  <TableCell>{row.nobleDetailsTitle}</TableCell>
                  <TableCell>
                    {row.imageUrl ? (
                      <Box component="img" src={row.imageUrl} alt="" sx={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 1 }} />
                    ) : (
                      <Box sx={{ width: 32, height: 32, bgcolor: 'grey.300', borderRadius: 1 }} />
                    )}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 280 }}>{row.nobleDetails}</TableCell>
                  <TableCell>{row.sort}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell sx={{ width: 56 }}>
                    <OperationButton
                      items={[{ label: 'Edit', onClick: () => handleEdit(row), icon: <Edit fontSize="small" /> }]}
                      dangerItems={[{ label: 'Delete', onClick: () => handleDelete(row), icon: <Delete fontSize="small" /> }]}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editingId ? 'Edit Noble Privilege' : 'Add Noble Privilege'}
          <IconButton size="small" onClick={() => setDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField fullWidth label="Noble name" value={form.nobleName} onChange={(e) => setForm((p) => ({ ...p, nobleName: e.target.value }))} placeholder="e.g. Knight,Viscount,Earl" />
            <TextField fullWidth label="Noble Types" value={form.nobleType} onChange={(e) => setForm((p) => ({ ...p, nobleType: e.target.value }))} placeholder="e.g. Noble Account" />
            <TextField fullWidth label="Noble details title" value={form.nobleDetailsTitle} onChange={(e) => setForm((p) => ({ ...p, nobleDetailsTitle: e.target.value }))} />
            <ImageUpload label="Image" value={form.imageUrl} onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))} />
            <TextField fullWidth multiline rows={3} label="Noble Details" value={form.nobleDetails} onChange={(e) => setForm((p) => ({ ...p, nobleDetails: e.target.value }))} />
            <TextField fullWidth label="Sort" type="number" value={form.sort} onChange={(e) => setForm((p) => ({ ...p, sort: Number(e.target.value) || 0 }))} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleDialogConfirm} disabled={!form.nobleName.trim() || !form.nobleType.trim()}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
