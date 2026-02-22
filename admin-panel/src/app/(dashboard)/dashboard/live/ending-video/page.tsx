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
  Grid,
  Pagination,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Menu,
} from '@mui/material';
import { Search, KeyboardArrowDown, FileDownload } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { LiveEndingVideo, LiveEndingVideoFilters } from '@/types/ending-video';
import { fetchLiveEndingVideos } from '@/services/ending-video';
import { exportToXlsx } from '@/lib/export-xlsx';

export default function EndingVideoPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<LiveEndingVideo[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<{ el: HTMLElement; row: LiveEndingVideo } | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({
    roomNumber: '',
    anchorId: '',
    anchorNickname: '',
    liveStreamTitle: '',
    creationTimeStart: '',
    creationTimeEnd: '',
    category: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const f: LiveEndingVideoFilters = {};
      if (filters.roomNumber) f.roomNumber = filters.roomNumber;
      if (filters.anchorId) f.anchorId = filters.anchorId;
      if (filters.anchorNickname) f.anchorNickname = filters.anchorNickname;
      if (filters.liveStreamTitle) f.liveStreamTitle = filters.liveStreamTitle;
      if (filters.creationTimeStart) f.creationTimeStart = filters.creationTimeStart;
      if (filters.creationTimeEnd) f.creationTimeEnd = filters.creationTimeEnd;
      if (filters.category && filters.category !== 'all') f.category = filters.category;
      const res = await fetchLiveEndingVideos(f, page + 1, perPage);
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filters]);

  useEffect(() => {
    addTab({
      id: '/dashboard/live/ending-video',
      label: 'Live Ending Video',
      path: '/dashboard/live/ending-video',
      breadcrumbs: ['Home', 'Live Management', 'Content & History', 'Live Ending Video'],
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
      liveStreamTitle: '',
      creationTimeStart: '',
      creationTimeEnd: '',
      category: '',
    });
    setPage(0);
  };

  const handleExport = async () => {
    const f: LiveEndingVideoFilters = {};
    if (filters.roomNumber) f.roomNumber = filters.roomNumber;
    if (filters.anchorId) f.anchorId = filters.anchorId;
    if (filters.anchorNickname) f.anchorNickname = filters.anchorNickname;
    if (filters.liveStreamTitle) f.liveStreamTitle = filters.liveStreamTitle;
    if (filters.creationTimeStart) f.creationTimeStart = filters.creationTimeStart;
    if (filters.creationTimeEnd) f.creationTimeEnd = filters.creationTimeEnd;
    if (filters.category && filters.category !== 'all') f.category = filters.category;
    const res = await fetchLiveEndingVideos(f, 1, 10000);
    exportToXlsx(
      res.data,
      [
        { key: 'roomNumber', header: 'Room number' },
        { key: 'anchorId', header: 'Anchor ID' },
        { key: 'anchorNickname', header: 'Anchor Nickname' },
        { key: 'liveStreamTitle', header: 'Live Stream Title' },
        { key: 'totalNumberOfPeople', header: 'Total number of people' },
        { key: 'coin', header: 'Coin' },
        { key: 'status', header: 'Status' },
        { key: 'type', header: 'Type' },
        { key: 'category', header: 'Category' },
        { key: 'isCharged', header: 'Is it charged?' },
        { key: 'typeOfCharge', header: 'Type of charge' },
        { key: 'creationTime', header: 'Creation time' },
        { key: 'endTime', header: 'End Time' },
        { key: 'liveStreamingDuration', header: 'Live streaming duration' },
      ],
      'live-ending-video'
    );
  };

  const handleOpMenu = (e: React.MouseEvent<HTMLElement>, row: LiveEndingVideo) => {
    setAnchorEl({ el: e.currentTarget, row });
  };
  const handleOpClose = () => setAnchorEl(null);

  const totalPages = Math.ceil(total / perPage) || 1;

  const stickyFirst = {
    position: 'sticky' as const,
    left: 0,
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
  const stickyLastBody = (bg: string) => ({ ...stickyLast, zIndex: 2, bgcolor: bg });

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="Room number"
            value={filters.roomNumber}
            onChange={(e) => setFilters((p) => ({ ...p, roomNumber: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="Anchor ID"
            value={filters.anchorId}
            onChange={(e) => setFilters((p) => ({ ...p, anchorId: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="Anchor Nickname"
            value={filters.anchorNickname}
            onChange={(e) => setFilters((p) => ({ ...p, anchorNickname: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="Live Stream Title"
            value={filters.liveStreamTitle}
            onChange={(e) => setFilters((p) => ({ ...p, liveStreamTitle: e.target.value }))}
          />
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
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <FormControl size="small" fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category || 'all'}
              label="Category"
              onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}
            >
              <MenuItem value="all">Please select</MenuItem>
              <MenuItem value="Live room">Live room</MenuItem>
              <MenuItem value="Voice room">Voice room</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
          Query
        </Button>
        <Button variant="outlined" color="error" onClick={handleClear}>
          Clear conditions
        </Button>
        <Button variant="outlined" startIcon={<FileDownload />} onClick={handleExport}>
          Export
        </Button>
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer sx={{ overflowX: 'auto', overflowY: 'visible', width: '100%' }}>
          <Table size="small" sx={{ minWidth: 1600 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ ...stickyFirst, fontWeight: 600 }}>Room number</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>Anchor ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Anchor Nickname</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 160 }}>Live Stream Title</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 120 }} align="right">Total number of people</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 80 }} align="right">Coin</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Is it charged?</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Type of charge</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>Creation time</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>End Time</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Live streaming duration</TableCell>
                  <TableCell sx={{ ...stickyLast, fontWeight: 600 }}>Operation</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={15} align="center" sx={{ py: 4 }}>
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row, index) => (
                    <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                      <TableCell sx={stickyFirstBody(index % 2 === 1 ? 'grey.50' : 'background.paper')}>
                        {row.roomNumber}
                      </TableCell>
                      <TableCell>{row.anchorId}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              bgcolor: 'grey.200',
                            }}
                          />
                          {row.anchorNickname}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 180 }}>{row.liveStreamTitle}</TableCell>
                      <TableCell align="right">{row.totalNumberOfPeople}</TableCell>
                      <TableCell align="right">{row.coin.toLocaleString()}</TableCell>
                      <TableCell>{row.status}</TableCell>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>{row.isCharged}</TableCell>
                      <TableCell>{row.typeOfCharge || '-'}</TableCell>
                      <TableCell>{row.creationTime}</TableCell>
                      <TableCell>{row.endTime}</TableCell>
                      <TableCell>{row.liveStreamingDuration}</TableCell>
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
          <Typography variant="body2" color="text.secondary">
            Total {total}
          </Typography>
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
      </Paper>

      <Menu
        anchorEl={anchorEl?.el}
        open={!!anchorEl}
        onClose={handleOpClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MenuItem onClick={handleOpClose}>View details</MenuItem>
        <MenuItem onClick={handleOpClose}>Edit</MenuItem>
      </Menu>
    </Box>
  );
}
