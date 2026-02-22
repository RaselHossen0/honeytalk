'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Box,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { ImageUpload } from '@/components/common/ImageUpload';
import { useTabsStore } from '@/store/tabs';
import type { PaymentInterface, PaymentType } from '@/types/fund';
import { demoPaymentInterfaces } from '@/lib/demo-data';

const PAYMENT_TYPES: PaymentType[] = ['Offline payment', 'Online Payment', 'WAP payment', 'App payment'];

export default function PaymentInterfacePage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<PaymentInterface[]>(demoPaymentInterfaces);
  const [selected, setSelected] = useState<number[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<PaymentInterface | null>(null);
  const [form, setForm] = useState({
    name: '',
    displayName: '',
    categoryName: '',
    status: 'Valid' as 'Valid' | 'Invalid',
    automaticWithdrawal: 'No' as 'Yes' | 'No',
    withdrawalPaymentAccount: '',
    paymentType: 'Online Payment' as PaymentType,
    imageUrl: '',
    description: '',
    sort: 0,
  });

  useEffect(() => {
    addTab({
      id: '/dashboard/fund/payment-interface',
      label: 'Payment interface',
      path: '/dashboard/fund/payment-interface',
      breadcrumbs: ['Home', 'Fund Management', 'Payment interface'],
    });
  }, [addTab]);

  const handleAdd = () => {
    setEditing(null);
    setForm({
      name: '',
      displayName: '',
      categoryName: '',
      status: 'Valid',
      automaticWithdrawal: 'No',
      withdrawalPaymentAccount: '',
      paymentType: 'Online Payment',
      imageUrl: '',
      description: '',
      sort: 1,
    });
    setEditOpen(true);
  };

  const handleEdit = (row: PaymentInterface) => {
    setEditing(row);
    setForm({
      name: row.name,
      displayName: row.displayName ?? '',
      categoryName: row.categoryName,
      status: row.status as 'Valid' | 'Invalid',
      automaticWithdrawal: row.automaticWithdrawal,
      withdrawalPaymentAccount: row.withdrawalPaymentAccount ?? '',
      paymentType: row.paymentType,
      imageUrl: row.imageUrl ?? '',
      description: row.description ?? '',
      sort: row.sort,
    });
    setEditOpen(true);
  };

  const handleDelete = (row: PaymentInterface) => {
    if (confirm(`Delete "${row.name}"?`)) {
      setData((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    if (confirm(`Delete ${selected.length} interface(s)?`)) {
      setData((prev) => prev.filter((r) => !selected.includes(r.id)));
      setSelected([]);
    }
  };

  const handleSave = () => {
    if (editing) {
      setData((prev) =>
        prev.map((r) =>
          r.id === editing.id
            ?             {
                ...r,
                name: form.name,
                displayName: form.displayName || undefined,
                categoryName: form.categoryName,
                status: form.status,
                automaticWithdrawal: form.automaticWithdrawal,
                withdrawalPaymentAccount: form.withdrawalPaymentAccount,
                paymentType: form.paymentType,
                imageUrl: form.imageUrl,
                description: form.description,
                sort: form.sort,
              }
            : r
        )
      );
    } else {
      const nextId = Math.max(...data.map((r) => r.id), 0) + 1;
      const nextNum = Math.max(...data.map((r) => r.number), 0) + 1;
      setData((prev) => [
        ...prev,
        {
          id: nextId,
          number: nextNum,
          name: form.name,
          displayName: form.displayName || undefined,
          categoryName: form.categoryName,
          status: form.status,
          receivedPayment: 0,
          automaticWithdrawal: form.automaticWithdrawal,
          withdrawalPaymentAccount: form.withdrawalPaymentAccount,
          paymentType: form.paymentType,
          imageUrl: form.imageUrl,
          description: form.description,
          sort: form.sort,
        },
      ]);
    }
    setEditOpen(false);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelected(data.map((r) => r.id));
    else setSelected([]);
  };

  const handleSelectOne = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const handleAddConfiguration = () => {
    // Placeholder for configuration row - can be extended later
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Add
        </Button>
        {selected.length > 0 && (
          <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleBulkDelete}>
            Delete
          </Button>
        )}
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
              <TableCell sx={{ fontWeight: 600 }}>* Payment Interface</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Automatic</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>withdrawal payment account</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Payment Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>image</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sort</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                Operation
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                <TableCell padding="checkbox">
                  <Checkbox checked={selected.includes(row.id)} onChange={() => handleSelectOne(row.id)} />
                </TableCell>
                <TableCell>{row.number}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.displayName ?? row.name}</TableCell>
                <TableCell>{row.categoryName}</TableCell>
                <TableCell sx={{ color: row.status === 'Valid' ? 'primary.main' : 'text.secondary' }}>{row.status}</TableCell>
                <TableCell>{row.automaticWithdrawal}</TableCell>
                <TableCell>{row.withdrawalPaymentAccount || '-'}</TableCell>
                <TableCell>{row.paymentType}</TableCell>
                <TableCell>
                  {row.imageUrl ? (
                    <Box sx={{ width: 40, height: 40, position: 'relative', borderRadius: 1, overflow: 'hidden' }}>
                      <Image src={row.imageUrl} alt={row.name} fill sizes="40px" style={{ objectFit: 'contain' }} unoptimized />
                    </Box>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>{row.sort}</TableCell>
                <TableCell sx={{ maxWidth: 120 }}>{row.description || '-'}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                    <Button size="small" variant="contained" color="primary" startIcon={<Edit fontSize="small" />} onClick={() => handleEdit(row)}>
                      Edit
                    </Button>
                    <Button size="small" variant="outlined" color="error" startIcon={<Delete fontSize="small" />} onClick={() => handleDelete(row)}>
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit' : 'Add'} Payment interface</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            required
            label="* Payment Interface"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            fullWidth
            placeholder="e.g. Google Pay"
          />
          <TextField label="Name" value={form.displayName} onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))} fullWidth />
          <TextField label="Category name" value={form.categoryName} onChange={(e) => setForm((f) => ({ ...f, categoryName: e.target.value }))} fullWidth placeholder="e.g. GooglePay" />
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Status
            </Typography>
            <ToggleButtonGroup
              value={form.status}
              exclusive
              onChange={(_, v) => v != null && setForm((f) => ({ ...f, status: v }))}
              size="small"
            >
              <ToggleButton value="Valid">Valid</ToggleButton>
              <ToggleButton value="Invalid">Invalid</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Automatic
            </Typography>
            <ToggleButtonGroup
              value={form.automaticWithdrawal}
              exclusive
              onChange={(_, v) => v != null && setForm((f) => ({ ...f, automaticWithdrawal: v }))}
              size="small"
            >
              <ToggleButton value="Yes">Yes</ToggleButton>
              <ToggleButton value="No">No</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <TextField
            label="withdrawal payment account"
            value={form.withdrawalPaymentAccount}
            onChange={(e) => setForm((f) => ({ ...f, withdrawalPaymentAccount: e.target.value }))}
            fullWidth
          />
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Payment Type
            </Typography>
            <ToggleButtonGroup
              value={form.paymentType}
              exclusive
              onChange={(_, v) => v != null && setForm((f) => ({ ...f, paymentType: v }))}
              size="small"
              sx={{ flexWrap: 'wrap' }}
            >
              {PAYMENT_TYPES.map((t) => (
                <ToggleButton key={t} value={t}>
                  {t}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
          <ImageUpload
            label="image"
            value={form.imageUrl}
            onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
            helperText="Upload rule: Uploaded images can only be JPG/PNG"
          />
          <TextField label="Sort" type="number" value={form.sort} onChange={(e) => setForm((f) => ({ ...f, sort: parseInt(e.target.value, 10) || 0 }))} fullWidth />
          <TextField label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} fullWidth multiline rows={2} />
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
              Configuration
            </Typography>
            <Button variant="contained" size="small" onClick={handleAddConfiguration}>
              AddConfiguration
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!form.name.trim()}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
