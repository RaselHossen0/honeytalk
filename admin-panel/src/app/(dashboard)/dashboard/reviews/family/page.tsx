'use client';

import { useState, useMemo, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useRouter } from 'next/navigation';
import { useTabsStore } from '@/store/tabs';
import type { Family } from '@/types/family';

const DEMO_FAMILIES: Family[] = [
  { id: 65, number: 65, familyName: 'girls', familyLeaderId: 166589, familyLeaderNickname: 'Snow', familyLogo: 'https://i.pravatar.cc/80?img=1', familyManifesto: "Let's be beautiful together", familyUserNumber: 4, familyIncome: 668818659, patriarchName: 'Snow', creationTime: '2022-07-11 12:13:38', status: 'Approved' },
  { id: 77, number: 77, familyName: 'OA', familyLeaderId: 166586, familyLeaderNickname: 'DOLLAR', familyLogo: 'https://i.pravatar.cc/80?img=2', familyManifesto: 'popo', familyUserNumber: 1, familyIncome: 344295447, patriarchName: 'DOLLAR', creationTime: '2024-03-07 08:48:15', status: 'Approved' },
  { id: 85, number: 85, familyName: 'Agency', familyLeaderId: 168777, familyLeaderNickname: 'Mr.Gx777', familyLogo: 'https://i.pravatar.cc/80?img=3', familyManifesto: 'Localization Support Agency', familyUserNumber: 0, familyIncome: 25821601, patriarchName: 'Mr.Gx777', creationTime: '2025-12-11 15:59:07', status: 'Approved' },
  { id: 71, number: 71, familyName: 'Relief Store', familyLeaderId: 166859, familyLeaderNickname: 'Wang Han', familyLogo: 'https://i.pravatar.cc/80?img=4', familyManifesto: 'Relieve worries and sorrows', familyUserNumber: 3, familyIncome: 11487, patriarchName: 'Wang Han', creationTime: '2023-06-06 06:59:17', status: 'Approved' },
  { id: 83, number: 83, familyName: 'gghh', familyLeaderId: 166725, familyLeaderNickname: 'MiSHAL M ÜGåL', familyLogo: 'https://i.pravatar.cc/80?img=5', familyManifesto: 'hhhh', familyUserNumber: 0, familyIncome: 4285, patriarchName: 'MiSHAL M ÜGåL', creationTime: '2025-02-27 07:07:09', status: 'Pending' },
  { id: 69, number: 69, familyName: 'tttt1', familyLeaderId: 166729, familyLeaderNickname: 'xxxp', familyLogo: 'https://i.pravatar.cc/80?img=6', familyManifesto: 'yyy', familyUserNumber: 0, familyIncome: 7, patriarchName: 'xxxp', creationTime: '2022-12-07 20:23:01', status: 'Approved' },
];

