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
  Typography,
  Pagination,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { Search, ArrowBack } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { InvitationSubordinateRecord } from '@/types/invitation';
import { fetchInvitationSubordinates } from '@/services/invitation';

export default function InvitationDetailsPage({
  params,
  searchParams,
}: {
  params: { inviterId: string };
  searchParams: { nickname?: string };
}) {
  const inviterId = parseInt(params.inviterId, 10);
  const inviterNickname = searchParams.nickname ?? '';

  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<InvitationSubordinateRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [userIdFilter, setUserIdFilter] = useState('');
  const [invitingUsersIdFilter, setInvitingUsersIdFilter] = useState(String(inviterId));

  const load = useCallback(async () => {
    if (Number.isNaN(inviterId)) return;
    setLoading(true);
    try {
      const f = userIdFilter ? { userId: userIdFilter } : undefined;
      const res = await fetchInvitationSubordinates(inviterId, f, page + 1, perPage);
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [inviterId, page, perPage, userIdFilter]);

  useEffect(() => {
    setInvitingUsersIdFilter(String(inviterId));
  }, [inviterId]);

  useEffect(() => {
    addTab({
      id: `/dashboard/users/invitations/${inviterId}`,
      label: 'Invitation Details',
      path: `/dashboard/users/invitations/${inviterId}${inviterNickname ? `?nickname=${encodeURIComponent(inviterNickname)}` : ''}`,
      breadcrumbs: ['Home', 'User Management', 'Invitation Management', 'View Details'],
    });
  }, [addTab, inviterId, inviterNickname]);

  useEffect(() => {
    load();
  }, [load]);

  const handleQuery = () => {
    setPage(0);
    load();
  };

  const handleClear = () => {
    setUserIdFilter('');
    setPage(0);
  };

  const totalPages = Math.ceil(total / perPage) || 1;

  if (Number.isNaN(inviterId)) {
    return (
      <Box sx={{ py: 2 }}>
        <Typography color="error">Invalid inviter ID</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Button
          component={Link}
          href="/dashboard/users/invitations"
          startIcon={<ArrowBack />}
          size="small"
          color="inherit"
        >
          Back
        </Button>
        <Typography variant="h6" fontWeight={600}>
          Subordinate users {inviterNickname ? `(${inviterNickname})` : ''}
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            label="User ID"
            placeholder="Please enter user ID"
            value={userIdFilter}
            onChange={(e) => setUserIdFilter(e.target.value)}
            sx={{ minWidth: 180 }}
          />
          <TextField
            size="small"
            label="Inviting Users ID"
            value={invitingUsersIdFilter}
            InputProps={{ readOnly: true }}
            sx={{ minWidth: 160 }}
          />
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery} size="medium">
            Query
          </Button>
          <Button variant="outlined" color="error" onClick={handleClear} size="medium">
            Clear conditions
          </Button>
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ '& th': { bgcolor: 'grey.50', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary', borderBottom: '1px solid', borderColor: 'divider', py: 1.25 } }}>
                <TableCell>User ID</TableCell>
                <TableCell>User nickname</TableCell>
                <TableCell>Inviter Nickname</TableCell>
                <TableCell>InviterID</TableCell>
                <TableCell align="right">Inviter Reward (Diamond)</TableCell>
                <TableCell align="right">Total recharge amount (diamonds)</TableCell>
                <TableCell align="right">Recharge Reward (Diamond)</TableCell>
                <TableCell>Joining time</TableCell>
                <TableCell>Operation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      No subordinate users found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                    <TableCell>{row.userId}</TableCell>
                    <TableCell>{row.userNickname}</TableCell>
                    <TableCell>{row.inviterNickname}</TableCell>
                    <TableCell>{row.inviterId}</TableCell>
                    <TableCell align="right">{row.inviterRewardDiamond}</TableCell>
                    <TableCell align="right">{row.totalRechargeAmount}</TableCell>
                    <TableCell align="right">{row.rechargeRewardDiamond}</TableCell>
                    <TableCell>{row.joiningTime}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" size="small" component={Link} href="#" disabled>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
          <Typography variant="body2" color="text.secondary">
            Total {total}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
        </Box>
      </Paper>
    </Box>
  );
}
