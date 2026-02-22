'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Tabs,
  Tab,
} from '@mui/material';
import { Add, Search, Edit, Settings, Delete } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { Role, RoleFilters } from '@/types/role';
import {
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
} from '@/services/role';
import { RoleAddDialog } from './RoleAddDialog';
import { RoleEditDialog } from './RoleEditDialog';
import { PermissionSettingDialog } from './PermissionSettingDialog';

export default function RolesPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<Role[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [roleNameFilter, setRoleNameFilter] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Role | null>(null);
  const [permissionRole, setPermissionRole] = useState<Role | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const filters: RoleFilters = roleNameFilter ? { roleName: roleNameFilter } : {};
      const res = await fetchRoles(filters, page + 1, perPage);
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, roleNameFilter]);

  useEffect(() => {
    addTab({
      id: '/dashboard/system/roles',
      label: 'Role Management',
      path: '/dashboard/system/roles',
      breadcrumbs: ['Home', 'System Management', 'Role Management'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = () => {
    setPage(0);
    load();
  };

  const handleAdd = async (roleCode: string, roleName: string, note: string, status: 'Ban' | 'Unban') => {
    await createRole({ roleCode, roleName, note, status });
    setAddOpen(false);
    load();
  };

  const handleEdit = async (
    id: number,
    roleCode: string,
    roleName: string,
    note: string,
    status: 'Ban' | 'Unban'
  ) => {
    await updateRole(id, { roleCode, roleName, note, status });
    setEditItem(null);
    load();
  };

  const handleDelete = async (id: number) => {
    await deleteRole(id);
    load();
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangePerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPerPage(Number(e.target.value));
    setPage(0);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center' }}>
        <TextField
          size="small"
          label="Role Name"
          placeholder="Search by role name"
          value={roleNameFilter}
          onChange={(e) => setRoleNameFilter(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <Button variant="contained" startIcon={<Search />} onClick={handleSearch}>
          Search
        </Button>
        <Button variant="contained" startIcon={<Add />} onClick={() => setAddOpen(true)}>
          Add
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Role Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.roleName}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="contained"
                      color={row.status === 'Unban' ? 'success' : 'error'}
                      sx={{ pointerEvents: 'none', minWidth: 80 }}
                    >
                      {row.status}
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      startIcon={<Edit />}
                      onClick={() => setEditItem(row)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    {row.canEditPermissions !== false && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<Settings />}
                        onClick={() => setPermissionRole(row)}
                        sx={{ mr: 1 }}
                      >
                        Permission setting
                      </Button>
                    )}
                    {row.canDelete !== false && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDelete(row.id)}
                      >
                        Delete
                      </Button>
                    )}
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
            justifyContent: 'flex-end',
            p: 1.5,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={perPage}
            onRowsPerPageChange={handleChangePerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage=""
            labelDisplayedRows={({ from, to, count }) =>
              `Total ${count} • ${from}-${to} of ${count}`
            }
          />
        </Box>
      </TableContainer>

      <RoleAddDialog open={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} />
      {editItem && (
        <RoleEditDialog
          item={editItem}
          open={!!editItem}
          onClose={() => setEditItem(null)}
          onSave={handleEdit}
        />
      )}
      <PermissionSettingDialog
        role={permissionRole}
        open={!!permissionRole}
        onClose={() => setPermissionRole(null)}
      />
    </Box>
  );
}
