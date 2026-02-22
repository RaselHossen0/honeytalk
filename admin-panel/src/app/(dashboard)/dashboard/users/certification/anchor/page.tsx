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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Checkbox,
} from '@mui/material';
import { Search, Close } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { AnchorCertification, AnchorCertificationStatus } from '@/types/certification';
import type { AnchorCertificationFilters } from '@/types/certification';
import {
  fetchAnchorCertifications,
  updateAnchorCertification,
  batchApproveCertifications,
} from '@/services/certification';

function IdCardImage({ src }: { src?: string }) {
  if (!src || src === 'FAILED') {
    return (
      <Typography variant="caption" color="error" fontWeight={500}>
        FAILED
      </Typography>
    );
  }
  return (
    <Box
      component="img"
      src={src}
      alt=""
      sx={{
        width: 48,
        height: 36,
        objectFit: 'cover',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
      }}
    />
  );
}

export default function AnchorCertificationListPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<AnchorCertification[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [filters, setFilters] = useState<AnchorCertificationFilters>({
    userId: '',
    userNickname: '',
    status: 'all',
  });

  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewRow, setReviewRow] = useState<AnchorCertification | null>(null);
  const [reviewStatus, setReviewStatus] = useState<AnchorCertificationStatus>('Pending review');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAnchorCertifications(
        filters.userId || filters.userNickname || filters.status !== 'all' ? filters : undefined,
        page + 1,
        perPage
      );
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filters]);

  useEffect(() => {
    addTab({
      id: '/dashboard/users/certification/anchor',
      label: 'Anchor certification list',
      path: '/dashboard/users/certification/anchor',
      breadcrumbs: ['Home', 'User Management', 'Certification Management', 'Anchor certification list'],
    });
  }, [addTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleQuery = () => setPage(0);
  const handleClear = () => {
    setFilters({ userId: '', userNickname: '', status: 'all' });
    setPage(0);
  };

  const handleReview = (row: AnchorCertification) => {
    setReviewRow(row);
    setReviewStatus(row.status);
    setReviewOpen(true);
  };

  const handleReviewConfirm = async () => {
    if (!reviewRow) return;
    await updateAnchorCertification(reviewRow.id, { status: reviewStatus });
    setData((prev) =>
      prev.map((r) => (r.id === reviewRow.id ? { ...r, status: reviewStatus } : r))
    );
    setReviewOpen(false);
    setReviewRow(null);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected(data.filter((r) => r.status === 'Pending review').map((r) => r.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBatchApprove = async () => {
    if (selected.length === 0) return;
    await batchApproveCertifications(selected);
    setData((prev) =>
      prev.map((r) =>
        selected.includes(r.id) ? { ...r, status: 'Certification' as const } : r
      )
    );
    setSelected([]);
    load();
  };

  const totalPages = Math.ceil(total / perPage) || 1;
  const pendingIds = data.filter((r) => r.status === 'Pending review').map((r) => r.id);
  const pendingCount = pendingIds.length;
  const allPendingSelected =
    pendingCount > 0 && pendingIds.every((id) => selected.includes(id));

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="User ID"
            placeholder="Please enter"
            value={filters.userId}
            onChange={(e) => setFilters((p) => ({ ...p, userId: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            size="small"
            fullWidth
            label="User nickname"
            placeholder="Please enter user nickname"
            value={filters.userNickname}
            onChange={(e) => setFilters((p) => ({ ...p, userNickname: e.target.value }))}
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
              <MenuItem value="Pending review">Pending review</MenuItem>
              <MenuItem value="Certification">Certification</MenuItem>
              <MenuItem value="Audit failed">Audit failed</MenuItem>
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
        {selected.length > 0 && (
          <Button variant="contained" color="success" onClick={handleBatchApprove}>
            Batch approval ({selected.length})
          </Button>
        )}
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell padding="checkbox">
                {pendingCount > 0 && (
                  <Checkbox
                    indeterminate={
                      selected.length > 0 &&
                      pendingIds.filter((id) => selected.includes(id)).length < pendingCount
                    }
                    checked={allPendingSelected}
                    onChange={handleSelectAll}
                    size="small"
                  />
                )}
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Anchor Nickname</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Avatar</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Certification Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Real Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Contact information</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Holding the front of the ID card</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Front of ID card</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Back of ID card</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Fans</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Coin</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Level</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={16} align="center" sx={{ py: 4 }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell padding="checkbox">
                    {row.status === 'Pending review' && (
                      <Checkbox
                        checked={selected.includes(row.id)}
                        onChange={() => handleSelectOne(row.id)}
                        size="small"
                      />
                    )}
                  </TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.anchorNickname}</TableCell>
                  <TableCell>
                    {row.avatar ? (
                      <Box
                        component="img"
                        src={row.avatar}
                        alt=""
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          bgcolor: 'grey.300',
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{row.certificationName}</TableCell>
                  <TableCell>{row.realName}</TableCell>
                  <TableCell>{row.contact}</TableCell>
                  <TableCell>
                    <IdCardImage src={row.holdingIdCardImage} />
                  </TableCell>
                  <TableCell>
                    <IdCardImage src={row.frontIdCardImage} />
                  </TableCell>
                  <TableCell>
                    <IdCardImage src={row.backIdCardImage} />
                  </TableCell>
                  <TableCell align="right">{row.fans}</TableCell>
                  <TableCell align="right">{row.coin.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>Lv{row.level}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    <Button size="small" variant="contained" onClick={() => handleReview(row)}>
                      Review
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

      {/* Review Modal */}
      <Dialog open={reviewOpen} onClose={() => setReviewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Review
          <IconButton size="small" onClick={() => setReviewOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {reviewRow && (
            <Box sx={{ pt: 0.5 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Anchor {reviewRow.anchorNickname}({reviewRow.userId})
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Certification
                  </Typography>
                  <Typography variant="body2">{reviewRow.certificationName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Real Name
                  </Typography>
                  <Typography variant="body2">{reviewRow.realName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Contact
                  </Typography>
                  <Typography variant="body2">{reviewRow.contact}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    Avatar
                  </Typography>
                  {reviewRow.avatar ? (
                    <Box
                      component="img"
                      src={reviewRow.avatar}
                      alt=""
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    />
                  ) : (
                    <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: 'grey.300' }} />
                  )}
                </Grid>
              </Grid>

              <Typography variant="subtitle2" gutterBottom>
                Identity Verification
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Holding the front of the ID card
                  </Typography>
                  <IdCardImage src={reviewRow.holdingIdCardImage} />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Front of ID card
                  </Typography>
                  <IdCardImage src={reviewRow.frontIdCardImage} />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Back of ID card
                  </Typography>
                  <IdCardImage src={reviewRow.backIdCardImage} />
                </Box>
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                Status
              </Typography>
              <ToggleButtonGroup
                value={reviewStatus}
                exclusive
                onChange={(_, v) => v && setReviewStatus(v)}
                size="small"
                sx={{ mb: 1 }}
              >
                <ToggleButton value="Pending review">Pending review</ToggleButton>
                <ToggleButton value="Certification">Certification</ToggleButton>
                <ToggleButton value="Audit failed">Audit failed</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setReviewOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleReviewConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
