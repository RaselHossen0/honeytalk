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
  Checkbox,
  TablePagination,
} from '@mui/material';
import { Search, Delete, Clear } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import type { PushMessage } from '@/types/push-message';
import { demoPushMessages } from '@/lib/demo-data';

export default function PushMessagesPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<PushMessage[]>(demoPushMessages);
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    roomNumber: '',
    anchorNickname: '',
    type: '',
    status: '',
    creationTimeStart: '',
    creationTimeEnd: '',
  });

  useEffect(() => {
    addTab({
      id: '/dashboard/live/push-messages',
      label: 'Push Message List',
      path: '/dashboard/live/push-messages',
      breadcrumbs: ['Home', 'Live Management', 'Content & History', 'Push Message List'],
    });
  }, [addTab]);

  const filtered = useMemo(() => {
    let result = [...data];
    if (filters.roomNumber.trim()) {
      const rn = filters.roomNumber.trim();
      result = result.filter((r) => String(r.roomNumber).includes(rn));
    }
    if (filters.anchorNickname.trim()) {
      const k = filters.anchorNickname.toLowerCase();
      result = result.filter((r) => r.anchorNickname.toLowerCase().includes(k));
    }
    if (filters.type) {
      // Type filter - demo uses liveStreamTitle as proxy; API would have separate type
      result = result.filter((r) => (r as PushMessage & { type?: string }).type === filters.type);
    }
    if (filters.status) {
      result = result.filter((r) => r.status === filters.status);
    }
    if (filters.creationTimeStart) {
      const start = new Date(filters.creationTimeStart).getTime();
      if (!isNaN(start)) {
        result = result.filter((r) => new Date(r.creationTime).getTime() >= start);
      }
    }
    if (filters.creationTimeEnd) {
      const end = new Date(filters.creationTimeEnd).getTime();
      if (!isNaN(end)) {
        result = result.filter((r) => new Date(r.creationTime).getTime() <= end);
      }
    }
    return result;
  }, [data, filters]);

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

  const handleDelete = (row: PushMessage) => {
    if (confirm(`Delete push message #${row.number}?`)) {
      setData((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    if (confirm(`Delete ${selected.length} push message(s)?`)) {
      setData((prev) => prev.filter((r) => !selected.includes(r.id)));
      setSelected([]);
    }
  };

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({
      roomNumber: '',
      anchorNickname: '',
      type: '',
      status: '',
      creationTimeStart: '',
      creationTimeEnd: '',
    });
    setPage(0);
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
          <TextField
            size="small"
            label="Room number"
            placeholder="Please enter room number"
            value={filters.roomNumber}
            onChange={(e) => setFilters((p) => ({ ...p, roomNumber: e.target.value }))}
            sx={{ minWidth: 140 }}
          />
          <TextField
            size="small"
            label="Anchor Nickname"
            placeholder="Please enter the anchor nickname"
            value={filters.anchorNickname}
            onChange={(e) => setFilters((p) => ({ ...p, anchorNickname: e.target.value }))}
            sx={{ minWidth: 160 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={filters.type}
              label="Type"
              onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="live">Live</MenuItem>
              <MenuItem value="voice">Voice</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Not pushed">Not pushed</MenuItem>
              <MenuItem value="Pushed">Pushed</MenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            type="date"
            label="Creation time"
            InputLabelProps={{ shrink: true }}
            value={filters.creationTimeStart}
            onChange={(e) => setFilters((p) => ({ ...p, creationTimeStart: e.target.value }))}
            sx={{ minWidth: 160 }}
          />
          <TextField
            size="small"
            type="date"
            label="to"
            InputLabelProps={{ shrink: true }}
            value={filters.creationTimeEnd}
            onChange={(e) => setFilters((p) => ({ ...p, creationTimeEnd: e.target.value }))}
            sx={{ minWidth: 140 }}
          />
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
            Q Query
          </Button>
          <Button variant="outlined" color="error" startIcon={<Clear />} onClick={handleClear}>
            Clear conditions
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        <TableContainer sx={{ maxHeight: 520 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ bgcolor: 'grey.50' }}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < paginatedRows.length}
                    checked={paginatedRows.length > 0 && selected.length === paginatedRows.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 90 }}>Number</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 100 }}>Anchor ID</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 160 }}>Anchor Nickname</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 160 }}>Live Stream Title</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 110 }}>Room number</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 140 }}>Live broadcast cities</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 110 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 165 }}>Creation time</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', minWidth: 100 }} align="right">
                  Operation
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.id} hover selected={selected.includes(row.id)} sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selected.includes(row.id)} onChange={() => handleSelectOne(row.id)} />
                  </TableCell>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.anchorId}</TableCell>
                  <TableCell>{row.anchorNickname}</TableCell>
                  <TableCell>{row.liveStreamTitle}</TableCell>
                  <TableCell>{row.roomNumber}</TableCell>
                  <TableCell>{row.liveBroadcastCities}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.creationTime}</TableCell>
                  <TableCell align="right" sx={{ width: 56 }}>
                    <OperationButton
                      dangerItems={[{ label: 'Delete', onClick: () => handleDelete(row), icon: <Delete fontSize="small" /> }]}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {selected.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleBulkDelete}>
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
