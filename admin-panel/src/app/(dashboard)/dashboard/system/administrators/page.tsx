'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import {
  Box,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
} from '@mui/material';
import { Search, Add, Edit, Delete, Close } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import { ImageUpload } from '@/components/common/ImageUpload';
import type { Administrator } from '@/types/administrator';
import { demoAdministrators } from '@/lib/demo-data';

export default function AdministratorsPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [search, setSearch] = useState('');
  const [data, setData] = useState<Administrator[]>(demoAdministrators);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Administrator | null>(null);
  const [form, setForm] = useState({
    account: '',
    password: '',
    userNickname: '',
    gender: '' as '' | Administrator['gender'],
    phoneNumber: '',
    email: '',
    avatarUrl: '',
    status: '' as '' | Administrator['status'],
  });

  useEffect(() => {
    addTab({
      id: '/dashboard/system/administrators',
      label: 'Administrator Management',
      path: '/dashboard/system/administrators',
      breadcrumbs: ['Home', 'System Management', 'Administrator Management'],
    });
  }, [addTab]);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const k = search.toLowerCase();
    return data.filter(
      (r) =>
        r.account.toLowerCase().includes(k) ||
        r.userNickname.toLowerCase().includes(k) ||
        (r.email && r.email.toLowerCase().includes(k)) ||
        (r.phoneNumber && r.phoneNumber.includes(k))
    );
  }, [data, search]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleQuery = () => setPage(0);

  const handleAdd = () => {
    setEditing(null);
    setForm({
      account: '',
      password: '',
      userNickname: '',
      gender: '',
      phoneNumber: '',
      email: '',
      avatarUrl: '',
      status: '',
    });
    setEditOpen(true);
  };

  const handleEdit = (row: Administrator) => {
    setEditing(row);
    setForm({
      account: row.account,
      password: '',
      userNickname: row.userNickname,
      gender: row.gender,
      phoneNumber: row.phoneNumber ?? '',
      email: row.email ?? '',
      avatarUrl: row.avatarUrl ?? '',
      status: row.status,
    });
    setEditOpen(true);
  };

  const handleDelete = (row: Administrator) => {
    if (row.canDelete === false) return;
    if (confirm(`Delete administrator "${row.account}"?`)) {
      setData((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  const handleSave = () => {
    const gender = form.gender || 'Male';
    const status = form.status || 'Unban';
    if (editing) {
      setData((prev) =>
        prev.map((r) =>
          r.id === editing.id
            ? { ...r, userNickname: form.userNickname, gender, phoneNumber: form.phoneNumber, email: form.email, avatarUrl: form.avatarUrl, status }
            : r
        )
      );
    } else {
      if (!form.account.trim()) return;
      const nextId = Math.max(...data.map((r) => Number(r.id)), 0) + 1;
      setData((prev) => [
        ...prev,
        {
          id: nextId,
          account: form.account,
          userNickname: form.userNickname || form.account,
          gender,
          phoneNumber: form.phoneNumber,
          email: form.email,
          avatarUrl: form.avatarUrl,
          status,
          canDelete: true,
        } as Administrator,
      ]);
    }
    setEditOpen(false);
  };

  const toggleStatus = (row: Administrator) => {
    if (row.account === 'admin') return;
    setData((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? { ...r, status: r.status === 'Unban' ? 'Ban' : 'Unban' }
          : r
      )
    );
  };

  const canSave = editing
    ? true
    : !!form.account.trim() && !!form.userNickname.trim() && !!form.status;

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Please enter the administrator account or nickname"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ minWidth: 320 }}
          />
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
            Query
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
            Add
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        <TableContainer sx={{ maxHeight: 520 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 100 }}>Account</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 80 }}>Avatar</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 100 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 120 }} align="right">
                  Operation
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.account}</TableCell>
                  <TableCell>
                    {row.avatarUrl ? (
                      <Box sx={{ width: 40, height: 40, position: 'relative', borderRadius: 1, overflow: 'hidden' }}>
                        <Image src={row.avatarUrl} alt="" fill sizes="40px" style={{ objectFit: 'cover' }} unoptimized />
                      </Box>
                    ) : (
                      <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                        {(row.userNickname || row.account)[0]?.toUpperCase() || '?'}
                      </Avatar>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="contained"
                      color={row.status === 'Unban' ? 'success' : 'error'}
                      onClick={() => toggleStatus(row)}
                      disabled={row.account === 'admin'}
                    >
                      {row.status}
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="contained" color="primary" onClick={() => handleEdit(row)}>
                      Edit
                    </Button>
                    {row.canDelete !== false && (
                      <Button size="small" variant="contained" color="error" sx={{ ml: 1 }} onClick={() => handleDelete(row)}>
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filtered.length}
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

      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {editing ? 'Edit' : 'Create'}
          <IconButton size="small" onClick={() => setEditOpen(false)} aria-label="Close">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="* Account"
              value={form.account}
              onChange={(e) => setForm((f) => ({ ...f, account: e.target.value }))}
              fullWidth
              required
              disabled={!!editing}
              placeholder="Login account name"
            />
            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              fullWidth
              placeholder={editing ? 'Leave blank to keep current' : ''}
            />
            <TextField
              label="* User"
              value={form.userNickname}
              onChange={(e) => setForm((f) => ({ ...f, userNickname: e.target.value }))}
              fullWidth
              required
              helperText="nickname"
            />
            <FormControl fullWidth>
              <InputLabel id="admin-gender-label" shrink>Gender</InputLabel>
              <Select
                labelId="admin-gender-label"
                value={form.gender}
                label="Gender"
                onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value as Administrator['gender'] }))}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Please select</em>
                </MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Phone"
              value={form.phoneNumber}
              onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
              fullWidth
              helperText="number"
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              fullWidth
            />
            <ImageUpload
              label="Avatar"
              value={form.avatarUrl}
              onChange={(url) => setForm((f) => ({ ...f, avatarUrl: url }))}
              accept="image/jpeg,image/png"
              helperText="Upload rule: Uploaded images can only be JPG/PNG"
            />
            <FormControl fullWidth required>
              <InputLabel id="admin-status-label" shrink>Status</InputLabel>
              <Select
                labelId="admin-status-label"
                value={form.status}
                label="Status"
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Administrator['status'] }))}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Please select</em>
                </MenuItem>
                <MenuItem value="Unban">Unban</MenuItem>
                <MenuItem value="Ban">Ban</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!editing && !canSave}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
