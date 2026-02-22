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
  Checkbox,
  TablePagination,
} from '@mui/material';
import { Search, Clear, Delete } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import type { DynamicComment } from '@/types/dynamic';
import { demoDynamicComments } from '@/lib/demo-data';

export default function DynamicCommentListPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<DynamicComment[]>(demoDynamicComments);
  const [filters, setFilters] = useState({
    keyword: '',
    commenterId: '',
    publisherId: '',
    releaseStart: '',
    releaseEnd: '',
  });
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    addTab({
      id: '/dashboard/dynamic/comments',
      label: 'Comment list',
      path: '/dashboard/dynamic/comments',
      breadcrumbs: ['Home', 'Dynamic Management', 'Comment list'],
    });
  }, [addTab]);

  const filtered = useMemo(() => {
    let result = [...data];
    if (filters.keyword.trim()) {
      const k = filters.keyword.toLowerCase();
      result = result.filter(
        (r) =>
          r.commentContent.toLowerCase().includes(k) ||
          r.commenterNickname.toLowerCase().includes(k) ||
          r.publisherNickname.toLowerCase().includes(k)
      );
    }
    if (filters.commenterId.trim()) {
      result = result.filter((r) =>
        String(r.commenterId).includes(filters.commenterId.trim())
      );
    }
    if (filters.publisherId.trim()) {
      result = result.filter((r) =>
        String(r.publisherId).includes(filters.publisherId.trim())
      );
    }
    return result;
  }, [data, filters]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    if (confirm(`Delete ${selected.length} comment(s)?`)) {
      setData((p) => p.filter((r) => !selected.includes(r.id)));
      setSelected([]);
    }
  };

  const handleDelete = (row: DynamicComment) => {
    if (confirm(`Delete comment by ${row.commenterNickname}?`)) {
      setData((p) => p.filter((r) => r.id !== row.id));
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
            sx={{ minWidth: 180 }}
          />
          <TextField
            size="small"
            label="Commenter ID"
            placeholder="Please enter commenter ID"
            value={filters.commenterId}
            onChange={(e) => setFilters((f) => ({ ...f, commenterId: e.target.value }))}
            sx={{ minWidth: 160 }}
          />
          <TextField
            size="small"
            label="Publisher ID"
            placeholder="Please enter the ID of the dyn:"
            value={filters.publisherId}
            onChange={(e) => setFilters((f) => ({ ...f, publisherId: e.target.value }))}
            sx={{ minWidth: 180 }}
          />
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
                commenterId: '',
                publisherId: '',
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
                <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>Number</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>Commenter nickname</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 110 }}>Commenter ID</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>Publisher</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 110 }}>Publisher ID</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 180 }}>Comment Content</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 170 }}>Release time</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 100 }} align="right">
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
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.commenterNickname}</TableCell>
                  <TableCell>{row.commenterId}</TableCell>
                  <TableCell>{row.publisherNickname}</TableCell>
                  <TableCell>{row.publisherId}</TableCell>
                  <TableCell>{row.commentContent}</TableCell>
                  <TableCell>{row.releaseTime}</TableCell>
                  <TableCell align="right" sx={{ width: 56 }}>
                    <OperationButton
                      items={[]}
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
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleBulkDelete}
            >
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
