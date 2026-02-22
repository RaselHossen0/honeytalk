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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
} from '@mui/material';
import { Add, Search, KeyboardArrowDown, Close, Warning } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { Family, FamilyMember, AnchorPerformanceRecord } from '@/types/family';
import type { FamilyFilters } from '@/types/family';
import {
  fetchFamilies,
  fetchFamilyMembers,
  fetchAnchorPerformance,
  fetchFamilyPerformanceReport,
  updateFamily,
  clearFamilyIncome,
} from '@/services/family';
import { exportToXlsx } from '@/lib/export-xlsx';

export default function FamilyListPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<Family[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<{ el: HTMLElement; row: Family } | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({
    familyName: '',
    patriarchName: '',
    familyId: '',
    familyLeaderId: '',
    familyMembersId: '',
    status: 'Approved',
    creationTimeStart: '',
    creationTimeEnd: '',
  });

  const [editOpen, setEditOpen] = useState(false);
  const [editRow, setEditRow] = useState<Family | null>(null);
  const [editForm, setEditForm] = useState({ familyName: '', familyManifesto: '', introduction: '' });

  const [membersDrawerOpen, setMembersDrawerOpen] = useState(false);
  const [membersData, setMembersData] = useState<{ familyId: number; familyName: string; members: FamilyMember[] } | null>(null);

  const [perfOpen, setPerfOpen] = useState(false);
  const [perfData, setPerfData] = useState<{
    userId: number;
    userNickname: string;
    data: AnchorPerformanceRecord[];
    totalRevenue: number;
    liveStreamingDuration: string;
    valid: number;
  } | null>(null);

  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFamily, setExportFamily] = useState<Family | null>(null);
  const [exportDateStart, setExportDateStart] = useState('');
  const [exportDateEnd, setExportDateEnd] = useState('');
  const [exportConfirmOpen, setExportConfirmOpen] = useState(false);
  const [dissolveOpen, setDissolveOpen] = useState(false);
  const [dissolveRow, setDissolveRow] = useState<Family | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const f: FamilyFilters = {};
      if (filters.familyName) f.familyName = filters.familyName;
      if (filters.patriarchName) f.patriarchName = filters.patriarchName;
      if (filters.familyId) f.familyId = filters.familyId;
      if (filters.familyLeaderId) f.familyLeaderId = filters.familyLeaderId;
      if (filters.status && filters.status !== 'all') f.status = filters.status;
      if (filters.creationTimeStart) f.creationTimeStart = filters.creationTimeStart;
      if (filters.creationTimeEnd) f.creationTimeEnd = filters.creationTimeEnd;
      const res = await fetchFamilies(f, page + 1, perPage);
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filters]);

  useEffect(() => {
    addTab({
      id: '/dashboard/users/family/list',
      label: 'Family List',
      path: '/dashboard/users/family/list',
      breadcrumbs: ['Home', 'User Management', 'Family Management', 'Family List'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({
      familyName: '',
      patriarchName: '',
      familyId: '',
      familyLeaderId: '',
      familyMembersId: '',
      status: 'Approved',
      creationTimeStart: '',
      creationTimeEnd: '',
    });
    setPage(0);
  };

  const handleOpMenu = (e: React.MouseEvent<HTMLElement>, row: Family) => {
    setAnchorEl({ el: e.currentTarget, row });
  };
  const handleOpClose = () => setAnchorEl(null);

  const handleFamilyDetail = (row: Family) => {
    setEditRow(row);
    setEditForm({
      familyName: row.familyName,
      familyManifesto: row.familyManifesto,
      introduction: row.introduction || '',
    });
    setEditOpen(true);
    handleOpClose();
  };

  const handleMemberList = async (row: Family) => {
    const members = await fetchFamilyMembers(row.id);
    setMembersData({ familyId: row.id, familyName: row.familyName, members });
    setMembersDrawerOpen(true);
    handleOpClose();
  };

  const handleExportPerf = (row: Family) => {
    setExportFamily(row);
    setExportDateStart(new Date().toISOString().slice(0, 10));
    setExportDateEnd(new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
    setExportDialogOpen(true);
    handleOpClose();
  };

  const handleExportClick = () => {
    setExportConfirmOpen(true);
  };

  const handleExportConfirm = async () => {
    if (!exportFamily) return;
    const reportData = await fetchFamilyPerformanceReport(
      exportFamily.id,
      exportFamily.familyName,
      exportDateStart,
      exportDateEnd
    );
    exportToXlsx(
      reportData,
      [
        { key: 'no', header: 'NO.' },
        { key: 'userId', header: 'User ID' },
        { key: 'userNickname', header: 'User nickname' },
        { key: 'totalRevenue', header: 'Total revenue' },
        { key: 'valid', header: 'Valid' },
        { key: 'liveStreamingDuration', header: 'Live streaming duration' },
        { key: 'guild', header: 'guild' },
      ],
      `${exportFamily.familyName}-performance-report`
    );
    setExportConfirmOpen(false);
    setExportDialogOpen(false);
    setExportFamily(null);
  };

  const handleDissolveClick = (row: Family) => {
    setDissolveRow(row);
    setDissolveOpen(true);
    handleOpClose();
  };

  const handleDissolveConfirm = () => {
    if (dissolveRow) {
      setData((prev) => prev.filter((r) => r.id !== dissolveRow.id));
      setTotal((t) => Math.max(0, t - 1));
      setDissolveOpen(false);
      setDissolveRow(null);
    }
  };

  const handleEditConfirm = async () => {
    if (!editRow) return;
    await updateFamily(editRow.id, { ...editForm });
    setData((prev) =>
      prev.map((r) =>
        r.id === editRow.id
          ? { ...r, familyName: editForm.familyName, familyManifesto: editForm.familyManifesto, introduction: editForm.introduction }
          : r
      )
    );
    setEditOpen(false);
    setEditRow(null);
  };

  const handleClearIncome = async () => {
    if (confirm('One click clearing of family income. Continue?')) {
      await clearFamilyIncome();
      load();
    }
  };

  const handleAnchorPerformance = async (member: FamilyMember) => {
    const res = await fetchAnchorPerformance(member.userId);
    setPerfData({
      userId: member.userId,
      userNickname: member.userNickname || `User ${member.userId}`,
      data: res.data,
      totalRevenue: res.totalRevenue,
      liveStreamingDuration: res.liveStreamingDuration,
      valid: res.valid,
    });
    setPerfOpen(true);
  };

  const totalPages = Math.ceil(total / perPage) || 1;
  const statLabel = (s: string) => (s === 'Approved' ? 'Apprc' : s === 'Rejected' ? 'Rejec' : 'Has quit th');

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="Family name"
            placeholder="Please enter a family name"
            value={filters.familyName}
            onChange={(e) => setFilters((p) => ({ ...p, familyName: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="Patriarch's name"
            placeholder="Please ent"
            value={filters.patriarchName}
            onChange={(e) => setFilters((p) => ({ ...p, patriarchName: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="Family ID"
            value={filters.familyId}
            onChange={(e) => setFilters((p) => ({ ...p, familyId: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="Family Leader ID"
            value={filters.familyLeaderId}
            onChange={(e) => setFilters((p) => ({ ...p, familyLeaderId: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="Family Members ID"
            value={filters.familyMembersId}
            onChange={(e) => setFilters((p) => ({ ...p, familyMembersId: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <FormControl size="small" fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
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
        <Button variant="outlined" color="error" onClick={handleClear}>
          Clear conditions
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Button variant="contained" startIcon={<Add />}>
          Add
        </Button>
        <Button variant="outlined" color="error" onClick={handleClearIncome}>
          One click clearing of family income
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Family name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Family Leader</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Family LOGO</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Family manifesto</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Family user number</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Family income</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Patriarch&apos;s name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.familyName}</TableCell>
                  <TableCell>
                    {row.familyLeaderNickname}({row.familyLeaderId})
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: 'grey.200',
                        border: '1px solid',
                        borderColor: 'grey.300',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 180 }}>{row.familyManifesto}</TableCell>
                  <TableCell align="right">{row.familyUserNumber}</TableCell>
                  <TableCell align="right">{row.familyIncome.toLocaleString()}</TableCell>
                  <TableCell>{row.patriarchName}</TableCell>
                  <TableCell>
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

      <Menu
        anchorEl={anchorEl?.el}
        open={!!anchorEl}
        onClose={handleOpClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MenuItem onClick={() => anchorEl && handleFamilyDetail(anchorEl.row)}>Family detail</MenuItem>
        <MenuItem onClick={() => anchorEl && handleMemberList(anchorEl.row)}>Member List</MenuItem>
        <MenuItem onClick={() => anchorEl && handleExportPerf(anchorEl.row)}>Export performance report</MenuItem>
        <MenuItem onClick={() => anchorEl && handleDissolveClick(anchorEl.row)} sx={{ color: 'error.main' }}>
          Dissolve family
        </MenuItem>
      </Menu>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Edit
          <IconButton size="small" onClick={() => setEditOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {editRow && (
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Family ID: Family {editRow.id}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Family name"
                  value={editForm.familyName}
                  onChange={(e) => setEditForm((p) => ({ ...p, familyName: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" gutterBottom>
                    Family LOGO
                  </Typography>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 1,
                      bgcolor: 'grey.200',
                      border: '1px dashed',
                      borderColor: 'grey.400',
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    Upload rule: Uploaded images can only be JPG/PNG
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Family manifesto"
                  value={editForm.familyManifesto}
                  onChange={(e) => setEditForm((p) => ({ ...p, familyManifesto: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Family income: {editRow.familyIncome.toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Creation time: {editRow.creationTime}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Status: {editRow.status}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Introduction"
                  placeholder="Please enter content"
                  value={editForm.introduction}
                  onChange={(e) => setEditForm((p) => ({ ...p, introduction: e.target.value }))}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Drawer
        anchor="right"
        open={membersDrawerOpen}
        onClose={() => setMembersDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 560 } } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Family 【{membersData?.familyName}】 Member List
          </Typography>
          {membersData && (
            <>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item>
                  <TextField size="small" label="FamilyID" value={membersData.familyId} sx={{ width: 100 }} />
                </Grid>
                <Grid item>
                  <TextField size="small" label="User ID" placeholder="Please enter" sx={{ width: 140 }} />
                </Grid>
                <Grid item>
                  <FormControl size="small" sx={{ minWidth: 100 }}>
                    <InputLabel>Status</InputLabel>
                    <Select label="Status" value="all">
                      <MenuItem value="all">All</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <Button variant="contained" size="small">
                    Query
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="error" size="small">
                    Clear conditions
                  </Button>
                </Grid>
              </Grid>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>User nickname</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Avatar</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Add Time</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Note</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Stat</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Operation</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {membersData.members.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell>{m.number}</TableCell>
                        <TableCell>{m.userNickname ? `${m.userNickname}(${m.userId})` : `(${m.userId})`}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              bgcolor: 'grey.200',
                            }}
                          />
                        </TableCell>
                        <TableCell>{m.addTime}</TableCell>
                        <TableCell>{m.note || '-'}</TableCell>
                        <TableCell>{statLabel(m.stat)}</TableCell>
                        <TableCell>
                          {m.stat === 'Approved' && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="warning"
                              sx={{ mr: 1 }}
                            >
                              Quit the family
                            </Button>
                          )}
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleAnchorPerformance(m)}
                          >
                            Anchor Performance
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Box>
      </Drawer>

      <Dialog open={perfOpen} onClose={() => setPerfOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Anchor Performance
          <IconButton size="small" onClick={() => setPerfOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {perfData && (
            <>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item>
                  <TextField size="small" label="User ID" value={perfData.userId} sx={{ width: 120 }} />
                </Grid>
                <Grid item>
                  <TextField size="small" label="guild UID" placeholder="Please enter" sx={{ width: 120 }} />
                </Grid>
                <Grid item>
                  <TextField size="small" label="guild" placeholder="Please enter" sx={{ width: 120 }} />
                </Grid>
                <Grid item>
                  <TextField size="small" type="date" label="Date" InputLabelProps={{ shrink: true }} sx={{ width: 140 }} />
                </Grid>
                <Grid item>
                  <TextField size="small" type="date" label="Date" InputLabelProps={{ shrink: true }} sx={{ width: 140 }} />
                </Grid>
                <Grid item>
                  <Button variant="contained" size="small">
                    Query
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="error" size="small">
                    Clear conditions
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" size="small">
                    Export
                  </Button>
                </Grid>
              </Grid>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Total revenue: {perfData.totalRevenue.toLocaleString()} k; Live streaming duration: {perfData.liveStreamingDuration}; Valid : {perfData.valid};
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>User nickname</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Avatar</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>guild</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Live streaming duration</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Total revenue</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {perfData.data.map((r, i) => (
                      <TableRow key={i}>
                        <TableCell>{r.time}</TableCell>
                        <TableCell>{r.userNickname}({r.userId})</TableCell>
                        <TableCell>
                          <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'grey.200' }} />
                        </TableCell>
                        <TableCell>{r.guild || '-'}</TableCell>
                        <TableCell>{r.liveStreamingDuration}</TableCell>
                        <TableCell align="right">{r.totalRevenue.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {exportFamily ? `${exportFamily.familyName}: Export performance report` : 'Export performance report'}
          <IconButton size="small" onClick={() => setExportDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Start date"
                InputLabelProps={{ shrink: true }}
                value={exportDateStart}
                onChange={(e) => setExportDateStart(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="End date"
                InputLabelProps={{ shrink: true }}
                value={exportDateEnd}
                onChange={(e) => setExportDateEnd(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleExportClick}>
            Export
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={exportConfirmOpen} onClose={() => setExportConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Export performance report</DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 2 }}>
          <Warning sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
          <Typography>Whether to export or not ?</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={() => setExportConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleExportConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dissolveOpen} onClose={() => setDissolveOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Do we really want to dissolve the family?
          <IconButton size="small" onClick={() => setDissolveOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, pt: 1 }}>
          <Warning sx={{ fontSize: 40, color: 'warning.main', flexShrink: 0 }} />
          <Typography>
            After dissolution, all family members will be automatically unbound and cannot be withdrawn
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDissolveOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDissolveConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
