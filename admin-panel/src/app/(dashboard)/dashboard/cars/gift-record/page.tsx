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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { CarGiftRecord } from '@/types/car';
import { demoCarGiftRecords } from '@/lib/demo-data';

export default function CarGiftRecordPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<CarGiftRecord[]>(demoCarGiftRecords);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({ userId: '', type: 'all', timeStart: '', timeEnd: '' });

  useEffect(() => {
    addTab({
      id: '/dashboard/cars/gift-record',
      label: 'Gift Record',
      path: '/dashboard/cars/gift-record',
      breadcrumbs: ['Home', 'Prop Management', 'Car Management', 'Gift Record'],
    });
  }, [addTab]);

  const types = useMemo(() => Array.from(new Set(data.map((r) => r.type))), [data]);

  const filtered = useMemo(() => {
    let result = [...data];
    if (filters.userId.trim()) {
      const k = filters.userId.toLowerCase();
      result = result.filter(
        (r) =>
          String(r.userId).toLowerCase().includes(k) ||
          r.regularUser.toLowerCase().includes(k)
      );
    }
    if (filters.type && filters.type !== 'all') {
      result = result.filter((r) => r.type === filters.type);
    }
    if (filters.timeStart) {
      result = result.filter((r) => r.addTime >= filters.timeStart);
    }
    if (filters.timeEnd) {
      result = result.filter((r) => r.addTime <= filters.timeEnd);
    }
    return result;
  }, [data, filters]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({ userId: '', type: 'all', timeStart: '', timeEnd: '' });
    setPage(0);
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
            onChange={(e) => setFilters((p) => ({ ...p, userId: e.target.value }))}
            sx={{ minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={filters.type}
              label="Type"
              onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}
            >
              <MenuItem value="all">Select</MenuItem>
              {types.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            size="small"
            type="datetime-local"
            label="Time"
            value={filters.timeStart}
            onChange={(e) => setFilters((p) => ({ ...p, timeStart: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
          />
          <TextField
            size="small"
            type="datetime-local"
            label="to"
            value={filters.timeEnd}
            onChange={(e) => setFilters((p) => ({ ...p, timeEnd: e.target.value }))}
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
        <TableContainer sx={{ maxHeight: 520, overflowX: 'auto' }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 80 }}>Number</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 180 }}>Regular user</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 140 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 130 }}>Gifted time (Days)</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 120 }}>Note</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 170 }}>Add Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.regularUser}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.giftedTimeDays}</TableCell>
                  <TableCell>{row.note}</TableCell>
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
        />
      </Paper>
    </Box>
  );
}
