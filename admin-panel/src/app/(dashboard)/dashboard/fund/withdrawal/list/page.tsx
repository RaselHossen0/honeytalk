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
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Search, Clear, FileDownload, CheckCircle, Cancel, Person, AttachMoney } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { Withdrawal } from '@/types/fund';
import { demoWithdrawals } from '@/lib/demo-data';

const STATUS_OPTIONS = ['Select', 'Pending', 'Pending Review', 'Completed', 'Rejected'];

export default function WithdrawalListPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<Withdrawal[]>(demoWithdrawals);
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    anchorId: '',
    anchorNickname: '',
    status: '',
    timeFrom: '',
    timeTo: '',
  });

  useEffect(() => {
    addTab({
      id: '/dashboard/fund/withdrawal/list',
      label: 'Withdrawal List',
      path: '/dashboard/fund/withdrawal/list',
      breadcrumbs: ['Home', 'Fund Management', 'Withdrawal management', 'Withdrawal List'],
    });
  }, [addTab]);

  const filtered = useMemo(() => {
    let result = [...data];
    if (filters.anchorId.trim()) {
      const k = filters.anchorId.trim();
      result = result.filter((r) => String(r.anchorId).includes(k));
    }
    if (filters.anchorNickname.trim()) {
      const k = filters.anchorNickname.toLowerCase().trim();
      result = result.filter((r) => r.anchorNickname.toLowerCase().includes(k));
    }
    if (filters.status && filters.status !== 'Select') {
      result = result.filter((r) => r.status === filters.status);
    }
    if (filters.timeFrom) {
      result = result.filter((r) => r.applicationTime >= filters.timeFrom);
    }
    if (filters.timeTo) {
      result = result.filter((r) => r.applicationTime <= filters.timeTo + ' 23:59:59');
    }
    return result;
  }, [data, filters]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelected(paginatedRows.map((r) => r.id));
    else setSelected([]);
  };

  const handleSelectOne = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleAllow = (row: Withdrawal) => {
    setData((prev) =>
      prev.map((r) =>
        r.id === row.id ? { ...r, status: 'Completed' as const } : r
      )
    );
  };

  const handleNotAllowed = (row: Withdrawal) => {
    setData((prev) =>
      prev.map((r) =>
        r.id === row.id ? { ...r, status: 'Rejected' as const } : r
      )
    );
  };

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({ anchorId: '', anchorNickname: '', status: '', timeFrom: '', timeTo: '' });
    setPage(0);
  };

  const handleBatchReview = () => {
    if (selected.length > 0) {
      setData((prev) =>
        prev.map((r) => (selected.includes(r.id) ? { ...r, status: 'Pending Review' as const } : r))
      );
      setSelected([]);
    }
  };

  const handleBatchWithdrawal = () => {
    if (selected.length > 0) {
      setData((prev) =>
        prev.map((r) => (selected.includes(r.id) ? { ...r, status: 'Completed' as const } : r))
      );
      setSelected([]);
    }
  };

  const handleExport = () => {
    // Placeholder for export - would typically trigger CSV/Excel download
    alert('Export functionality would download withdrawal list data.');
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
          <TextField
            size="small"
            label="Anchor ID"
            placeholder="Please enter anchor ID"
            value={filters.anchorId}
            onChange={(e) => setFilters((p) => ({ ...p, anchorId: e.target.value }))}
            sx={{ minWidth: 160 }}
          />
          <TextField
            size="small"
            label="Anchor Nickname"
            placeholder="Please enter nickname"
            value={filters.anchorNickname}
            onChange={(e) => setFilters((p) => ({ ...p, anchorNickname: e.target.value }))}
            sx={{ minWidth: 160 }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
            >
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt === 'Select' ? '' : opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            size="small"
            label="Time from"
            type="datetime-local"
            value={filters.timeFrom}
            onChange={(e) => setFilters((p) => ({ ...p, timeFrom: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 180 }}
          />
          <TextField
            size="small"
            label="Time to"
            type="datetime-local"
            value={filters.timeTo}
            onChange={(e) => setFilters((p) => ({ ...p, timeTo: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 180 }}
          />
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
            Query
          </Button>
          <Button variant="outlined" color="error" startIcon={<Clear />} onClick={handleClear}>
            Clear conditions
          </Button>
          <Button variant="outlined" startIcon={<FileDownload />} onClick={handleExport}>
            Export
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        <TableContainer sx={{ maxHeight: 600, overflowX: 'auto' }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ bgcolor: 'grey.50' }}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < paginatedRows.length}
                    checked={paginatedRows.length > 0 && selected.length === paginatedRows.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 70 }}>Number</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 90 }}>Anchor ID</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 120 }}>Anchor Nickname</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 120 }}>Account type</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 120 }}>Bank Account Number</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 120 }}>Account Name</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 90 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 90 }}>Coin</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 160 }}>Application time</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 120 }}>Application Note</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 110 }}>Whether to review</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 160 }}>Confirm payment time</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 100 }}>Operation notes</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 160 }}>Business order number</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 120 }}>Payment notes</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 140 }} align="right">
                  Operation
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.id} hover selected={selected.includes(row.id)}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(row.id)}
                      onChange={() => handleSelectOne(row.id)}
                    />
                  </TableCell>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.anchorId}</TableCell>
                  <TableCell>{row.anchorNickname}</TableCell>
                  <TableCell>{row.accountType}</TableCell>
                  <TableCell>{row.bankAccountNumber}</TableCell>
                  <TableCell>{row.accountName}</TableCell>
                  <TableCell>{row.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>{row.coin.toLocaleString()}</TableCell>
                  <TableCell>{row.applicationTime}</TableCell>
                  <TableCell>{row.applicationNote || '-'}</TableCell>
                  <TableCell>{row.whetherToReview}</TableCell>
                  <TableCell>{row.confirmPaymentTime || '-'}</TableCell>
                  <TableCell>{row.operationNotes || '-'}</TableCell>
                  <TableCell>{row.businessOrderNumber}</TableCell>
                  <TableCell>{row.paymentNotes || '-'}</TableCell>
                  <TableCell align="right" sx={{ minWidth: 140 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, width: '100%', minWidth: 120 }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircle />}
                        onClick={() => handleAllow(row)}
                        fullWidth
                      >
                        Allow
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        startIcon={<Cancel />}
                        onClick={() => handleNotAllowed(row)}
                        fullWidth
                      >
                        Not allowed
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {selected.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<Person />}
              onClick={handleBatchReview}
            >
              Batch review
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<AttachMoney />}
              onClick={handleBatchWithdrawal}
            >
              Batch withdrawal
            </Button>
          </Box>
        )}

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
