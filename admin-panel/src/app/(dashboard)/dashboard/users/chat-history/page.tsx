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
  Drawer,
  IconButton,
} from '@mui/material';
import { Search, PlayArrow, VolumeUp, MoreVert } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { ChatRecord, ChatHistoryFilters, SessionMessage } from '@/types/chat-history';
import { fetchChatRecords, fetchSessionRecords } from '@/services/chat-history';

function formatSendUser(row: ChatRecord): string {
  const name = row.sendUserNickname || '';
  return name ? `${name} (${row.sendUserId})` : `(${row.sendUserId})`;
}

function formatReceiveUser(row: ChatRecord): string {
  const name = row.receiveUserNickname || '';
  return name ? `${name} (${row.receiveUserId})` : `(${row.receiveUserId})`;
}

function formatContent(row: ChatRecord): React.ReactNode {
  if (row.contentType === 'audio') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <PlayArrow fontSize="small" color="action" />
        <Typography variant="body2" color="text.secondary">
          0:00
        </Typography>
      </Box>
    );
  }
  return row.content || '-';
}

function SessionRecordItem({ msg }: { msg: SessionMessage }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1.5,
        borderRadius: 1,
        bgcolor: 'grey.50',
        mb: 1,
      }}
    >
      {msg.type === 'text' ? (
        <Typography variant="body2">{msg.content || ''}</Typography>
      ) : (
        <>
          <IconButton size="small" sx={{ bgcolor: 'grey.200' }}>
            <PlayArrow fontSize="small" />
          </IconButton>
          <Typography variant="caption" color="text.secondary">
            {msg.duration || '0:00'} / {msg.duration || '0:00'}
          </Typography>
          <IconButton size="small">
            <VolumeUp fontSize="small" />
          </IconButton>
        </>
      )}
      <IconButton size="small" sx={{ ml: 'auto' }}>
        <MoreVert fontSize="small" />
      </IconButton>
    </Box>
  );
}

export default function ChatHistoryPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<ChatRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    sendUserId: '',
    receiveUserId: '',
    userNickname: '',
    keyword: '',
    type: '',
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sessionData, setSessionData] = useState<{ addTime: string; messages: SessionMessage[] } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const f: ChatHistoryFilters = {};
      if (filters.sendUserId) f.sendUserId = filters.sendUserId;
      if (filters.receiveUserId) f.receiveUserId = filters.receiveUserId;
      if (filters.userNickname) f.userNickname = filters.userNickname;
      if (filters.keyword) f.keyword = filters.keyword;
      if (filters.type) f.type = filters.type;
      const res = await fetchChatRecords(f, page + 1, perPage);
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filters]);

  useEffect(() => {
    addTab({
      id: '/dashboard/users/chat-history',
      label: 'Chat history',
      path: '/dashboard/users/chat-history',
      breadcrumbs: ['Home', 'User Management', 'Chat history'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({
      sendUserId: '',
      receiveUserId: '',
      userNickname: '',
      keyword: '',
      type: '',
    });
    setPage(0);
  };

  const handleSessionRecords = async (row: ChatRecord) => {
    const messages = await fetchSessionRecords(row.sendUserId, row.receiveUserId, row.addTime);
    setSessionData({ addTime: row.addTime, messages });
    setDrawerOpen(true);
  };

  const totalPages = Math.ceil(total / perPage) || 1;

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="Send user ID"
            placeholder="Please enter user ID"
            value={filters.sendUserId}
            onChange={(e) => setFilters((p) => ({ ...p, sendUserId: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="Receive users ID"
            placeholder="Please enter user ID"
            value={filters.receiveUserId}
            onChange={(e) => setFilters((p) => ({ ...p, receiveUserId: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="User nickname"
            placeholder="Please enter user"
            value={filters.userNickname}
            onChange={(e) => setFilters((p) => ({ ...p, userNickname: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="Keyword"
            placeholder="Please enter"
            value={filters.keyword}
            onChange={(e) => setFilters((p) => ({ ...p, keyword: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <FormControl size="small" fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={filters.type}
              label="Type"
              onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}
            >
              <MenuItem value="">Please select</MenuItem>
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="audio">Audio</MenuItem>
              <MenuItem value="video">Video</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>
          Q Query
        </Button>
        <Button variant="outlined" color="error" onClick={handleClear}>
          Clear conditions
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Send user</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Receive users</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Content</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Add Time</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{formatSendUser(row)}</TableCell>
                  <TableCell>{formatReceiveUser(row)}</TableCell>
                  <TableCell>{formatContent(row)}</TableCell>
                  <TableCell>{row.addTime}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => handleSessionRecords(row)}
                      sx={{
                        ...(row.id % 2 === 0
                          ? { bgcolor: 'warning.light', color: 'warning.dark' }
                          : { bgcolor: 'grey.100', color: 'text.primary' }),
                        borderColor: 'divider',
                      }}
                    >
                      Session records
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

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
      </TableContainer>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 380 } } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Session records
          </Typography>
          {sessionData && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {sessionData.addTime}
              </Typography>
              <Box sx={{ maxHeight: '70vh', overflow: 'auto' }}>
                {sessionData.messages.map((msg) => (
                  <SessionRecordItem key={msg.id} msg={msg} />
                ))}
              </Box>
            </>
          )}
        </Box>
      </Drawer>
    </Box>
  );
}
