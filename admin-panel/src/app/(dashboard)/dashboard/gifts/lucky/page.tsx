'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add, Edit, Delete, Search, Clear } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { ImageUpload } from '@/components/common/ImageUpload';
import { useTabsStore } from '@/store/tabs';
import type { LuckyGift } from '@/types/lucky-gift';
import { demoLuckyGifts } from '@/lib/demo-data';

export default function LuckyGiftManagementPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<LuckyGift[]>(demoLuckyGifts);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editOpen, setEditOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editing, setEditing] = useState<LuckyGift | null>(null);
  const [viewing, setViewing] = useState<LuckyGift | null>(null);
  const [form, setForm] = useState({
    giftName: '',
    imageUrl: '',
    giftPrice: 100,
    prizePoolBalance: 10000,
    winningProbability: '50%',
    winningMultiple: '2,5,10',
    status: 'Valid',
  });
  const [filters, setFilters] = useState({ giftName: '' });

  useEffect(() => {
    addTab({
      id: '/dashboard/gifts/lucky',
      label: 'Lucky Gift Management',
      path: '/dashboard/gifts/lucky',
      breadcrumbs: ['Home', 'Prop management', 'Gift Management', 'Lucky Gift Management'],
    });
  }, [addTab]);

  const filtered = useMemo(() => {
    let result = [...data];
    if (filters.giftName.trim()) {
      const k = filters.giftName.toLowerCase();
      result = result.filter((r) => r.giftName.toLowerCase().includes(k));
    }
    return result;
  }, [data, filters]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleAdd = () => {
    setEditing(null);
    setForm({
      giftName: '',
      imageUrl: '',
      giftPrice: 100,
      prizePoolBalance: 10000,
      winningProbability: '50%',
      winningMultiple: '2,5,10',
      status: 'Valid',
    });
    setEditOpen(true);
  };

  const handleEdit = (row: LuckyGift) => {
    setEditing(row);
    setForm({
      giftName: row.giftName,
      imageUrl: row.imageUrl || '',
      giftPrice: typeof row.giftPrice === 'string' ? parseFloat(row.giftPrice) || 0 : row.giftPrice,
      prizePoolBalance: typeof row.prizePoolBalance === 'string' ? parseFloat(row.prizePoolBalance) || 0 : row.prizePoolBalance,
      winningProbability: row.winningProbability,
      winningMultiple: row.winningMultiple,
      status: row.status,
    });
    setEditOpen(true);
  };

  const handleViewDetails = (row: LuckyGift) => {
    setViewing(row);
    setDetailsOpen(true);
  };

  const handleDelete = (row: LuckyGift) => {
    if (confirm(`Delete "${row.giftName}"?`)) {
      setData((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  const handleSave = () => {
    if (editing) {
      setData((prev) =>
        prev.map((r) =>
          r.id === editing.id
            ? { ...r, ...form, giftPrice: form.giftPrice, prizePoolBalance: form.prizePoolBalance }
            : r
        )
      );
    } else {
      const nextNum = Math.max(...data.map((r) => r.number), 0) + 1;
      setData((prev) => [
        ...prev,
        {
          id: nextNum,
          number: nextNum,
          ...form,
          giftPrice: form.giftPrice,
          prizePoolBalance: form.prizePoolBalance,
          creationTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        } as LuckyGift,
      ]);
    }
    setEditOpen(false);
  };

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({ giftName: '' });
    setPage(0);
  };

  const stickyFirst = {
    position: 'sticky' as const,
    left: 0,
    zIndex: 3,
    minWidth: 80,
    width: 80,
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
  const stickyLastBody = (bg: string) => ({ ...stickyLast, zIndex: 2, bgcolor: bg });

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
          <TextField
            size="small"
            label="Gift name"
            placeholder="Please enter a name"
            value={filters.giftName}
            onChange={(e) => setFilters((p) => ({ ...p, giftName: e.target.value }))}
            sx={{ minWidth: 200 }}
          />
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
            Query
          </Button>
          <Button variant="outlined" color="error" startIcon={<Clear />} onClick={handleClear}>
            Clear conditions
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={handleAdd} sx={{ ml: 'auto' }}>
            Add
          </Button>
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer sx={{ overflowX: 'auto', overflowY: 'visible', width: '100%' }}>
          <Table size="small" sx={{ minWidth: 1300 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ ...stickyFirst, fontWeight: 600 }}>Number</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 180 }}>Gift name</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Gift price</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Prize pool balance</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Winning probability</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>Winning multiple</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 80 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 165 }}>Creation time</TableCell>
                <TableCell sx={{ ...stickyLast, fontWeight: 600 }} align="right">
                  Operation
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row, index) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell sx={stickyFirstBody(index % 2 === 1 ? 'grey.50' : 'background.paper')}>
                    {row.number}
                  </TableCell>
                  <TableCell>{row.giftName}</TableCell>
                  <TableCell>{row.giftPrice}</TableCell>
                  <TableCell>{row.prizePoolBalance}</TableCell>
                  <TableCell>{row.winningProbability}</TableCell>
                  <TableCell>{row.winningMultiple}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.creationTime}</TableCell>
                  <TableCell align="right" sx={{ ...stickyLastBody(index % 2 === 1 ? 'grey.50' : 'background.paper'), whiteSpace: 'nowrap' }}>
                    <OperationButton
                      items={[
                        { label: 'Edit', onClick: () => handleEdit(row) },
                        { label: 'View Details', onClick: () => handleViewDetails(row) },
                      ]}
                      dangerItems={[{ label: 'Delete', onClick: () => handleDelete(row) }]}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50]}
          labelRowsPerPage="per page"
        />
      </Paper>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit' : 'Add'} Lucky Gift</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="Gift name" value={form.giftName} onChange={(e) => setForm((f) => ({ ...f, giftName: e.target.value }))} fullWidth required placeholder="e.g. Butterflies fly(6)" />
          <ImageUpload label="Image" value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />
          <TextField label="Gift price" type="number" value={form.giftPrice} onChange={(e) => setForm((f) => ({ ...f, giftPrice: parseInt(e.target.value, 10) || 0 }))} fullWidth />
          <TextField label="Prize pool balance" type="number" value={form.prizePoolBalance} onChange={(e) => setForm((f) => ({ ...f, prizePoolBalance: parseInt(e.target.value, 10) || 0 }))} fullWidth />
          <TextField label="Winning probability" value={form.winningProbability} onChange={(e) => setForm((f) => ({ ...f, winningProbability: e.target.value }))} fullWidth placeholder="e.g. 80%" />
          <TextField label="Winning multiple" value={form.winningMultiple} onChange={(e) => setForm((f) => ({ ...f, winningMultiple: e.target.value }))} fullWidth placeholder="e.g. 2,5,10,20" />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={form.status} label="Status" onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
              <MenuItem value="Valid">Valid</MenuItem>
              <MenuItem value="Invalid">Invalid</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Lucky Gift Details</DialogTitle>
        <DialogContent>
          {viewing && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1 }}>
              <Box><strong>Number:</strong> {viewing.number}</Box>
              <Box><strong>Gift name:</strong> {viewing.giftName}</Box>
              <Box><strong>Gift price:</strong> {viewing.giftPrice}</Box>
              <Box><strong>Prize pool balance:</strong> {viewing.prizePoolBalance}</Box>
              <Box><strong>Winning probability:</strong> {viewing.winningProbability}</Box>
              <Box><strong>Winning multiple:</strong> {viewing.winningMultiple}</Box>
              <Box><strong>Status:</strong> {viewing.status}</Box>
              <Box><strong>Creation time:</strong> {viewing.creationTime}</Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
