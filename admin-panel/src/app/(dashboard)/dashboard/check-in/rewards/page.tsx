'use client';

import { useState, useMemo, useEffect } from 'react';
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
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import type { CheckInReward } from '@/types/check-in';
import { demoCheckInRewards } from '@/lib/demo-data';

export default function CheckInRewardsPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<CheckInReward[]>(demoCheckInRewards);
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<CheckInReward | null>(null);
  const [form, setForm] = useState({
    days: 1,
    diamondReward: 0,
  });

  const now = '2026-02-17 22:45:32';

  useEffect(() => {
    addTab({
      id: '/dashboard/check-in/rewards',
      label: 'Check-in Rewards',
      path: '/dashboard/check-in/rewards',
      breadcrumbs: ['Home', 'Prop Management', 'Check-in Management', 'Check-in Rewards'],
    });
  }, [addTab]);

  const handleAdd = () => {
    setEditing(null);
    setForm({ days: 1, diamondReward: 3 });
    setEditOpen(true);
  };

  const handleEdit = (row: CheckInReward) => {
    setEditing(row);
    setForm({ days: row.days, diamondReward: row.diamondReward });
    setEditOpen(true);
  };

  const handleDelete = (row: CheckInReward) => {
    if (confirm(`Delete reward for Day ${row.days}?`)) {
      setData((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    if (confirm(`Delete ${selected.length} reward(s)?`)) {
      setData((prev) => prev.filter((r) => !selected.includes(r.id)));
      setSelected([]);
    }
  };

  const handleSave = () => {
    if (editing) {
      setData((prev) =>
        prev.map((r) =>
          r.id === editing.id
            ? { ...r, ...form, modificationTime: now }
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
          modificationTime: now,
          addTime: now,
        } as CheckInReward,
      ]);
    }
    setEditOpen(false);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelected(data.map((r) => r.id));
    else setSelected([]);
  };

  const handleSelectOne = (id: string | number) => {
    if (selected.includes(id)) setSelected(selected.filter((s) => s !== id));
    else setSelected([...selected, id]);
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Add
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        <TableContainer sx={{ maxHeight: 520, overflowX: 'auto' }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ bgcolor: 'grey.50' }}>
                  <Checkbox
                    indeterminate={
                      selected.length > 0 && selected.length < data.length
                    }
                    checked={data.length > 0 && selected.length === data.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 90 }}>
                  Number
                </TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 80 }}>
                  Days
                </TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 130 }}>
                  Diamond Reward
                </TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 160 }}>
                  Modification time
                </TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 160 }}>
                  Add Time
                </TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 140 }} align="right">
                  Operation
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  selected={selected.includes(row.id)}
                  sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(row.id)}
                      onChange={() => handleSelectOne(row.id)}
                    />
                  </TableCell>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.days}</TableCell>
                  <TableCell>{row.diamondReward}</TableCell>
                  <TableCell>{row.modificationTime}</TableCell>
                  <TableCell>{row.addTime}</TableCell>
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
        </TableContainer>
        {selected.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleBulkDelete}
            >
              Delete
            </Button>
          </Box>
        )}
      </Paper>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit' : 'Add'} Check-in Reward</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Days"
            type="number"
            value={form.days || ''}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                days: parseInt(e.target.value, 10) || 0,
              }))
            }
            fullWidth
          />
          <TextField
            label="Diamond Reward"
            type="number"
            value={form.diamondReward || ''}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                diamondReward: parseInt(e.target.value, 10) || 0,
              }))
            }
            fullWidth
          />
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
