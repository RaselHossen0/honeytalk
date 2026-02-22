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
  TablePagination,
  IconButton,
  Chip,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { Task } from '@/types/task';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from '@/services/task';
import { TaskAddDialog } from './TaskAddDialog';
import { TaskEditDialog } from './TaskEditDialog';

export default function TasksPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Task | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchTasks(page + 1, perPage);
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage]);

  useEffect(() => {
    addTab({
      id: '/dashboard/users/tasks',
      label: 'Task Management',
      path: '/dashboard/users/tasks',
      breadcrumbs: ['Home', 'User Management', 'Task Management'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected(data.map((r) => r.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    setSelected((prev) => prev.filter((x) => x !== id));
    load();
  };

  const handleBulkDelete = async () => {
    for (const id of selected) await deleteTask(id);
    setSelected([]);
    load();
  };

  const handleAdd = async (payload: {
    title: string;
    description?: string;
    type: Task['type'];
    targetQuantity: number;
    rewardAmount: number;
    taskTimes: number;
    timeInterval: number;
    status?: 'Valid' | 'Invalid';
  }) => {
    await createTask(payload);
    setAddOpen(false);
    load();
  };

  const handleEdit = async (
    id: number,
    payload: {
      title: string;
      description?: string;
      type: Task['type'];
      targetQuantity: number;
      rewardAmount: number;
      taskTimes: number;
      timeInterval: number;
      status: 'Valid' | 'Invalid';
    }
  ) => {
    await updateTask(id, payload);
    setEditItem(null);
    load();
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={() => setAddOpen(true)}>
          Add
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
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
              <TableCell><strong>Number</strong></TableCell>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell align="right"><strong>Target quantity</strong></TableCell>
              <TableCell align="right"><strong>Reward Amount</strong></TableCell>
              <TableCell align="right"><strong>Task times</strong></TableCell>
              <TableCell align="right"><strong>Time Interval (s)</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="right"><strong>Operation</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selected.includes(row.id)} onChange={() => handleSelect(row.id)} />
                  </TableCell>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell align="right">{row.targetQuantity.toLocaleString()}</TableCell>
                  <TableCell align="right">{row.rewardAmount.toLocaleString()}</TableCell>
                  <TableCell align="right">{row.taskTimes}</TableCell>
                  <TableCell align="right">{row.timeInterval}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={row.status === 'Valid' ? 'success' : 'default'}
                      size="small"
                      variant="filled"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => setEditItem(row)}
                      title="Edit"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(row.id)}
                      title="Delete"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
            p: 1.5,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            disabled={selected.length === 0}
            onClick={handleBulkDelete}
            size="small"
          >
            Delete
          </Button>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={perPage}
            rowsPerPageOptions={[perPage]}
            labelRowsPerPage=""
            labelDisplayedRows={({ from, to, count }) => `Total ${count} • ${from}-${to} of ${count}`}
          />
        </Box>
      </TableContainer>

      <TaskAddDialog open={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} />
      {editItem && (
        <TaskEditDialog
          item={editItem}
          open={!!editItem}
          onClose={() => setEditItem(null)}
          onSave={handleEdit}
        />
      )}
    </Box>
  );
}
