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
  TablePagination,
} from '@mui/material';
import { Search, Clear, Visibility } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { SignInListRecord } from '@/types/check-in';
import { demoSignInList } from '@/lib/demo-data';

export default function SignInListPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data] = useState<SignInListRecord[]>(demoSignInList);
  const [filters, setFilters] = useState({ userId: '' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    addTab({
      id: '/dashboard/check-in/sign-in-list',
      label: 'Sign-in List',
      path: '/dashboard/check-in/sign-in-list',
      breadcrumbs: ['Home', 'Prop Management', 'Check-in Management', 'Sign-in List'],
    });
  }, [addTab]);

  const filtered = useMemo(() => {
    let result = [...data];
    if (filters.userId.trim()) {
      const k = filters.userId.trim();
      result = result.filter((r) => String(r.userId).includes(k));
    }
    return result;
  }, [data, filters]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleQuery = () => setPage(0);

  const handleClear = () => {
    setFilters({ userId: '' });
    setPage(0);
  };

  const handleCheckInRecords = (row: SignInListRecord) => {
    // Navigate to check-in records for this user (placeholder - can add modal or new page)
    console.log('View check-in records for user', row.userId);
    alert(`View check-in records for user ${row.userNickname} (ID: ${row.userId})`);
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
          <TextField
            size="small"
            label="User ID"
            placeholder="Please enter user ID"
            value={filters.userId}
            onChange={(e) => setFilters((f) => ({ ...f, userId: e.target.value }))}
            sx={{ minWidth: 200 }}
          />
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
            Query
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Clear />}
            onClick={handleClear}
          >
            Clear conditions
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        <TableContainer sx={{ maxHeight: 520, overflowX: 'auto' }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Number</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 160 }}>User nickname</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>User ID</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 170 }}>Last check-in time</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 130 }}>Check in frequency</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>Continuous check-in</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 140 }} align="right">
                  Operation
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}
                >
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.userNickname}</TableCell>
                  <TableCell>{row.userId}</TableCell>
                  <TableCell>{row.lastCheckInTime}</TableCell>
                  <TableCell>{row.checkInFrequency}</TableCell>
                  <TableCell>{row.continuousCheckIn}</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      startIcon={<Visibility />}
                      onClick={() => handleCheckInRecords(row)}
                    >
                      Check-in records
                    </Button>
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
    </Box>
  );
}
