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
} from '@mui/material';
import { CrudTable } from '@/components/common/CrudTable';
import type { CrudTableColumn } from '@/components/common/CrudTable';
import type { ExchangeRule } from '@/types/exchange';
import { demoExchangeRules } from '@/lib/demo-data';
import { useTabsStore } from '@/store/tabs';

export default function ExchangeRulesPage() {
  const addTab = useTabsStore((s) => s.addTab);

  // TODO: Replace with API hook - useExchangeRules()
  const [data, setData] = useState<ExchangeRule[]>(demoExchangeRules);
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<ExchangeRule | null>(null);
  const [form, setForm] = useState({ diamonds: 0, coin: 0, status: 'Valid' as 'Valid' | 'Invalid' });

  useEffect(() => {
    addTab({
      id: '/dashboard/system/exchange-rules',
      label: 'Exchange Rules',
      path: '/dashboard/system/exchange-rules',
      breadcrumbs: ['Home', 'System Management', 'Exchange Rules'],
    });
  }, [addTab]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, page, rowsPerPage]);

  const columns: CrudTableColumn<ExchangeRule>[] = [
    { id: 'number', label: 'Number', minWidth: 80, align: 'center' },
    { id: 'diamonds', label: 'Number of Diamonds', minWidth: 140, align: 'right' },
    { id: 'coin', label: 'Coin', minWidth: 100, align: 'right' },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
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
    setForm({ diamonds: 0, coin: 0, status: 'Valid' });
    setEditOpen(true);
  };

  const handleEdit = (row: ExchangeRule) => {
    setEditing(row);
    setForm({ diamonds: row.diamonds, coin: row.coin, status: row.status });
    setEditOpen(true);
  };

  const handleDelete = (row: ExchangeRule) => {
    if (confirm(`Delete rule ${row.diamonds} diamonds = ${row.coin} coin?`)) {
      setData((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selected.length} rules?`)) {
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
        { id: nextNum, number: nextNum, ...form } as ExchangeRule,
      ]);
    }
    setEditOpen(false);
  };

  return (
    <Box>
      <CrudTable<ExchangeRule>
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
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit' : 'Add'} Exchange Rule</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Number of Diamonds"
            type="number"
            value={form.diamonds || ''}
            onChange={(e) => setForm((f) => ({ ...f, diamonds: parseInt(e.target.value, 10) || 0 }))}
            fullWidth
            required
          />
          <TextField
            label="Coin"
            type="number"
            value={form.coin || ''}
            onChange={(e) => setForm((f) => ({ ...f, coin: parseInt(e.target.value, 10) || 0 }))}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
