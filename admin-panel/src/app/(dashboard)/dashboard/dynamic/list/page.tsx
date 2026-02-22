'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
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
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Menu,
  MenuItem as MenuItemAction,
  TablePagination,
} from '@mui/material';
import { Search, Clear, MoreVert } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { DynamicPost } from '@/types/dynamic';
import { demoDynamicPosts } from '@/lib/demo-data';

export default function DynamicListPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<DynamicPost[]>(demoDynamicPosts);
  const [filters, setFilters] = useState({
    keyword: '',
    userId: '',
    isPinned: 'All',
    status: 'All',
    dynamicType: 'All',
    releaseStart: '',
    releaseEnd: '',
  });
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [menuAnchor, setMenuAnchor] = useState<{ el: HTMLElement; row: DynamicPost } | null>(null);

  useEffect(() => {
    addTab({
      id: '/dashboard/dynamic/list',
      label: 'Dynamic list',
      path: '/dashboard/dynamic/list',
      breadcrumbs: ['Home', 'Dynamic Management', 'Dynamic list'],
    });
  }, [addTab]);

  const filtered = useMemo(() => {
    let result = [...data];
    if (filters.keyword.trim()) {
      const k = filters.keyword.toLowerCase();
      result = result.filter(
        (r) =>
          r.publishContent.toLowerCase().includes(k) ||
          r.userNickname.toLowerCase().includes(k)
      );
    }
    if (filters.userId.trim()) {
      result = result.filter((r) =>
        String(r.userId).includes(filters.userId.trim())
      );
    }
    if (filters.status !== 'All') {
      result = result.filter((r) => r.status === filters.status);
    }
    return result;
  }, [data, filters]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleOperation = (action: string) => {
    const target = menuAnchor?.row;
    if (target) {
      if (action === 'Delete') {
        if (confirm('Delete this dynamic?')) setData((p) => p.filter((r) => r.id !== target.id));
      } else if (action === 'Set to top') {
        setData((p) =>
          p.map((r) =>
            r.id === target.id ? { ...r, isPinned: 'Yes' } : { ...r, isPinned: r.id === target.id ? 'Yes' : r.isPinned }
          )
        );
      } else {
        alert(`${action} for post ${target.id}`);
      }
    }
    setMenuAnchor(null);
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    if (confirm(`Delete ${selected.length} dynamic(s)?`)) {
      setData((p) => p.filter((r) => !selected.includes(r.id)));
      setSelected([]);
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
          <TextField
            size="small"
            label="Keyword"
            placeholder="Please enter keywords"
            value={filters.keyword}
            onChange={(e) => setFilters((f) => ({ ...f, keyword: e.target.value }))}
            sx={{ minWidth: 160 }}
          />
          <TextField
            size="small"
            label="User ID"
            placeholder="Please enter user ID"
            value={filters.userId}
            onChange={(e) => setFilters((f) => ({ ...f, userId: e.target.value }))}
            sx={{ minWidth: 140 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Is it pinned?</InputLabel>
            <Select
              value={filters.isPinned}
              label="Is it pinned?"
              onChange={(e) => setFilters((f) => ({ ...f, isPinned: e.target.value }))}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Dynamic type</InputLabel>
            <Select
              value={filters.dynamicType}
              label="Dynamic type"
              onChange={(e) => setFilters((f) => ({ ...f, dynamicType: e.target.value }))}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Text">Text</MenuItem>
              <MenuItem value="Image">Image</MenuItem>
              <MenuItem value="Video">Video</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<Search />} onClick={() => setPage(0)}>
            Q Query
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Clear />}
            onClick={() =>
              setFilters({
                keyword: '',
                userId: '',
                isPinned: 'All',
                status: 'All',
                dynamicType: 'All',
                releaseStart: '',
                releaseEnd: '',
              })
            }
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
                <TableCell padding="checkbox" sx={{ fontWeight: 600 }} />
                <TableCell sx={{ fontWeight: 600, minWidth: 70 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>User ID</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 130 }}>User nickname</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>Publish Content</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Video URL</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Number of likes</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Number of comments</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Number of forwards</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>Is it pinned?</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 160 }}>Release time</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 80 }} align="right">
                  Operation
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(row.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelected((s) => [...s, row.id]);
                        else setSelected((s) => s.filter((id) => id !== row.id));
                      }}
                    />
                  </TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.userId}</TableCell>
                  <TableCell>{row.userNickname}</TableCell>
                  <TableCell sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.publishContent}</TableCell>
                  <TableCell>
                    {row.videoUrl ? (
                      <Box sx={{ width: 48, height: 36, position: 'relative', borderRadius: 1, overflow: 'hidden' }}>
                        <Image src={row.videoUrl} alt="" fill sizes="48px" style={{ objectFit: 'cover' }} unoptimized />
                      </Box>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    {row.imageUrl ? (
                      <Box sx={{ width: 48, height: 48, position: 'relative', borderRadius: 1, overflow: 'hidden' }}>
                        <Image src={row.imageUrl} alt="" fill sizes="48px" style={{ objectFit: 'cover' }} unoptimized />
                      </Box>
                    ) : '-'}
                  </TableCell>
                  <TableCell>{row.likeCount}</TableCell>
                  <TableCell>{row.commentCount}</TableCell>
                  <TableCell>{row.forwardCount}</TableCell>
                  <TableCell>{row.isPinned}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.releaseTime}</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={(e) => setMenuAnchor({ el: e.currentTarget, row })}
                      endIcon={<MoreVert />}
                    >
                      Operation
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Menu
          open={!!menuAnchor}
          anchorEl={menuAnchor?.el}
          onClose={() => setMenuAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <MenuItemAction onClick={() => handleOperation('Like list')}>Like list</MenuItemAction>
          <MenuItemAction onClick={() => handleOperation('Forwarding list')}>Forwarding list</MenuItemAction>
          <MenuItemAction onClick={() => handleOperation('Comment list')}>Comment list</MenuItemAction>
          <MenuItemAction onClick={() => handleOperation('Delete')} sx={{ color: 'error.main' }}>Delete</MenuItemAction>
          <MenuItemAction onClick={() => handleOperation('Set to top')}>Set to top</MenuItemAction>
        </Menu>
        {selected.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button variant="outlined" color="error" onClick={handleBulkDelete}>
              Delete
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
