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
import { Search, Clear } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { NobleRechargeRecord } from '@/types/noble';
import { demoNobleRechargeRecords } from '@/lib/demo-data';

export default function NobleRechargeRecordsPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data] = useState<NobleRechargeRecord[]>(demoNobleRechargeRecords);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({ userNickname: '', dateStart: '', dateEnd: '' });

  useEffect(() => {
    addTab({
      id: '/dashboard/noble/recharge-records',
      label: 'Noble recharge records',
      path: '/dashboard/noble/recharge-records',
      breadcrumbs: ['Home', 'Prop management', 'Noble Management', 'Noble recharge records'],
    });
  }, [addTab]);

  const filtered = useMemo(() => {
    let result = [...data];
    if (filters.userNickname.trim()) {
      const k = filters.userNickname.toLowerCase();
      result = result.filter(
        (r) =>
          r.userNickname.toLowerCase().includes(k) ||
          String(r.userId).toLowerCase().includes(k)
      );
    }
    if (filters.dateStart) {
      result = result.filter((r) => r.addTime >= filters.dateStart);
    }
    if (filters.dateEnd) {
      result = result.filter((r) => r.addTime <= filters.dateEnd);
    }
    return result;
  }, [data, filters]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({ userNickname: '', dateStart: '', dateEnd: '' });
    setPage(0);
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
          <TextField
            size="small"
            label="User nickname"
            placeholder="Please enter user nickname"
            value={filters.userNickname}
            onChange={(e) => setFilters((p) => ({ ...p, userNickname: e.target.value }))}
            sx={{ minWidth: 200 }}
          />
          <TextField
            size="small"
            type="datetime-local"
            label="Date"
            value={filters.dateStart}
            onChange={(e) => setFilters((p) => ({ ...p, dateStart: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
          />
          <TextField
            size="small"
            type="datetime-local"
            label="to"
            value={filters.dateEnd}
            onChange={(e) => setFilters((p) => ({ ...p, dateEnd: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
          />
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
            Query
          </Button>
          <Button variant="outlined" color="error" startIcon={<Clear />} onClick={handleClear}>
            Clear conditions
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>User ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>User nickname</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Noble name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Consumption amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Add Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.userId}</TableCell>
                  <TableCell>{row.userNickname}</TableCell>
                  <TableCell>{row.nobleName}</TableCell>
                  <TableCell>{row.consumptionAmount}</TableCell>
                  <TableCell>{row.addTime}</TableCell>
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
          labelDisplayedRows={({ from, to, count }) => `Total ${count} • ${from}-${to}`}
        />
      </Paper>
    </Box>
  );
}
