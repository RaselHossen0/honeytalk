'use client';

import { useState, useEffect, useCallback } from 'react';
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
  Checkbox,
  Grid,
  Pagination,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Menu,
} from '@mui/material';
import { Add, Search, KeyboardArrowDown } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { Replay, ReplayFilters } from '@/types/replay';
import { fetchReplays, deleteReplay } from '@/services/replay';

export default function ReplaysPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<Replay[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [anchorEl, setAnchorEl] = useState<{ el: HTMLElement; row: Replay } | null>(null);
  const [goToPage, setGoToPage] = useState('1');
  const [filters, setFilters] = useState<Record<string, string>>({
    roomNumber: '',
    anchorId: '',
    anchorNickname: '',
    anchorTitle: '',
    login: 'all',
    creationTimeStart: '',
    creationTimeEnd: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const f: ReplayFilters = {};
      if (filters.roomNumber) f.roomNumber = filters.roomNumber;
      if (filters.anchorId) f.anchorId = filters.anchorId;
      if (filters.anchorNickname) f.anchorNickname = filters.anchorNickname;
      if (filters.anchorTitle) f.anchorTitle = filters.anchorTitle;
      if (filters.login && filters.login !== 'all') f.login = filters.login;
      if (filters.creationTimeStart) f.creationTimeStart = filters.creationTimeStart;
      if (filters.creationTimeEnd) f.creationTimeEnd = filters.creationTimeEnd;
      const res = await fetchReplays(f, page + 1, perPage);
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filters]);

  useEffect(() => {
    addTab({
      id: '/dashboard/live/replays',
      label: 'Replay List',
      path: '/dashboard/live/replays',
      breadcrumbs: ['Home', 'Live Management', 'Content & History', 'Replay List'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({
      roomNumber: '',
      anchorId: '',
      anchorNickname: '',
      anchorTitle: '',
      login: 'all',
      creationTimeStart: '',
      creationTimeEnd: '',
    });
    setPage(0);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected(data.map((r) => r.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0 || !confirm(`Delete ${selected.length} selected replay(s)?`)) return;
    await Promise.all(selected.map((id) => deleteReplay(id)));
    setData((prev) => prev.filter((r) => !selected.includes(r.id)));
    setTotal((t) => Math.max(0, t - selected.length));
    setSelected([]);
  };

  const handleOpMenu = (e: React.MouseEvent<HTMLElement>, row: Replay) => {
    setAnchorEl({ el: e.currentTarget, row });
  };
  const handleOpClose = () => setAnchorEl(null);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage - 1);
    setGoToPage(String(newPage));
  };

  const handleGoToPage = () => {
    const p = Math.max(1, Math.min(totalPages, parseInt(goToPage, 10) || 1));
    setPage(p - 1);
    setGoToPage(String(p));
  };

  const totalPages = Math.ceil(total / perPage) || 1;

  const stickyFirst = {
    position: 'sticky' as const,
    left: 0,
    zIndex: 3,
    minWidth: 48,
    width: 48,
    bgcolor: 'grey.50',
    boxShadow: '2px 0 4px -2px rgba(0,0,0,0.08)',
  };
  const stickyRoom = {
    position: 'sticky' as const,
    left: 48,
    zIndex: 3,
    minWidth: 100,
    width: 100,
    bgcolor: 'grey.50',
    boxShadow: '2px 0 4px -2px rgba(0,0,0,0.08)',
  };
  const stickyLast = {
    position: 'sticky' as const,
    right: 0,
    zIndex: 3,
    minWidth: 100,
    width: 100,
    bgcolor: 'grey.50',
    boxShadow: '-2px 0 4px -2px rgba(0,0,0,0.08)',
  };
  const stickyFirstBody = (bg: string) => ({ ...stickyFirst, zIndex: 2, bgcolor: bg });
  const stickyRoomBody = (bg: string) => ({ ...stickyRoom, zIndex: 2, bgcolor: bg });
  const stickyLastBody = (bg: string) => ({ ...stickyLast, zIndex: 2, bgcolor: bg });

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<Add />}>
          Add
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="Room number"
            placeholder="Please enter"
            value={filters.roomNumber}
            onChange={(e) => setFilters((p) => ({ ...p, roomNumber: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="Anchor ID"
            placeholder="Please enter"
            value={filters.anchorId}
            onChange={(e) => setFilters((p) => ({ ...p, anchorId: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="Anchor Nickname"
            placeholder="Please enter"
            value={filters.anchorNickname}
            onChange={(e) => setFilters((p) => ({ ...p, anchorNickname: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="Anchor Title"
            placeholder="Please enter"
            value={filters.anchorTitle}
            onChange={(e) => setFilters((p) => ({ ...p, anchorTitle: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <FormControl size="small" fullWidth>
            <InputLabel>Log in</InputLabel>
            <Select
              value={filters.login || 'all'}
              label="Log in"
              onChange={(e) => setFilters((p) => ({ ...p, login: e.target.value }))}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            type="date"
            label="Creation time"
            InputLabelProps={{ shrink: true }}
            value={filters.creationTimeStart}
            onChange={(e) => setFilters((p) => ({ ...p, creationTimeStart: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            type="date"
            label="Creation time"
            InputLabelProps={{ shrink: true }}
            value={filters.creationTimeEnd}
            onChange={(e) => setFilters((p) => ({ ...p, creationTimeEnd: e.target.value }))}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
          Query
        </Button>
        <Button variant="outlined" onClick={handleClear}>
          Clear conditions
        </Button>
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer sx={{ overflowX: 'auto', overflowY: 'visible', width: '100%' }}>
          <Table size="small" sx={{ minWidth: 1500 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell padding="checkbox" sx={{ ...stickyFirst, fontWeight: 600 }}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < data.length}
                    checked={data.length > 0 && selected.length === data.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell sx={{ ...stickyRoom, fontWeight: 600 }}>Room number</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>Anchor ID</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Anchor Nickname</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 160 }}>Live Stream Title</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 120 }} align="right">Actual number of viewers</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 120 }} align="right">Total number of people</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Is it charged?</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Type of charge</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 80 }}>Log in</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>Creation time</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>End Time</TableCell>
                <TableCell sx={{ ...stickyLast, fontWeight: 600 }}>Operation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={14} align="center" sx={{ py: 4 }}>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => (
                  <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                    <TableCell padding="checkbox" sx={stickyFirstBody(index % 2 === 1 ? 'grey.50' : 'background.paper')}>
                      <Checkbox
                        checked={selected.includes(row.id)}
                        onChange={() => handleSelectOne(row.id)}
                      />
                    </TableCell>
                    <TableCell sx={stickyRoomBody(index % 2 === 1 ? 'grey.50' : 'background.paper')}>
                      {row.roomNumber}
                    </TableCell>
                    <TableCell>{row.anchorId}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: 'grey.200' }} />
                        {row.anchorNickname}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 180 }}>{row.liveStreamTitle}</TableCell>
                    <TableCell align="right">{row.actualNumberOfViewers}</TableCell>
                    <TableCell align="right">{row.totalNumberOfPeople}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.isCharged}</TableCell>
                    <TableCell>{row.typeOfCharge || '-'}</TableCell>
                    <TableCell>{row.login}</TableCell>
                    <TableCell>{row.creationTime}</TableCell>
                    <TableCell>{row.endTime || '-'}</TableCell>
                    <TableCell
                      sx={{
                        ...stickyLastBody(index % 2 === 1 ? 'grey.50' : 'background.paper'),
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        endIcon={<KeyboardArrowDown />}
                        onClick={(e) => handleOpMenu(e, row)}
                      >
                        Operation
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

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
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleBulkDelete}
            disabled={selected.length === 0}
          >
            Delete
          </Button>
          <Box sx={{ flex: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Total {total}
          </Typography>
          <FormControl size="small" sx={{ minWidth: 90 }}>
            <Select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(0);
                setGoToPage('1');
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
            onChange={handleChangePage}
            color="primary"
            size="small"
            showFirstButton
            showLastButton
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Go to
            </Typography>
            <TextField
              size="small"
              value={goToPage}
              onChange={(e) => setGoToPage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGoToPage()}
              type="number"
              inputProps={{ min: 1, max: totalPages }}
              sx={{ width: 56, '& .MuiInputBase-input': { py: 0.75, textAlign: 'center' } }}
            />
            <Button size="small" variant="outlined" onClick={handleGoToPage}>
              Go
            </Button>
          </Box>
        </Box>
      </Paper>

      <Menu
        anchorEl={anchorEl?.el}
        open={!!anchorEl}
        onClose={handleOpClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MenuItem onClick={handleOpClose}>Edit</MenuItem>
        <MenuItem onClick={handleOpClose}>View</MenuItem>
        <MenuItem onClick={handleOpClose}>Log in</MenuItem>
        <MenuItem
          onClick={async () => {
            if (anchorEl && confirm('Delete this replay?')) {
              await deleteReplay(anchorEl.row.id);
              setData((prev) => prev.filter((r) => r.id !== anchorEl.row.id));
              setTotal((t) => Math.max(0, t - 1));
            }
            handleOpClose();
          }}
          sx={{ color: 'error.main' }}
        >
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
}
