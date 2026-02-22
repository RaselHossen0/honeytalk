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
  Tabs,
  Tab,
  TextField,
  IconButton,
} from '@mui/material';
import { Add, Delete, Remove } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { RedEnvelopeAmountConfig, RedEnvelopeQuantityConfig } from '@/types/red-envelope';
import { demoRedEnvelopeAmountConfigs, demoRedEnvelopeQuantityConfigs } from '@/lib/demo-data';

export default function RedEnvelopeConfigPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [tab, setTab] = useState(0);
  const [amountConfigs, setAmountConfigs] = useState<RedEnvelopeAmountConfig[]>(demoRedEnvelopeAmountConfigs);
  const [quantityConfigs, setQuantityConfigs] = useState<RedEnvelopeQuantityConfig[]>(demoRedEnvelopeQuantityConfigs);

  useEffect(() => {
    addTab({
      id: '/dashboard/live/red-envelope/config',
      label: 'Red Envelope Config',
      path: '/dashboard/live/red-envelope/config',
      breadcrumbs: ['Home', 'Live Management', 'Red Envelope Manage', 'Red Envelope Config'],
    });
  }, [addTab]);

  const handleAddAmount = () => {
    const nextId = Math.max(...amountConfigs.map((r) => r.id), 0) + 1;
    setAmountConfigs((prev) => [...prev, { id: nextId, amount: 50000, iconUrl: 'https://picsum.photos/48/48?random=new', sort: 0 }]);
  };

  const handleAddQuantity = () => {
    const nextId = Math.max(...quantityConfigs.map((r) => r.id), 0) + 1;
    setQuantityConfigs((prev) => [...prev, { id: nextId, quantity: 20, sort: 0 }]);
  };

  const handleDeleteAmount = (id: number) => {
    setAmountConfigs((prev) => prev.filter((r) => r.id !== id));
  };

  const handleDeleteQuantity = (id: number) => {
    setQuantityConfigs((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAmountChange = (id: number, delta: number) => {
    setAmountConfigs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, amount: Math.max(0, r.amount + delta) } : r))
    );
  };

  const handleQuantityChange = (id: number, delta: number) => {
    setQuantityConfigs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, quantity: Math.max(1, r.quantity + delta) } : r))
    );
  };

  const handleSortChange = (type: 'amount' | 'quantity', id: number, delta: number) => {
    if (type === 'amount') {
      setAmountConfigs((prev) =>
        prev.map((r) => (r.id === id ? { ...r, sort: Math.max(0, r.sort + delta) } : r))
      );
    } else {
      setQuantityConfigs((prev) =>
        prev.map((r) => (r.id === id ? { ...r, sort: Math.max(0, r.sort + delta) } : r))
      );
    }
  };

  const handleAmountInput = (id: number, value: number) => {
    setAmountConfigs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, amount: Math.max(0, value) } : r))
    );
  };

  const handleQuantityInput = (id: number, value: number) => {
    setQuantityConfigs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, quantity: Math.max(1, value) } : r))
    );
  };

  const handleIconUrlChange = (id: number, url: string) => {
    setAmountConfigs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, iconUrl: url } : r))
    );
  };

  const handleSave = () => {
    alert('Configuration saved successfully.');
  };

  return (
    <Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tab label="Room Red Envelope" sx={{ color: tab === 0 ? 'error.main' : 'text.secondary', fontWeight: tab === 0 ? 600 : 400 }} />
        <Tab label="World Red Envelope" sx={{ color: tab === 1 ? 'error.main' : 'text.secondary', fontWeight: tab === 1 ? 600 : 400 }} />
      </Tabs>

      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box component="h3" sx={{ m: 0, fontSize: 16, fontWeight: 600 }}>
            Total Amount Config (Room Fortune Bag)
          </Box>
          <Button variant="contained" size="small" startIcon={<Add />} onClick={handleAddAmount}>
            Add Amount
          </Button>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>Amount (coins)</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Icon URL</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Sort</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Operation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {amountConfigs.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => handleAmountChange(row.id, -1000)} sx={{ p: 0.5 }}>
                        <Remove fontSize="small" />
                      </IconButton>
                      <TextField
                        type="number"
                        value={row.amount}
                        onChange={(e) => handleAmountInput(row.id, parseInt(e.target.value, 10) || 0)}
                        size="small"
                        inputProps={{ min: 0, style: { width: 100, textAlign: 'center' } }}
                        sx={{ '& .MuiInputBase-input': { py: 0.75 } }}
                      />
                      <IconButton size="small" onClick={() => handleAmountChange(row.id, 1000)} sx={{ p: 0.5 }}>
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 40, height: 40, position: 'relative', borderRadius: 1, overflow: 'hidden', flexShrink: 0 }}>
                        <Image src={row.iconUrl} alt="" fill sizes="40px" style={{ objectFit: 'cover' }} unoptimized />
                      </Box>
                      <TextField size="small" value={row.iconUrl} onChange={(e) => handleIconUrlChange(row.id, e.target.value)} placeholder="Icon URL" sx={{ minWidth: 200 }} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => handleSortChange('amount', row.id, -1)} sx={{ p: 0.5 }}>
                        <Remove fontSize="small" />
                      </IconButton>
                      <TextField type="number" value={row.sort} onChange={(e) => setAmountConfigs((prev) => prev.map((r) => (r.id === row.id ? { ...r, sort: Math.max(0, parseInt(e.target.value, 10) || 0) } : r)))} size="small" inputProps={{ style: { width: 50, textAlign: 'center' } }} sx={{ '& .MuiInputBase-input': { py: 0.75 } }} />
                      <IconButton size="small" onClick={() => handleSortChange('amount', row.id, 1)} sx={{ p: 0.5 }}>
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" color="error" startIcon={<Delete />} onClick={() => handleDeleteAmount(row.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box component="h3" sx={{ m: 0, fontSize: 16, fontWeight: 600 }}>
            Quantity Config (Room Fortune Bag)
          </Box>
          <Button variant="contained" size="small" startIcon={<Add />} onClick={handleAddQuantity}>
            Add Quantity
          </Button>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Sort</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Operation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quantityConfigs.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => handleQuantityChange(row.id, -1)} sx={{ p: 0.5 }}>
                        <Remove fontSize="small" />
                      </IconButton>
                      <TextField
                        type="number"
                        value={row.quantity}
                        onChange={(e) => handleQuantityInput(row.id, parseInt(e.target.value, 10) || 1)}
                        size="small"
                        inputProps={{ min: 1, style: { width: 80, textAlign: 'center' } }}
                        sx={{ '& .MuiInputBase-input': { py: 0.75 } }}
                      />
                      <IconButton size="small" onClick={() => handleQuantityChange(row.id, 1)} sx={{ p: 0.5 }}>
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => handleSortChange('quantity', row.id, -1)} sx={{ p: 0.5 }}>
                        <Remove fontSize="small" />
                      </IconButton>
                      <TextField type="number" value={row.sort} onChange={(e) => setQuantityConfigs((prev) => prev.map((r) => (r.id === row.id ? { ...r, sort: Math.max(0, parseInt(e.target.value, 10) || 0) } : r)))} size="small" inputProps={{ style: { width: 50, textAlign: 'center' } }} sx={{ '& .MuiInputBase-input': { py: 0.75 } }} />
                      <IconButton size="small" onClick={() => handleSortChange('quantity', row.id, 1)} sx={{ p: 0.5 }}>
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" color="error" startIcon={<Delete />} onClick={() => handleDeleteQuantity(row.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button variant="contained" color="success" size="large" onClick={handleSave} sx={{ px: 4, py: 1.5 }}>
          Save Config
        </Button>
      </Box>
    </Box>
  );
}
