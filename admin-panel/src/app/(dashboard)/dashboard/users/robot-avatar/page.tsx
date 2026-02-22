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
  Link,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  Add,
  Search,
  SmartToy,
  Person,
  DeleteSweep,
  ExpandMore,
  ExpandLess,
  Clear,
} from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { UserActionModals } from '../UserActionModals';
import { useTabsStore } from '@/store/tabs';
import type { UserManagementRecord, UserManagementFilters } from '@/types/user-management';
import { fetchUsers } from '@/services/user-management';

function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '';
  return Array.from(countryCode)
    .map((c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
    .join('');
}

export default function RobotAvatarPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<UserManagementRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [actionModal, setActionModal] = useState<'edit' | 'ban' | 'accountLog' | 'contribution' | 'giftLog' | 'giftReceived' | 'guardian' | 'wishlist' | 'loginLog' | 'prohibitedPayment' | 'pullBlack' | 'statusConfirm' | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserManagementRecord | null>(null);
  const [filters, setFilters] = useState({
    userId: '',
    nickname: '',
    phone: '',
    equipmentNo: '',
    registerIp: '',
    email: '',
    googleId: '',
    appleId: '',
    valid: 'all',
    type: 'all',
    vip: 'all',
    country: 'all',
    registrationTimeStart: '',
    registrationTimeEnd: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const f: UserManagementFilters = {};
      if (filters.userId) f.userId = filters.userId;
      if (filters.nickname) f.nickname = filters.nickname;
      if (filters.phone) f.phone = filters.phone;
      if (filters.equipmentNo) f.equipmentNo = filters.equipmentNo;
      if (filters.registerIp) f.registerIp = filters.registerIp;
      if (filters.email) f.email = filters.email;
      if (filters.googleId) f.googleId = filters.googleId;
      if (filters.appleId) f.appleId = filters.appleId;
      if (filters.valid !== 'all') f.valid = filters.valid;
      if (filters.type !== 'all') f.type = filters.type;
      if (filters.vip !== 'all') f.vip = filters.vip;
      if (filters.country !== 'all') f.country = filters.country;
      if (filters.registrationTimeStart) f.registrationTimeStart = filters.registrationTimeStart;
      if (filters.registrationTimeEnd) f.registrationTimeEnd = filters.registrationTimeEnd;
      f.robotAvatarOnly = true;
      const res = await fetchUsers(f, page + 1, perPage);
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filters]);

  useEffect(() => {
    addTab({
      id: '/dashboard/users/robot-avatar',
      label: 'Robot avatar',
      path: '/dashboard/users/robot-avatar',
      breadcrumbs: ['Home', 'User Management', 'Robot avatar'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleQuery = () => {
    setPage(0);
    load();
  };

  const handleClear = () => {
    setFilters({
      userId: '',
      nickname: '',
      phone: '',
      equipmentNo: '',
      registerIp: '',
      email: '',
      googleId: '',
      appleId: '',
      valid: 'all',
      type: 'all',
      vip: 'all',
      country: 'all',
      registrationTimeStart: '',
      registrationTimeEnd: '',
    });
    setPage(0);
  };

  const handleExport = () => {
    // TODO: API integration for export
  };

  const handleClearBalance = () => {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to clear all user balances? This action cannot be undone.')) {
      // TODO: API integration
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const openAction = (modal: NonNullable<typeof actionModal>, row: UserManagementRecord) => {
    setSelectedUser(row);
    setActionModal(modal);
  };
  const closeAction = () => {
    setActionModal(null);
    setSelectedUser(null);
  };
  const handleStatusConfirm = () => {
    // TODO: API call to update status
    closeAction();
  };
  const handleChangePerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPerPage(Number(e.target.value));
    setPage(0);
  };

  const stickyFirst = {
    position: 'sticky' as const,
    left: 0,
    zIndex: 3,
    minWidth: 100,
    bgcolor: 'grey.50',
    boxShadow: '2px 0 4px -2px rgba(0,0,0,0.08)',
  };
  const stickyLast = {
    position: 'sticky' as const,
    right: 0,
    zIndex: 3,
    minWidth: 56,
    bgcolor: 'grey.50',
    boxShadow: '-2px 0 4px -2px rgba(0,0,0,0.08)',
  };
  const stickyFirstBody = { ...stickyFirst, zIndex: 2, bgcolor: 'background.paper' };
  const stickyLastBody = { ...stickyLast, zIndex: 2, bgcolor: 'background.paper' };

  const tableHeaders = [
    'User ID',
    'User nickname',
    'Avatar',
    'Country',
    'Phone number',
    'Number of Diamonds',
    'Consumption amount',
    'Withdrawable balance',
    'Operation',
  ];

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>Robot Avatar</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Search, filter, and manage robot avatar accounts</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" startIcon={<Add />} size="medium">Add</Button>
          <Button variant="contained" color="success" onClick={handleExport} size="medium">Export</Button>
        </Box>
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 2, mb: 2, overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.5,
            bgcolor: 'grey.50',
            borderBottom: 1,
            borderColor: 'divider',
            cursor: 'pointer',
            '&:hover': { bgcolor: 'action.hover' },
          }}
          onClick={() => setFilterExpanded((p) => !p)}
        >
          <Typography variant="subtitle2" fontWeight={600} color="text.secondary">Filters</Typography>
          <IconButton size="small">{filterExpanded ? <ExpandLess /> : <ExpandMore />}</IconButton>
        </Box>
        <Collapse in={filterExpanded}>
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <TextField size="small" sx={{ minWidth: 140 }} placeholder="User ID" value={filters.userId} onChange={(e) => setFilters((p) => ({ ...p, userId: e.target.value }))} variant="outlined" />
              <TextField size="small" sx={{ minWidth: 140 }} placeholder="Nickname" value={filters.nickname} onChange={(e) => setFilters((p) => ({ ...p, nickname: e.target.value }))} variant="outlined" />
              <TextField size="small" sx={{ minWidth: 140 }} placeholder="Phone" value={filters.phone} onChange={(e) => setFilters((p) => ({ ...p, phone: e.target.value }))} variant="outlined" />
              <TextField size="small" sx={{ minWidth: 140 }} placeholder="Email" value={filters.email} onChange={(e) => setFilters((p) => ({ ...p, email: e.target.value }))} variant="outlined" />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Country</InputLabel>
                <Select value={filters.country} label="Country" onChange={(e) => setFilters((p) => ({ ...p, country: e.target.value }))}>
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="US">US</MenuItem>
                  <MenuItem value="BD">BD</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Status</InputLabel>
                <Select value={filters.valid} label="Status" onChange={(e) => setFilters((p) => ({ ...p, valid: e.target.value }))}>
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="yes">Valid</MenuItem>
                  <MenuItem value="no">Invalid</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>VIP</InputLabel>
                <Select value={filters.vip} label="VIP" onChange={(e) => setFilters((p) => ({ ...p, vip: e.target.value }))}>
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
              <TextField size="small" sx={{ minWidth: 140 }} type="date" label="Registration from" InputLabelProps={{ shrink: true }} value={filters.registrationTimeStart} onChange={(e) => setFilters((p) => ({ ...p, registrationTimeStart: e.target.value }))} variant="outlined" />
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <TextField size="small" sx={{ minWidth: 140 }} placeholder="Equipment No" value={filters.equipmentNo} onChange={(e) => setFilters((p) => ({ ...p, equipmentNo: e.target.value }))} variant="outlined" />
              <TextField size="small" sx={{ minWidth: 140 }} placeholder="Register IP" value={filters.registerIp} onChange={(e) => setFilters((p) => ({ ...p, registerIp: e.target.value }))} variant="outlined" />
              <TextField size="small" sx={{ minWidth: 140 }} placeholder="Google ID" value={filters.googleId} onChange={(e) => setFilters((p) => ({ ...p, googleId: e.target.value }))} variant="outlined" />
              <TextField size="small" sx={{ minWidth: 140 }} placeholder="Apple ID" value={filters.appleId} onChange={(e) => setFilters((p) => ({ ...p, appleId: e.target.value }))} variant="outlined" />
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Type</InputLabel>
                <Select value={filters.type} label="Type" onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}>
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="robot">Robot</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button variant="contained" size="small" startIcon={<Search />} onClick={handleQuery}>Search</Button>
              <Button variant="outlined" size="small" startIcon={<Clear />} onClick={handleClear} color="inherit">Clear</Button>
            </Box>
          </Box>
        </Collapse>
        {!filterExpanded && (
          <Box sx={{ px: 2, py: 1.5, display: 'flex', gap: 1 }}>
            <Button variant="contained" size="small" startIcon={<Search />} onClick={handleQuery}>Search</Button>
            <Button variant="outlined" size="small" startIcon={<Clear />} onClick={handleClear} color="inherit">Clear</Button>
          </Box>
        )}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteSweep />}
          onClick={handleClearBalance}
          sx={{ borderStyle: 'dashed' }}
        >
          Clear all user balances
        </Button>
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 560, overflowX: 'auto' }}>
          <Table size="small" stickyHeader sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ '& th': { bgcolor: 'grey.50', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary', borderBottom: '1px solid', borderColor: 'divider', py: 1.25 } }}>
                {tableHeaders.map((h, i) => (
                  <TableCell
                    key={h}
                    align={h.includes('Diamonds') || h.includes('amount') || h.includes('balance') ? 'right' : 'left'}
                    sx={i === 0 ? stickyFirst : i === tableHeaders.length - 1 ? stickyLast : undefined}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                    <CircularProgress size={32} sx={{ mr: 1.5, verticalAlign: 'middle' }} />
                    <Typography component="span" variant="body2" color="text.secondary">Loading robot avatars...</Typography>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                    <Typography variant="body2" color="text.secondary">No robot avatars found. Adjust your filters or add a new one.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      '&:hover': { bgcolor: 'action.hover' },
                      '&:hover td:first-of-type': { bgcolor: 'action.hover' },
                      '&:hover td:last-of-type': { bgcolor: 'action.hover' },
                    }}
                  >
                    <TableCell sx={stickyFirstBody}>{row.userId}</TableCell>
                    <TableCell>
                      <Link href="#" color="primary" underline="hover" sx={{ cursor: 'pointer', fontWeight: 500 }}>
                        {row.nickname}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {row.isRobotAvatar ? (
                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
                          <SmartToy />
                        </Avatar>
                      ) : (
                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'grey.300' }}>
                          <Person />
                        </Avatar>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {row.countryCode && <span>{getFlagEmoji(row.countryCode)}</span>}
                        {row.country || '—'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        {row.phone || '—'}
                        {row.phone && (
                          <Box component="span" sx={{ display: 'block' }}>
                            <Link href="#" color="primary" sx={{ fontSize: 12, cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); }}>
                              Ban
                            </Link>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right">{row.diamonds}</TableCell>
                    <TableCell align="right">{row.consumptionAmount.toLocaleString()}</TableCell>
                    <TableCell align="right">{row.withdrawableBalance.toFixed(2)}</TableCell>
                    <TableCell sx={{ ...stickyLastBody, whiteSpace: 'nowrap' }}>
                      <OperationButton
                        items={[
                          { label: 'Edit profile', onClick: () => openAction('edit', row) },
                          { label: 'Prohibited payment', onClick: () => openAction('prohibitedPayment', row) },
                          { label: 'Account Log', onClick: () => openAction('accountLog', row) },
                          { label: 'One click to pull black', onClick: () => openAction('pullBlack', row) },
                          { label: 'Contribution List', onClick: () => openAction('contribution', row) },
                          { label: 'Gift log', onClick: () => openAction('giftLog', row) },
                          { label: 'Gift Received Log', onClick: () => openAction('giftReceived', row) },
                          { label: 'Guardian List', onClick: () => openAction('guardian', row) },
                          { label: 'Wishlist', onClick: () => openAction('wishlist', row) },
                          { label: 'Login Log', onClick: () => openAction('loginLog', row) },
                        ]}
                        dangerItems={[{ label: 'Ban user', onClick: () => openAction('ban', row) }]}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', p: 1.5, borderTop: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={perPage}
            onRowsPerPageChange={handleChangePerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage=""
            labelDisplayedRows={({ from, to, count }) => `Total ${count} • ${from}-${to} of ${count}`}
          />
        </Box>
      </Paper>

      <UserActionModals
        modal={actionModal}
        user={selectedUser}
        onClose={closeAction}
        onConfirm={handleStatusConfirm}
      />
    </Box>
  );
}
