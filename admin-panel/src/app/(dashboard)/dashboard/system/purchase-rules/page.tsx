'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { CrudTable } from '@/components/common/CrudTable';
import type { CrudTableColumn } from '@/components/common/CrudTable';
import type { PurchaseRule } from '@/types/purchase';
import { demoPurchaseRules } from '@/lib/demo-data';
import { useTabsStore } from '@/store/tabs';

export default function PurchaseRulesPage() {
  const addTab = useTabsStore((s) => s.addTab);

  const [data, setData] = useState<PurchaseRule[]>(demoPurchaseRules);
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<PurchaseRule | null>(null);
  const [form, setForm] = useState({
    name: '',
    diamonds: 0,
    price: 0,
    applePayDiamonds: 0,
    applePayPrice: 0,
    appleProjectId: '',
    diamondGifting: 0,
    googlePay: '',
    sort: 0,
    status: 'Valid' as 'Valid' | 'Invalid',
  });

  useEffect(() => {
    addTab({
      id: '/dashboard/system/purchase-rules',
      label: 'Purchase rule list',
      path: '/dashboard/system/purchase-rules',
      breadcrumbs: ['Home', 'System Management', 'Purchase rule list'],
    });
  }, [addTab]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, page, rowsPerPage]);

  const columns: CrudTableColumn<PurchaseRule>[] = [
    { id: 'number', label: 'Number', minWidth: 70, align: 'center' },
    { id: 'name', label: 'Name', minWidth: 130 },
    { id: 'diamonds', label: 'Number of Diamonds', minWidth: 120, align: 'right' },
    { id: 'price', label: 'Price', minWidth: 80, align: 'right', render: (r) => r.price.toFixed(2) },
    { id: 'applePayDiamonds', label: 'Apple Pay received', minWidth: 120, align: 'right' },
    { id: 'applePayPrice', label: 'Apple Pay Price', minWidth: 120, align: 'right', render: (r) => r.applePayPrice.toFixed(2) },
    { id: 'appleProjectId', label: 'Apple project ID', minWidth: 110 },
    { id: 'diamondGifting', label: 'Diamond gifting', minWidth: 110, align: 'right' },
    { id: 'sort', label: 'Sort', minWidth: 70, align: 'center' },
    {
      id: 'status',
      label: 'Status',
      minWidth: 90,
      render: (row) => (
        <Box
          component="span"
          sx={{
            px: 1,
            py: 0.5,
            borderRadius: 1,
            bgcolor: row.status === 'Valid' ? 'success.light' : 'error.light',
            color: row.status === 'Valid' ? 'success.dark' : 'error.dark',
            fontWeight: 500,
          }}
        >
          {row.status}
        </Box>
      ),
    },
  ];

  const handleAdd = () => {
    setEditing(null);
    setForm({
      name: '',
      diamonds: 0,
      price: 0,
      applePayDiamonds: 0,
      applePayPrice: 0,
      appleProjectId: '',
      diamondGifting: 0,
      googlePay: '',
      sort: 1,
      status: 'Valid',
    });
    setEditOpen(true);
  };

  const handleEdit = (row: PurchaseRule) => {
    setEditing(row);
    setForm({
      name: row.name,
      diamonds: row.diamonds,
      price: row.price,
      applePayDiamonds: row.applePayDiamonds,
      applePayPrice: row.applePayPrice,
      appleProjectId: row.appleProjectId ?? '',
      diamondGifting: row.diamondGifting,
      googlePay: row.googlePay ?? '',
      sort: row.sort ?? row.number,
      status: row.status,
    });
    setEditOpen(true);
  };

  const handleDelete = (row: PurchaseRule) => {
    if (confirm(`Delete "${row.name}"?`)) {
      setData((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selected.length} purchase rules?`)) {
      setData((prev) => prev.filter((r) => !selected.includes(r.id)));
      setSelected([]);
    }
  };

  const handleSave = () => {
    if (editing) {
      setData((prev) =>
        prev.map((r) => (r.id === editing.id ? { ...r, ...form } : r))
      );
    } else {
      const nextNum = Math.max(...data.map((r) => r.number), 0) + 1;
      setData((prev) => [
        ...prev,
        { id: nextNum, number: nextNum, ...form } as PurchaseRule,
      ]);
    }
    setEditOpen(false);
  };

  return (
    <Box>
      <CrudTable<PurchaseRule>
        columns={columns}
        rows={paginatedRows}
        selected={selected}
        onSelect={setSelected}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={data.length}
        onPageChange={setPage}
        onRowsPerPageChange={(r) => { setRowsPerPage(r); setPage(0); }}
      />
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {editing ? 'Edit' : 'Add'}
          <IconButton size="small" onClick={() => setEditOpen(false)} aria-label="Close">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="* Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="* Number of Diamonds"
              type="number"
              value={form.diamonds || ''}
              onChange={(e) => setForm((f) => ({ ...f, diamonds: parseInt(e.target.value, 10) || 0 }))}
              fullWidth
              required
            />
            <TextField
              label="* Price"
              type="number"
              inputProps={{ step: 0.01 }}
              value={form.price === 0 ? '' : form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
              fullWidth
              required
            />
            <TextField
              label="Apple Pay received diamonds"
              type="number"
              value={form.applePayDiamonds || ''}
              onChange={(e) => setForm((f) => ({ ...f, applePayDiamonds: parseInt(e.target.value, 10) || 0 }))}
              fullWidth
              helperText="It must be consistent with the diamonds paid within Apple review and cannot be modified arbitrarily"
            />
            <TextField
              label="Apple Pay Price"
              type="number"
              inputProps={{ step: 0.01 }}
              value={form.applePayPrice === 0 ? '' : form.applePayPrice}
              onChange={(e) => setForm((f) => ({ ...f, applePayPrice: parseFloat(e.target.value) || 0 }))}
              fullWidth
              helperText="The price must be consistent with the price paid within Apple review and cannot be modified arbitrarily"
            />
            <TextField
              label="Apple project ID"
              value={form.appleProjectId}
              onChange={(e) => setForm((f) => ({ ...f, appleProjectId: e.target.value }))}
              fullWidth
              helperText="When empty, it will not appear in the Apple purchase item"
            />
            <TextField
              label="* Diamond gifting"
              type="number"
              value={form.diamondGifting || ''}
              onChange={(e) => setForm((f) => ({ ...f, diamondGifting: parseInt(e.target.value, 10) || 0 }))}
              fullWidth
              required
            />
            <TextField
              label="Google pay"
              value={form.googlePay}
              onChange={(e) => setForm((f) => ({ ...f, googlePay: e.target.value }))}
              fullWidth
            />
            <TextField
              label="* Sort"
              type="number"
              value={form.sort || ''}
              onChange={(e) => setForm((f) => ({ ...f, sort: parseInt(e.target.value, 10) || 0 }))}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={form.status}
                label="Status"
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as 'Valid' | 'Invalid' }))}
              >
                <MenuItem value="Valid">Valid</MenuItem>
                <MenuItem value="Invalid">Invalid</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
