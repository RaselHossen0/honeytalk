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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Search, Clear, Edit, Delete } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import type { Report } from '@/types/report';
import { demoReports, demoReportTypes } from '@/lib/demo-data';

export default function ReportListPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<Report[]>(demoReports);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<number[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Report | null>(null);
  const [editForm, setEditForm] = useState({ type: '', note: '' });
  const [filters, setFilters] = useState({
    reportedRoomNumber: '',
    whistleblower: '',
    reportedBy: '',
    type: '',
    reportingStart: '',
    reportingEnd: '',
  });

  useEffect(() => {
    addTab({
      id: '/dashboard/reports/list',
      label: 'Report List',
      path: '/dashboard/reports/list',
      breadcrumbs: ['Home', 'Feedback Management', 'Report Management', 'Report List'],
    });
  }, [addTab]);

  const filtered = useMemo(() => {
    let result = [...data];
    if (filters.reportedRoomNumber.trim()) {
      result = result.filter((r) => String(r.reportedRoomNumber).includes(filters.reportedRoomNumber));
    }
    if (filters.whistleblower.trim()) {
      const k = filters.whistleblower.toLowerCase();
      result = result.filter((r) => r.whistleblower.toLowerCase().includes(k));
    }
    if (filters.reportedBy.trim()) {
      const k = filters.reportedBy.toLowerCase();
      result = result.filter((r) => r.reportedBy.toLowerCase().includes(k));
    }
    if (filters.type) {
      result = result.filter((r) => r.type === filters.type);
    }
    if (filters.reportingStart) {
      result = result.filter((r) => r.reportingTime >= filters.reportingStart);
    }
    if (filters.reportingEnd) {
      result = result.filter((r) => r.reportingTime <= filters.reportingEnd);
    }
    return result;
  }, [data, filters]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const reportTypes = useMemo(() => demoReportTypes.map((t) => t.name), []);

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({
      reportedRoomNumber: '',
      whistleblower: '',
      reportedBy: '',
      type: '',
      reportingStart: '',
      reportingEnd: '',
    });
    setPage(0);
  };

  const handleEdit = (row: Report) => {
    setEditing(row);
    setEditForm({ type: row.type, note: row.note });
    setEditOpen(true);
  };

  const handleEditSave = () => {
    if (editing) {
      setData((prev) =>
        prev.map((r) =>
          r.id === editing.id ? { ...r, type: editForm.type, note: editForm.note } : r
        )
      );
    }
    setEditOpen(false);
  };

  const handleDelete = (row: Report) => {
    if (confirm(`Delete report #${row.number}?`)) {
      setData((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    if (confirm(`Delete ${selected.length} report(s)?`)) {
      setData((prev) => prev.filter((r) => !selected.includes(r.id)));
      setSelected([]);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelected(paginatedRows.map((r) => r.id));
    else setSelected([]);
  };

  const handleSelectOne = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
          <TextField size="small" label="Reported room number" placeholder="Reported room number" value={filters.reportedRoomNumber} onChange={(e) => setFilters((p) => ({ ...p, reportedRoomNumber: e.target.value }))} sx={{ minWidth: 160 }} />
          <TextField size="small" label="Whistleblower" placeholder="Whistleblower" value={filters.whistleblower} onChange={(e) => setFilters((p) => ({ ...p, whistleblower: e.target.value }))} sx={{ minWidth: 180 }} />
          <TextField size="small" label="Reported by" placeholder="Reported by" value={filters.reportedBy} onChange={(e) => setFilters((p) => ({ ...p, reportedBy: e.target.value }))} sx={{ minWidth: 180 }} />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Type</InputLabel>
            <Select value={filters.type} label="Type" onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}>
              <MenuItem value="">Please select</MenuItem>
              {reportTypes.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField size="small" type="datetime-local" label="Reporting time" value={filters.reportingStart} onChange={(e) => setFilters((p) => ({ ...p, reportingStart: e.target.value }))} InputLabelProps={{ shrink: true }} sx={{ minWidth: 180 }} />
          <TextField size="small" type="datetime-local" label="to" value={filters.reportingEnd} onChange={(e) => setFilters((p) => ({ ...p, reportingEnd: e.target.value }))} InputLabelProps={{ shrink: true }} sx={{ minWidth: 180 }} />
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>Query</Button>
          <Button variant="outlined" color="error" startIcon={<Clear />} onClick={handleClear}>Clear conditions</Button>
        </Box>
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < paginatedRows.length}
                    checked={paginatedRows.length > 0 && selected.length === paginatedRows.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Reported room number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Whistleblower</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Reported by</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Reporting time</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Note</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Operation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selected.includes(row.id)} onChange={() => handleSelectOne(row.id)} />
                  </TableCell>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.reportedRoomNumber}</TableCell>
                  <TableCell>{row.whistleblower}</TableCell>
                  <TableCell>{row.reportedBy}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.reportingTime}</TableCell>
                  <TableCell>{row.note || '-'}</TableCell>
                  <TableCell align="right" sx={{ width: 56 }}>
                    <OperationButton
                      items={[{ label: 'Edit', onClick: () => handleEdit(row), icon: <Edit fontSize="small" /> }]}
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
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[10, 25, 50]}
          labelRowsPerPage="per page"
          labelDisplayedRows={({ from, to, count }) => `Total ${count}`}
        />
      </Paper>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Report</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select value={editForm.type} label="Type" onChange={(e) => setEditForm((f) => ({ ...f, type: e.target.value }))}>
              {reportTypes.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField label="Note" value={editForm.note} onChange={(e) => setEditForm((f) => ({ ...f, note: e.target.value }))} fullWidth multiline rows={3} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
