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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import type { SmsInterface, SmsInterfacePayload } from '@/types/sms';
import {
  fetchSmsInterfaces,
  createSmsInterface,
  updateSmsInterface,
  deleteSmsInterface,
  batchDeleteSmsInterfaces,
} from '@/services/sms';

export default function SMSInterfaceListPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<SmsInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<SmsInterfacePayload>({
    interfaceName: '',
    categoryName: '',
    smsInterface: '',
    account: '',
    smsInterfaceType: '',
    password: '',
    description: '',
    status: 'Valid',
  });

  const SMS_INTERFACE_OPTIONS = [
    { value: 'aliyun', label: 'Aliyun' },
    { value: 'vonage', label: 'Vonage' },
    { value: 'engage', label: 'Engage' },
    { value: 'engage_otp', label: 'Engage OTP' },
  ];

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchSmsInterfaces();
      setData(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    addTab({
      id: '/dashboard/sms/interfaces',
      label: 'SMS Interface List',
      path: '/dashboard/sms/interfaces',
      breadcrumbs: ['Home', 'SMS Management', 'SMS Interface List'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = () => {
    setEditingId(null);
    setForm({ interfaceName: '', categoryName: '', smsInterface: '', account: '', smsInterfaceType: 'aliyun', password: '', description: '', status: 'Valid' });
    setDialogOpen(true);
  };

  const handleEdit = (row: SmsInterface) => {
    setEditingId(row.id);
    setForm({
      interfaceName: row.interfaceName,
      categoryName: row.categoryName,
      smsInterface: row.smsInterface,
      account: row.account,
      smsInterfaceType: row.smsInterfaceType,
      password: row.password,
      description: row.description,
      status: row.status,
    });
    setDialogOpen(true);
  };

  const handleDialogConfirm = async () => {
    if (editingId) {
      await updateSmsInterface(editingId, form);
      setData((prev) => prev.map((r) => (r.id === editingId ? { ...r, ...form } : r)));
    } else {
      const created = await createSmsInterface(form);
      setData((prev) => [...prev, created]);
    }
    setDialogOpen(false);
  };

  const handleDelete = async (row: SmsInterface) => {
    if (!confirm(`Delete "${row.interfaceName}"?`)) return;
    await deleteSmsInterface(row.id);
    setData((prev) => prev.filter((r) => r.id !== row.id));
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.checked ? data.map((r) => r.id) : []);
  };

  const handleSelectOne = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleBatchDelete = async () => {
    if (selected.length === 0) return;
    if (!confirm(`Delete ${selected.length} selected?`)) return;
    await batchDeleteSmsInterfaces(selected);
    setData((prev) => prev.filter((r) => !selected.includes(r.id)));
    setSelected([]);
  };

  const allSelected = data.length > 0 && selected.length === data.length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Add
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell padding="checkbox">
                <Checkbox checked={allSelected} indeterminate={selected.length > 0 && selected.length < data.length} onChange={handleSelectAll} size="small" />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Interface Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>SMS interface</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>account</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
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
                  <TableCell>{row.interfaceName}</TableCell>
                  <TableCell>{row.categoryName || '-'}</TableCell>
                  <TableCell>{row.smsInterface || '-'}</TableCell>
                  <TableCell>{row.account || '-'}</TableCell>
                  <TableCell>
                    <Box
                      component="span"
                      sx={{
                        color: row.status === 'Valid' ? 'primary.main' : 'error.main',
                        fontWeight: 500,
                      }}
                    >
                      {row.status}
                    </Box>
                  </TableCell>
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

        {selected.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleBatchDelete}>
              Delete ({selected.length})
            </Button>
          </Box>
        )}
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editingId ? 'Edit' : 'Create'}
          <IconButton size="small" onClick={() => setDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField fullWidth required label="* Interface Name" value={form.interfaceName} onChange={(e) => setForm((p) => ({ ...p, interfaceName: e.target.value }))} placeholder="e.g. AliCloud SMS" />
            <TextField fullWidth label="Category name" value={form.categoryName} onChange={(e) => setForm((p) => ({ ...p, categoryName: e.target.value }))} placeholder="e.g. ALI" />
            <TextField fullWidth label="SMS interface" value={form.smsInterface} onChange={(e) => setForm((p) => ({ ...p, smsInterface: e.target.value }))} placeholder="e.g. 123" />
            <TextField fullWidth label="account" value={form.account} onChange={(e) => setForm((p) => ({ ...p, account: e.target.value }))} placeholder="Account" />
            <FormControl fullWidth required>
              <InputLabel>* SMS interface</InputLabel>
              <Select value={form.smsInterfaceType} label="* SMS interface" onChange={(e) => setForm((p) => ({ ...p, smsInterfaceType: e.target.value }))}>
                {SMS_INTERFACE_OPTIONS.map((o) => (
                  <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField fullWidth type="password" label="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} placeholder="Password" />
            <TextField fullWidth multiline rows={2} label="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="For example: I am a description" />
            {editingId && (
              <FormControl fullWidth>
                <InputLabel>Whether to enable</InputLabel>
                <Select value={form.status} label="Whether to enable" onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as 'Valid' | 'Invalid' }))}>
                  <MenuItem value="Valid">Valid</MenuItem>
                  <MenuItem value="Invalid">Invalid</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleDialogConfirm} disabled={!form.interfaceName.trim() || !form.smsInterfaceType}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
