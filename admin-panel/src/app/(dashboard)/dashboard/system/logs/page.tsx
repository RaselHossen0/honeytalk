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
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Search, Delete, Schedule } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { OperationLog } from '@/types/operation-log';
import { demoOperationLogs } from '@/lib/demo-data';

export default function LogsPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [keyword, setKeyword] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [data, setData] = useState<OperationLog[]>(demoOperationLogs);
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    addTab({
      id: '/dashboard/system/logs',
      label: 'Detailed System Operation Logs',
      path: '/dashboard/system/logs',
      breadcrumbs: ['Home', 'System Management', 'Detailed System Operation Logs'],
    });
  }, [addTab]);

  const filtered = useMemo(() => {
    let result = [...data];
    if (keyword.trim()) {
      const k = keyword.toLowerCase();
      result = result.filter(
        (r) =>
          r.logInformation.toLowerCase().includes(k) ||
          r.module.toLowerCase().includes(k) ||
          r.action.toLowerCase().includes(k) ||
          r.ip.includes(k)
      );
    }
    if (startTime) {
      const start = new Date(startTime).getTime();
      if (!isNaN(start)) {
        result = result.filter((r) => new Date(r.addTime).getTime() >= start);
      }
    }
    if (endTime) {
      const end = new Date(endTime).getTime();
      if (!isNaN(end)) {
        result = result.filter((r) => new Date(r.addTime).getTime() <= end);
      }
    }
    return result;
  }, [data, keyword, startTime, endTime]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected(paginatedRows.map((r) => r.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id: string | number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleDelete = (row: OperationLog) => {
    if (confirm(`Delete log entry #${row.number}?`)) {
      setData((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    if (confirm(`Delete ${selected.length} log entries?`)) {
      setData((prev) => prev.filter((r) => !selected.includes(r.id)));
      setSelected([]);
    }
  };

  const handleQuery = () => {
    setPage(0);
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            size="small"
            sx={{ minWidth: 180 }}
          />
          <TextField
            label="Start Time"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Schedule fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 220 }}
          />
          <TextField
            label="End Time"
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Schedule fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 220 }}
          />
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
            Query
          </Button>
        </Box>
      </Paper>

        <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
          <TableContainer sx={{ maxHeight: 520 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < paginatedRows.length}
                      checked={paginatedRows.length > 0 && selected.length === paginatedRows.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 90 }}>Number</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 220 }}>Log information</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 170 }}>Add Time</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 160 }}>IP</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 130 }}>System Administrator</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 90 }}>Result</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 130 }}>Module</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 120 }}>Function</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 100 }} align="right">
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
                    <TableCell>{row.logInformation}</TableCell>
                    <TableCell>{row.addTime}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: 13 }}>{row.ip}</TableCell>
                    <TableCell>{row.systemAdministrator}</TableCell>
                    <TableCell>
                      <Box
                        component="span"
                        sx={{
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: row.result === 'Success' ? 'success.light' : 'error.light',
                          color: row.result === 'Success' ? 'success.dark' : 'error.dark',
                          fontWeight: 500,
                          fontSize: 13,
                        }}
                      >
                        {row.result}
                      </Box>
                    </TableCell>
                    <TableCell>{row.module}</TableCell>
                    <TableCell>{row.action}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="error" onClick={() => handleDelete(row)} title="Delete">
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {selected.length > 0 && (
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={handleBulkDelete}
              >
                Delete ({selected.length} selected)
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
