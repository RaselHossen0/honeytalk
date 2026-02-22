'use client';

import { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import type { AppVersion } from '@/types/version';
import { demoAppVersions } from '@/lib/demo-data';

export default function VersionListPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<AppVersion[]>(demoAppVersions);
  const [selected, setSelected] = useState<number[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<AppVersion | null>(null);
  const [form, setForm] = useState({
    versionNumber: '',
    versionContent: '',
    downloadAddress: '',
    platform: 'Android' as 'Android' | 'iOS',
    forceUpdate: 'Yes' as 'Yes' | 'No',
    whetherToPublish: 'Yes' as 'Yes' | 'No',
  });

  useEffect(() => {
    addTab({
      id: '/dashboard/versions',
      label: 'Version List',
      path: '/dashboard/versions',
      breadcrumbs: ['Home', 'Version Management', 'Version List'],
    });
  }, [addTab]);

  const handleAdd = () => {
    setEditing(null);
    setForm({
      versionNumber: '',
      versionContent: '',
      downloadAddress: '',
      platform: 'Android',
      forceUpdate: 'Yes',
      whetherToPublish: 'Yes',
    });
    setEditOpen(true);
  };

  const handleEdit = (row: AppVersion) => {
    setEditing(row);
    setForm({
      versionNumber: row.versionNumber,
      versionContent: row.versionContent,
      downloadAddress: row.downloadAddress,
      platform: row.platform,
      forceUpdate: row.forceUpdate,
      whetherToPublish: row.whetherToPublish,
    });
    setEditOpen(true);
  };

  const handleDelete = (row: AppVersion) => {
    if (confirm(`Delete version "${row.versionNumber}"?`)) {
      setData((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    if (confirm(`Delete ${selected.length} version(s)?`)) {
      setData((prev) => prev.filter((r) => !selected.includes(r.id)));
      setSelected([]);
    }
  };

  const handleSave = () => {
    if (editing) {
      setData((prev) =>
        prev.map((r) =>
          r.id === editing.id
            ? { ...r, ...form }
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
          ...form,
          time: new Date().toISOString().slice(0, 19).replace('T', ' '),
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

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          + Add
        </Button>
        <Box component="span" sx={{ color: 'text.secondary', fontSize: 14 }}>
          Download link (OSS service needs to configure its own domain name to use download)
        </Box>
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
              <TableCell sx={{ fontWeight: 600 }}>Version Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Version content</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 220 }}>Download address</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Platform</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Force Update</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Whether to publish</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
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
                <TableCell>{row.versionNumber}</TableCell>
                <TableCell sx={{ maxWidth: 200 }}>{row.versionContent || '-'}</TableCell>
                <TableCell sx={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis' }} title={row.downloadAddress}>{row.downloadAddress}</TableCell>
                <TableCell>{row.platform}</TableCell>
                <TableCell>{row.forceUpdate}</TableCell>
                <TableCell>{row.whetherToPublish}</TableCell>
                <TableCell>{row.time}</TableCell>
                <TableCell align="right" sx={{ width: 56 }}>
                  <OperationButton
                    items={[{ label: 'Edit', onClick: () => handleEdit(row), icon: <Edit fontSize="small" /> }]}
                    dangerItems={[{ label: 'Delete', onClick: () => handleDelete(row), icon: <Delete fontSize="small" /> }]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {selected.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleBulkDelete}>
              Delete
            </Button>
          </Box>
        )}
      </TableContainer>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit' : 'Add'} Version</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="Version Number" value={form.versionNumber} onChange={(e) => setForm((f) => ({ ...f, versionNumber: e.target.value }))} fullWidth required placeholder="e.g. 2025101201" />
          <TextField label="Version content" value={form.versionContent} onChange={(e) => setForm((f) => ({ ...f, versionContent: e.target.value }))} fullWidth multiline rows={3} placeholder="Release notes" />
          <TextField label="Download address" value={form.downloadAddress} onChange={(e) => setForm((f) => ({ ...f, downloadAddress: e.target.value }))} fullWidth required placeholder="https://..." />
          <FormControl fullWidth>
            <InputLabel>Platform</InputLabel>
            <Select value={form.platform} label="Platform" onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value as 'Android' | 'iOS' }))}>
              <MenuItem value="Android">Android</MenuItem>
              <MenuItem value="iOS">iOS</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Force Update</InputLabel>
            <Select value={form.forceUpdate} label="Force Update" onChange={(e) => setForm((f) => ({ ...f, forceUpdate: e.target.value as 'Yes' | 'No' }))}>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Whether to publish</InputLabel>
            <Select value={form.whetherToPublish} label="Whether to publish" onChange={(e) => setForm((f) => ({ ...f, whetherToPublish: e.target.value as 'Yes' | 'No' }))}>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
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
