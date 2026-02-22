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
  TablePagination,
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
import type { DurationTask } from '@/types/duration-task';
import { demoDurationTasks } from '@/lib/demo-data';

export default function DurationTasksPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<DurationTask[]>(demoDurationTasks);
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<DurationTask | null>(null);
  const [form, setForm] = useState({ title: '', reward: '', videoDurationMinutes: 60, status: 'Valid' });

  useEffect(() => {
    addTab({
      id: '/dashboard/live/duration-tasks',
      label: 'Live Video Duration Task',
      path: '/dashboard/live/duration-tasks',
      breadcrumbs: ['Home', 'Live Management', 'Duration Tasks', 'Live Video Duration Task'],
    });
  }, [addTab]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, page, rowsPerPage]);

  const handleAdd = () => {
    setEditing(null);
    setForm({ title: '60 minute', reward: '1000', videoDurationMinutes: 60, status: 'Valid' });
    setEditOpen(true);
  };

  const handleEdit = (row: DurationTask) => {
    setEditing(row);
    setForm({
      title: row.title,
      reward: String(row.reward),
      videoDurationMinutes: row.videoDurationMinutes,
      status: row.status,
    });
    setEditOpen(true);
  };

  const handleDelete = (row: DurationTask) => {
    if (confirm(`Delete task "${row.title}"?`)) {
      setData((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    if (confirm(`Delete ${selected.length} task(s)?`)) {
      setData((prev) => prev.filter((r) => !selected.includes(r.id)));
      setSelected([]);
    }
  };

  const handleSave = () => {
    if (editing) {
      setData((prev) =>
        prev.map((r) =>
          r.id === editing.id ? { ...r, ...form, reward: form.reward, number: r.number } : r
        )
      );
    } else {
      const nextNum = Math.max(...data.map((r) => r.number), 0) + 1;
      setData((prev) => [
        ...prev,
        { id: nextNum, number: nextNum, ...form, reward: form.reward } as DurationTask,
      ]);
    }
    setEditOpen(false);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelected(paginatedRows.map((r) => r.id));
    else setSelected([]);
  };

  const handleSelectOne = (id: string | number) => {
    if (selected.includes(id)) setSelected(selected.filter((s) => s !== id));
    else setSelected([...selected, id]);
  };

  return (
    <Box>
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, minWidth: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
          <Button variant="contained" startIcon={<Add />} onClick={handleAdd} sx={{ alignSelf: 'flex-start' }}>
            Add
          </Button>
          {selected.length > 0 && (
            <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleBulkDelete} sx={{ alignSelf: 'flex-start' }}>
              Delete
            </Button>
          )}
        </Box>
        <TableContainer sx={{ maxHeight: 520, overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < paginatedRows.length}
                    checked={paginatedRows.length > 0 && selected.length === paginatedRows.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 80 }}>Number</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>reward</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>Video duration (minutes)</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 140 }} align="right">
                  Operation
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.id} hover selected={selected.includes(row.id)} sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selected.includes(row.id)} onChange={() => handleSelectOne(row.id)} />
                  </TableCell>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.reward}</TableCell>
                  <TableCell>{row.videoDurationMinutes}</TableCell>
                  <TableCell>{row.status}</TableCell>
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
        <TablePagination
          component="div"
          count={data.length}
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
        <DialogTitle>{editing ? 'Edit' : 'Add'} Live Video Duration Task</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            fullWidth
            placeholder="e.g. 60 minute"
          />
          <TextField
            label="reward"
            value={form.reward}
            onChange={(e) => setForm((f) => ({ ...f, reward: e.target.value }))}
            fullWidth
            placeholder="e.g. 100000"
          />
          <TextField
            label="Video duration (minutes)"
            type="number"
            value={form.videoDurationMinutes}
            onChange={(e) => setForm((f) => ({ ...f, videoDurationMinutes: parseInt(e.target.value, 10) || 0 }))}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={form.status}
              label="Status"
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
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
