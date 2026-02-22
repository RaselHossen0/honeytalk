'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
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
  Grid,
  Pagination,
  Typography,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { InvitationRecord, InvitationFilters } from '@/types/invitation';
import { fetchInvitationRecords } from '@/services/invitation';

export default function InvitationsPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<InvitationRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    invitingUsersId: '',
    secondLevelInviterId: '',
    thirdLevelInviterId: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const f: InvitationFilters = {};
      if (filters.invitingUsersId) f.invitingUsersId = filters.invitingUsersId;
      if (filters.secondLevelInviterId) f.secondLevelInviterId = filters.secondLevelInviterId;
      if (filters.thirdLevelInviterId) f.thirdLevelInviterId = filters.thirdLevelInviterId;
      const res = await fetchInvitationRecords(f, page + 1, perPage);
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filters]);

  useEffect(() => {
    addTab({
      id: '/dashboard/users/invitations',
      label: 'Invitation Management',
      path: '/dashboard/users/invitations',
      breadcrumbs: ['Home', 'User Management', 'Invitation Management'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleQuery = () => {
    setPage(0);
  };

  const handleClear = () => {
    setFilters({
      invitingUsersId: '',
      secondLevelInviterId: '',
      thirdLevelInviterId: '',
    });
    setPage(0);
  };

  const totalPages = Math.ceil(total / perPage) || 1;

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            size="small"
            fullWidth
            label="Inviting Users ID"
            placeholder="Inviting Users ID"
            value={filters.invitingUsersId}
            onChange={(e) => setFilters((p) => ({ ...p, invitingUsersId: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            size="small"
            fullWidth
            label="Second level inviter ID"
            placeholder="Second level inviter ID"
            value={filters.secondLevelInviterId}
            onChange={(e) => setFilters((p) => ({ ...p, secondLevelInviterId: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            size="small"
            fullWidth
            label="Third level inviterID"
            placeholder="Third level inviterID"
            value={filters.thirdLevelInviterId}
            onChange={(e) => setFilters((p) => ({ ...p, thirdLevelInviterId: e.target.value }))}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
          Query
        </Button>
        <Button variant="outlined" color="error" onClick={handleClear}>
          Clear conditions
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600 }}>User ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Invite User Nickname</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Total number of invited users</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Total revenue</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Invitation remaining balance</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Superior inviter</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Inviter from superior</TableCell>
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
                  <TableCell>{row.userId}</TableCell>
                  <TableCell>{row.inviteUserNickname}</TableCell>
                  <TableCell align="right">{row.totalInvitedUsers}</TableCell>
                  <TableCell align="right">{row.totalRevenue.toFixed(2)}</TableCell>
                  <TableCell align="right">{row.invitationRemainingBalance.toFixed(2)}</TableCell>
                  <TableCell>{row.superiorInviter || '-'}</TableCell>
                  <TableCell>{row.inviterFromSuperior || '-'}</TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/users/invitations/${row.userId}?nickname=${encodeURIComponent(row.inviteUserNickname)}`}
                      passHref
                      legacyBehavior
                    >
                      <Button variant="contained" color="primary" size="small" component="a">
                        View Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 2,
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Total {total}
          </Typography>
          <FormControl size="small" sx={{ minWidth: 90 }}>
            <Select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(0);
              }}
              sx={{ height: 32, fontSize: 13 }}
            >
              <MenuItem value={5}>5/page</MenuItem>
              <MenuItem value={10}>10/page</MenuItem>
              <MenuItem value={25}>25/page</MenuItem>
              <MenuItem value={50}>50/page</MenuItem>
            </Select>
          </FormControl>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(_, p) => setPage(p - 1)}
            color="primary"
            size="small"
            showFirstButton
            showLastButton
          />
        </Box>
      </TableContainer>
    </Box>
  );
}
