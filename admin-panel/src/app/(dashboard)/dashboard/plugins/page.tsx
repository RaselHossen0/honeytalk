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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { ImageUpload } from '@/components/common/ImageUpload';
import { useTabsStore } from '@/store/tabs';
import type { PluginConfig } from '@/types/plugin';
import { demoPluginConfigs } from '@/lib/demo-data';

export default function PluginConfigurationPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<PluginConfig[]>(demoPluginConfigs);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<PluginConfig | null>(null);
  const [form, setForm] = useState({
    name: '',
    iconUrl: '',
    status: 'Valid' as 'Valid' | 'Invalid',
    sort: 0,
  });

  useEffect(() => {
    addTab({
      id: '/dashboard/plugins',
      label: 'Plugin Configuration',
      path: '/dashboard/plugins',
      breadcrumbs: ['Home', 'Plugin management', 'Plugin Configuration'],
    });
  }, [addTab]);

  const handleEdit = (row: PluginConfig) => {
    setEditing(row);
    setForm({
      name: row.name,
      iconUrl: row.iconUrl,
      status: row.status,
      sort: row.sort,
    });
    setEditOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      setData((p) =>
        p.map((r) => (r.id === editing.id ? { ...r, ...form } : r))
      );
    }
    setEditOpen(false);
  };

  return (
    <Box>
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        <TableContainer sx={{ maxHeight: 520, overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>Number</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 180 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Icon</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 130 }}>Whether to enable</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 80 }}>Sort</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 120 }} align="right">
                  Operation
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}
                >
                  <TableCell>{row.number}</TableCell>
                  <TableCell>
                    <Box
                      component="span"
                      onClick={() => handleEdit(row)}
                      sx={{
                        color: 'primary.main',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      {row.name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        position: 'relative',
                        borderRadius: 1,
                        overflow: 'hidden',
                        bgcolor: 'grey.200',
                      }}
                    >
                      <Image
                        src={row.iconUrl}
                        alt={row.name}
                        fill
                        sizes="48px"
                        style={{ objectFit: 'cover' }}
                        unoptimized
                      />
                    </Box>
                  </TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.sort}</TableCell>
                  <TableCell align="right" sx={{ width: 56 }}>
                    <OperationButton
                      items={[{ label: 'Edit', onClick: () => handleEdit(row), icon: <Edit fontSize="small" /> }]}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Game Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            fullWidth
            required
          />
          <ImageUpload
            label="Game Icon"
            value={form.iconUrl}
            onChange={(url) => setForm((f) => ({ ...f, iconUrl: url }))}
            helperText="Upload rule: Uploaded images can only be JPG/PNG. Files will be stored on AWS S3."
          />
          <FormControl fullWidth>
            <InputLabel>Whether to enable</InputLabel>
            <Select
              value={form.status}
              label="Whether to enable"
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.value as 'Valid' | 'Invalid' }))
              }
            >
              <MenuItem value="Valid">Valid</MenuItem>
              <MenuItem value="Invalid">Invalid</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Sort"
            type="number"
            value={form.sort || ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, sort: parseInt(e.target.value, 10) || 0 }))
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
