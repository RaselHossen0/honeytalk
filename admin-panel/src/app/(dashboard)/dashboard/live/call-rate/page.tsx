'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Add, Delete, Settings, Save, Close } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { useTabsStore } from '@/store/tabs';
import type { CallRate, CallRateFormPayload } from '@/types/call-rate';

const DEMO_RATES: CallRate[] = [
  { id: 1, videoCallRate: 20, hostGetPercent: 60, adminGetPercent: 40 },
  { id: 2, videoCallRate: 30, hostGetPercent: 60, adminGetPercent: 40 },
  { id: 3, videoCallRate: 40, hostGetPercent: 60, adminGetPercent: 40 },
];

export default function CallRateSettingPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<CallRate[]>(DEMO_RATES);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<CallRateFormPayload>({
    videoCallRate: 200,
    hostGetPercent: 60,
    adminGetPercent: 40,
  });

  useEffect(() => {
    addTab({
      id: '/dashboard/live/call-rate',
      label: 'Call Rate Setting',
      path: '/dashboard/live/call-rate',
      breadcrumbs: ['Home', 'Live Management', 'Call Rate Setting'],
    });
  }, [addTab]);

  const totalPercent = form.hostGetPercent + form.adminGetPercent;
  const isValid = totalPercent === 100 && form.videoCallRate > 0;

  const handleAdd = () => {
    setForm({ videoCallRate: 200, hostGetPercent: 60, adminGetPercent: 40 });
    setDialogOpen(true);
  };

  const handleDialogConfirm = () => {
    if (!isValid) return;
    const nextId = Math.max(...data.map((r) => r.id), 0) + 1;
    setData((prev) => [
      ...prev,
      {
        id: nextId,
        ...form,
      },
    ]);
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this call rate?')) {
      setData((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleHostChange = (val: number) => {
    setForm((f) => ({ ...f, hostGetPercent: val, adminGetPercent: 100 - val }));
  };

  const handleAdminChange = (val: number) => {
    setForm((f) => ({ ...f, adminGetPercent: val, hostGetPercent: 100 - val }));
  };

  const handleSaveChanges = () => {
    // Placeholder for API persistence; data is already in state
  };

  return (
    <Box>
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {/* Section header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 600 }}>
            <Settings sx={{ color: 'primary.main', fontSize: 24 }} />
            Call Rate Setting
          </Typography>
          <Button variant="contained" startIcon={<Save />} onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Box>

        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Configure Private Video Call rates (coins/minute) and host/admin revenue split. Each rate can be used for different call tiers.
          </Typography>

          <TableContainer sx={{ borderRadius: 1, border: 1, borderColor: 'divider' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600, width: 56 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Video Call Rate</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Host Get %</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Admin Get %</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right" width={80}>
                    Operation
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No call rates configured. Click &quot;Add Call rate&quot; to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row, idx) => (
                    <TableRow
                      key={row.id}
                      hover
                      sx={{
                        '&:nth-of-type(even)': { bgcolor: 'grey.50' },
                      }}
                    >
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        <Typography component="span" fontWeight={500}>
                          {row.videoCallRate}
                        </Typography>
                        <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                          coins/min
                        </Typography>
                      </TableCell>
                      <TableCell>{row.hostGetPercent}%</TableCell>
                      <TableCell>{row.adminGetPercent}%</TableCell>
                      <TableCell align="right">
                        <OperationButton
                          dangerItems={[
                            {
                              label: 'Delete',
                              onClick: () => handleDelete(row.id),
                              icon: <Delete fontSize="small" />,
                            },
                          ]}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAdd}
            sx={{ mt: 2 }}
          >
            Add Call rate
          </Button>
        </Box>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Add CALL price
          <IconButton size="small" onClick={() => setDialogOpen(false)} aria-label="Close">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Video Call rate"
              type="number"
              value={form.videoCallRate}
              onChange={(e) =>
                setForm((f) => ({ ...f, videoCallRate: parseInt(e.target.value, 10) || 0 }))
              }
              fullWidth
              inputProps={{ min: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="body2" color="text.secondary">Coin/Min</Typography>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Host Get % per min"
              type="number"
              value={form.hostGetPercent}
              onChange={(e) => handleHostChange(parseInt(e.target.value, 10) || 0)}
              fullWidth
              inputProps={{ min: 0, max: 100 }}
            />
            <TextField
              label="Admin Get % per min"
              type="number"
              value={form.adminGetPercent}
              onChange={(e) => handleAdminChange(parseInt(e.target.value, 10) || 0)}
              fullWidth
              inputProps={{ min: 0, max: 100 }}
            />
            <Typography variant="body2" color={totalPercent === 100 ? 'success.main' : 'error.main'} fontWeight={500}>
              Total: {totalPercent}%
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleDialogConfirm} disabled={!isValid}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
