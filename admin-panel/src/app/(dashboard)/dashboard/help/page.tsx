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
  Pagination,
  Typography,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import { ImageUpload } from '@/components/common/ImageUpload';
import type { FaqItem, FaqPayload, FaqGroup } from '@/types/faq';
import { FAQ_GROUPS, fetchFaqs, createFaq, updateFaq, deleteFaq, batchDeleteFaqs } from '@/services/faq';

export default function FrequentlyAskedQuestionsPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<FaqItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [filters, setFilters] = useState({ group: 'All', question: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FaqPayload>({
    group: 'Account',
    question: '',
    answer: '',
    imageUrl: '',
    frontEndDisplay: 'Yes',
    sort: 0,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchFaqs(page + 1, perPage, {
        group: filters.group === 'All' ? undefined : filters.group,
        question: filters.question || undefined,
      });
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filters.group, filters.question]);

  useEffect(() => {
    addTab({
      id: '/dashboard/help',
      label: 'Frequently Asked Questions',
      path: '/dashboard/help',
      breadcrumbs: ['Home', 'Article Management', 'Frequently Asked Questions'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleQuery = () => load();

  const handleClearFilters = () => {
    setFilters({ group: 'All', question: '' });
    setPage(0);
  };

  const handleAdd = () => {
    setEditingId(null);
    setForm({ group: 'Account', question: '', answer: '', imageUrl: '', frontEndDisplay: 'Yes', sort: 0 });
    setDialogOpen(true);
  };

  const handleEdit = (row: FaqItem) => {
    setEditingId(row.id);
    setForm({
      group: row.group,
      question: row.question,
      answer: row.answer,
      imageUrl: row.imageUrl ?? '',
      frontEndDisplay: row.frontEndDisplay,
      sort: row.sort,
    });
    setDialogOpen(true);
  };

  const handleDialogConfirm = async () => {
    if (editingId) {
      await updateFaq(editingId, form);
    } else {
      await createFaq(form);
    }
    setDialogOpen(false);
    load();
  };

  const handleDelete = async (row: FaqItem) => {
    if (!confirm(`Delete this FAQ?`)) return;
    await deleteFaq(row.id);
    load();
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
    await batchDeleteFaqs(selected);
    setSelected([]);
    load();
  };

  const totalPages = Math.ceil(total / perPage) || 1;
  const allSelected = data.length > 0 && selected.length === data.length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Add
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">Group:</Typography>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={filters.group}
              onChange={(e) => setFilters((p) => ({ ...p, group: e.target.value }))}
              sx={{ height: 36 }}
            >
              <MenuItem value="All">All</MenuItem>
              {FAQ_GROUPS.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">Question</Typography>
          <TextField
            size="small"
            placeholder="Please enter a question"
            value={filters.question}
            onChange={(e) => setFilters((p) => ({ ...p, question: e.target.value }))}
            sx={{ width: 220 }}
          />
        </Box>
        <Button variant="contained" onClick={handleQuery}>
          Query
        </Button>
        <Button variant="outlined" color="error" onClick={handleClearFilters}>
          Clear conditions
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={allSelected}
                  indeterminate={selected.length > 0 && selected.length < data.length}
                  onChange={handleSelectAll}
                  size="small"
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Group</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Question</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Front-end display</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sort</TableCell>
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
                  <TableCell>{row.group}</TableCell>
                  <TableCell>
                    <Typography
                      component="a"
                      href="#"
                      variant="body2"
                      color="primary"
                      sx={{ cursor: 'pointer', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleEdit(row);
                      }}
                    >
                      {row.question}
                    </Typography>
                  </TableCell>
                  <TableCell>{row.frontEndDisplay}</TableCell>
                  <TableCell>{row.sort}</TableCell>
                  <TableCell>
                    <Typography component="a" href="#" variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                      {row.status}
                    </Typography>
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

        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary">
            Total {total}
          </Typography>
          <FormControl size="small" sx={{ minWidth: 90 }}>
            <Select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(0); }} sx={{ height: 32, fontSize: 13 }}>
              <MenuItem value={10}>10/page</MenuItem>
              <MenuItem value={25}>25/page</MenuItem>
              <MenuItem value={50}>50/page</MenuItem>
            </Select>
          </FormControl>
          <Pagination count={totalPages} page={page + 1} onChange={(_, p) => setPage(p - 1)} color="primary" size="small" />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Go to
            </Typography>
            <TextField
              size="small"
              type="number"
              value={page + 1}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!isNaN(v) && v >= 1 && v <= totalPages) setPage(v - 1);
              }}
              inputProps={{ min: 1, max: totalPages }}
              sx={{ width: 60 }}
            />
          </Box>
        </Box>
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
            <FormControl fullWidth required>
              <Box component="label" sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5, display: 'block' }}>
                * Group
              </Box>
              <Select
                value={form.group}
                onChange={(e) => setForm((p) => ({ ...p, group: e.target.value as FaqGroup }))}
                size="small"
                sx={{ mt: 0 }}
              >
                {FAQ_GROUPS.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <ImageUpload
              label="Optional image"
              value={form.imageUrl ?? ''}
              onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
              helperText="Optional image for the FAQ. Uploaded to AWS S3."
            />

            <TextField
              fullWidth
              required
              label="* Question"
              value={form.question}
              onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
              placeholder="Please enter a question"
            />
            <TextField
              fullWidth
              required
              label="* Answer"
              multiline
              rows={4}
              value={form.answer}
              onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))}
              placeholder="Please enter an answer"
            />
            <TextField
              fullWidth
              type="number"
              label="Sort"
              value={form.sort ?? 0}
              onChange={(e) => setForm((p) => ({ ...p, sort: parseInt(e.target.value, 10) || 0 }))}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleDialogConfirm} disabled={!form.question.trim() || !form.answer.trim()}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
