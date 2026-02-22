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
  Collapse,
  Typography,
} from '@mui/material';
import React from 'react';
import { Search, Clear, Person, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { Withdrawal } from '@/types/fund';
import { demoPendingConfirmationWithdrawals } from '@/lib/demo-data';

const STATUS_OPTIONS = ['Select', 'Allow Payment', 'Completed'];

function DetailContent({ row }: { row: Withdrawal }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, maxWidth: 800, py: 2, px: 1 }}>
      <Box>
        <Typography variant="caption" color="text.secondary">Application time</Typography>
        <Typography variant="body2">{row.applicationTime}</Typography>
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary">Application Note</Typography>
        <Typography variant="body2">{row.applicationNote || '-'}</Typography>
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary">Whether to review</Typography>
        <Typography variant="body2">{row.whetherToReview}</Typography>
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary">Confirm payment time</Typography>
        <Typography variant="body2">{row.confirmPaymentTime || '-'}</Typography>
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary">Operation notes</Typography>
        <Typography variant="body2">{row.operationNotes || '-'}</Typography>
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary">Payment notes</Typography>
        <Typography variant="body2">{row.paymentNotes || '-'}</Typography>
      </Box>
    </Box>
  );
}

export default function WithdrawalPendingConfirmationPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<Withdrawal[]>(demoPendingConfirmationWithdrawals);
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    anchorId: '',
    anchorNickname: '',
    status: 'Allow Payment',
  });
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    addTab({
      id: '/dashboard/fund/withdrawal/pending-confirmation',
      label: 'Withdrawal Pending Confirmation Records',
      path: '/dashboard/fund/withdrawal/pending-confirmation',
      breadcrumbs: ['Home', 'Fund Management', 'Withdrawal management', 'Withdrawal Pending Confirmation Records'],
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

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({ anchorId: '', anchorNickname: '', status: 'Allow Payment' });
    setPage(0);
  };

  const handleBatchWithdrawal = () => {
    if (selected.length > 0) {
      setData((prev) =>
        prev.map((r) => (selected.includes(r.id) ? { ...r, status: 'Completed' as const, confirmPaymentTime: new Date().toISOString().replace('T', ' ').slice(0, 19) } : r))
      );
      setSelected([]);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const allSelected = paginatedRows.length > 0 && selected.length === paginatedRows.length;

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
            placeholder="Please enter the"
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
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
          </FormControl>
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
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={selected.length > 0 && selected.length < paginatedRows.length}
                    onChange={handleSelectAll}
                    size="small"
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Anchor ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Anchor Nickname</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Account type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Bank Account Number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Account Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Coin</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Appl</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Operation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow hover sx={{ '&:nth-of-type(4n+1)': { bgcolor: 'transparent' }, '&:nth-of-type(4n+2)': { bgcolor: 'grey.50' } }}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(row.id)}
                        onChange={() => handleSelectOne(row.id)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{row.number}</TableCell>
                    <TableCell>{row.anchorId}</TableCell>
                    <TableCell>{row.anchorNickname}</TableCell>
                    <TableCell>{row.accountType}</TableCell>
                    <TableCell>{row.bankAccountNumber}</TableCell>
                    <TableCell>{row.accountName}</TableCell>
                    <TableCell>{row.amount.toLocaleString()}</TableCell>
                    <TableCell>{row.coin}</TableCell>
                    <TableCell>{row.businessOrderNumber}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => toggleExpand(row.id)}
                        startIcon={expandedId === row.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      >
                        {expandedId === row.id ? 'Hide' : 'Details'}
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
                      <Collapse in={expandedId === row.id} timeout="auto" unmountOnExit>
                        <DetailContent row={row} />
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {filtered.length === 0 && (
          <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
            No Data
          </Box>
        )}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<Person />}
            onClick={handleBatchWithdrawal}
            disabled={selected.length === 0}
          >
            Batch withdrawal
          </Button>
        </Box>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[10, 25, 50]}
          labelRowsPerPage="per page"
          labelDisplayedRows={({ from, to, count }) => `Total ${count}`}
        />
      </Paper>
    </Box>
  );
}