export default function FamilyReviewPage() {
  const router = useRouter();
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<Family[]>(DEMO_FAMILIES);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [filters, setFilters] = useState({
    familyId: '',
    familyName: '',
    familyLeaderId: '',
    patriarchName: '',
    userId: '',
    status: 'all',
    creationTimeStart: '',
    creationTimeEnd: '',
  });

  useEffect(() => {
    addTab({
      id: '/dashboard/reviews/family',
      label: 'Family review',
      path: '/dashboard/reviews/family',
      breadcrumbs: ['Home', 'User Management', 'Family Management', 'Family review'],
    });
  }, [addTab]);

  const filtered = useMemo(() => {
    let result = [...data];
    if (filters.familyId) result = result.filter((r) => String(r.id).includes(filters.familyId));
    if (filters.familyName) {
      const k = filters.familyName.toLowerCase();
      result = result.filter((r) => r.familyName.toLowerCase().includes(k));
    }
    if (filters.familyLeaderId) result = result.filter((r) => String(r.familyLeaderId).includes(filters.familyLeaderId));
    if (filters.patriarchName) {
      const k = filters.patriarchName.toLowerCase();
      result = result.filter((r) => r.familyLeaderNickname.toLowerCase().includes(k) || r.patriarchName.toLowerCase().includes(k));
    }
    if (filters.userId) result = result.filter((r) => String(r.familyLeaderId).includes(filters.userId));
    if (filters.status && filters.status !== 'all') result = result.filter((r) => r.status === filters.status);
    if (filters.creationTimeStart) result = result.filter((r) => r.creationTime >= filters.creationTimeStart);
    if (filters.creationTimeEnd) result = result.filter((r) => r.creationTime <= filters.creationTimeEnd + ' 23:59:59');
    return result;
  }, [data, filters]);

  const paginated = useMemo(() => {
    const start = page * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page, perPage]);

  const totalPages = Math.ceil(filtered.length / perPage) || 1;

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({
      familyId: '',
      familyName: '',
      familyLeaderId: '',
      patriarchName: '',
      userId: '',
      status: 'all',
      creationTimeStart: '',
      creationTimeEnd: '',
    });
    setPage(0);
  };

  const handleFamilyDetail = () => router.push('/dashboard/users/family/list');

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
          <TextField size="small" label="Family ID" value={filters.familyId} onChange={(e) => setFilters((p) => ({ ...p, familyId: e.target.value }))} sx={{ minWidth: 120 }} />
          <TextField size="small" label="Family name" placeholder="Please enter a family name" value={filters.familyName} onChange={(e) => setFilters((p) => ({ ...p, familyName: e.target.value }))} sx={{ minWidth: 160 }} />
          <TextField size="small" label="Family Leader ID" value={filters.familyLeaderId} onChange={(e) => setFilters((p) => ({ ...p, familyLeaderId: e.target.value }))} sx={{ minWidth: 140 }} />
          <TextField size="small" label={"Patriarch's name"} placeholder="Please ent" value={filters.patriarchName} onChange={(e) => setFilters((p) => ({ ...p, patriarchName: e.target.value }))} sx={{ minWidth: 160 }} />
          <TextField size="small" label="User ID" value={filters.userId} onChange={(e) => setFilters((p) => ({ ...p, userId: e.target.value }))} sx={{ minWidth: 120 }} />
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Status</InputLabel>
            <Select value={filters.status} label="Status" onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
          <TextField size="small" type="date" label="Creation time" InputLabelProps={{ shrink: true }} value={filters.creationTimeStart} onChange={(e) => setFilters((p) => ({ ...p, creationTimeStart: e.target.value }))} sx={{ minWidth: 150 }} />
          <TextField size="small" type="date" label="to" InputLabelProps={{ shrink: true }} value={filters.creationTimeEnd} onChange={(e) => setFilters((p) => ({ ...p, creationTimeEnd: e.target.value }))} sx={{ minWidth: 150 }} />
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>Query</Button>
          <Button variant="outlined" color="error" startIcon={<Clear />} onClick={handleClear}>Clear conditions</Button>
        </Box>
      </Paper>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600, minWidth: 70 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Family name</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 70 }}>Family LOGO</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 160 }}>Family manifesto</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 100 }} align="right">Family user number</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 120 }} align="right">Family income</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>Patriarch{"'"}s name</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 160 }}>Creation time</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((row) => (
              <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                <TableCell>{row.number}</TableCell>
                <TableCell>{row.familyName}</TableCell>
                <TableCell>
                  {row.familyLogo ? (
                    <Box sx={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden' }}>
                      <img src={row.familyLogo} alt="" width={40} height={40} style={{ objectFit: 'cover' }} />
                    </Box>
                  ) : (
                    <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'grey.300' }} />
                  )}
                </TableCell>
                <TableCell sx={{ maxWidth: 200 }}>{row.familyManifesto}</TableCell>
                <TableCell align="right">{row.familyUserNumber}</TableCell>
                <TableCell align="right">{row.familyIncome.toLocaleString()}</TableCell>
                <TableCell>{row.familyLeaderNickname}({row.familyLeaderId})</TableCell>
                <TableCell>{row.creationTime}</TableCell>
                <TableCell>
                  <OperationButton
                    items={[{ label: 'Family detail', onClick: () => handleFamilyDetail() }]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box component="span" sx={{ fontSize: 14, color: 'text.secondary' }}>Total {filtered.length}</Box>
          <FormControl size="small" sx={{ minWidth: 90 }}>
            <Select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(0); }} sx={{ height: 32, fontSize: 13 }}>
              <MenuItem value={5}>5/page</MenuItem>
              <MenuItem value={10}>10/page</MenuItem>
              <MenuItem value={25}>25/page</MenuItem>
              <MenuItem value={50}>50/page</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button size="small" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>‹</Button>
            <Box component="span" sx={{ px: 1, fontSize: 14 }}>{page + 1}</Box>
            <Button size="small" disabled={page >= totalPages - 1} onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}>›</Button>
          </Box>
          <Box component="span" sx={{ fontSize: 14, color: 'text.secondary' }}>Go to</Box>
          <TextField size="small" type="number" value={page + 1} onChange={(e) => { const v = parseInt(e.target.value, 10); if (!isNaN(v) && v >= 1 && v <= totalPages) setPage(v - 1); }} sx={{ width: 60 }} inputProps={{ min: 1, max: totalPages }} />
        </Box>
      </TableContainer>
    </Box>
  );
}
