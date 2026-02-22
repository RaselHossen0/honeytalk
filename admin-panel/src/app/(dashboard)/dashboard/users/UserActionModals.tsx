'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Checkbox,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { Close, Delete } from '@mui/icons-material';
import { ImageUpload } from '@/components/common/ImageUpload';
import type { UserManagementRecord } from '@/types/user-management';

type ModalType =
  | 'edit'
  | 'ban'
  | 'accountLog'
  | 'contribution'
  | 'giftLog'
  | 'giftReceived'
  | 'guardian'
  | 'wishlist'
  | 'loginLog'
  | 'prohibitedPayment'
  | 'pullBlack'
  | 'statusConfirm'
  | null;

interface UserActionModalsProps {
  modal: ModalType;
  user: UserManagementRecord | null;
  onClose: () => void;
  onConfirm?: (user: UserManagementRecord) => void;
}

const LOG_TYPES = [
  'Recharge record',
  'Withdrawal Records',
  'Redemption record',
  'Share or Family Income',
  'Earn points for first daily login',
  'Paid Live Broadcast Consumption Record',
  'Winning record',
  'Sign-in rewards with diamonds',
];

export function UserActionModals({ modal, user, onClose, onConfirm }: UserActionModalsProps) {
  const [editForm, setEditForm] = useState({
    nickname: '',
    avatarUrl: '',
    mobileAreaCode: '',
    phone: '',
    password: '',
    gender: 'male',
    level: 'Lv1',
    label: 'Empty',
    country: 'India(356)',
    personalSignature: '',
    status: 'Valid',
    permanentBan: 'No',
    banEndTime: '',
    isVip: 'No',
    anchorWithdrawalRatio: '',
    certificationReview: 'Not verified',
  });
  const [banForm, setBanForm] = useState({ startTime: '', endTime: '', days: '', note: '' });

  const u = user;

  useEffect(() => {
    if (modal === 'edit' && u) {
      setEditForm({
        nickname: u.nickname,
        avatarUrl: u.avatar || '',
        mobileAreaCode: '',
        phone: u.phone || '',
        password: '',
        gender: 'male',
        level: u.level || 'Lv1',
        label: 'Empty',
        country: u.country || 'India(356)',
        personalSignature: '',
        status: u.status || 'Valid',
        permanentBan: u.permanentBan ? 'Yes' : 'No',
        banEndTime: '',
        isVip: u.isVip ? 'Yes' : 'No',
        anchorWithdrawalRatio: '',
        certificationReview: u.certification || 'Not verified',
      });
    }
  }, [modal, u]);

  const handleEditSave = () => {
    // TODO: API call
    onClose();
  };

  const handleBanConfirm = () => {
    // TODO: API call
    onClose();
  };

  const handleStatusConfirm = () => {
    onConfirm?.(u!);
    onClose();
  };

  if (!u) return null;

  return (
    <>
      {/* Edit Profile */}
      <Dialog open={modal === 'edit'} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { maxHeight: '90vh' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Edit
          <IconButton size="small" onClick={onClose}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Number" value={u.userId} disabled fullWidth size="small" />
            <TextField label="Creation time" value={u.registrationTime || ''} disabled fullWidth size="small" />
            <TextField label="User nickname" required value={editForm.nickname} onChange={(e) => setEditForm((f) => ({ ...f, nickname: e.target.value }))} fullWidth size="small" />
            <ImageUpload label="Avatar" value={editForm.avatarUrl} onChange={(url) => setEditForm((f) => ({ ...f, avatarUrl: url }))} />
            <TextField label="Mobile area code" value={editForm.mobileAreaCode} onChange={(e) => setEditForm((f) => ({ ...f, mobileAreaCode: e.target.value }))} fullWidth size="small" />
            <TextField label="Phone number" value={editForm.phone} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} fullWidth size="small" />
            <TextField label="Password" type="password" value={editForm.password} onChange={(e) => setEditForm((f) => ({ ...f, password: e.target.value }))} fullWidth size="small" />
            <FormControl>
              <FormLabel>Gender</FormLabel>
              <RadioGroup row value={editForm.gender} onChange={(e) => setEditForm((f) => ({ ...f, gender: e.target.value }))}>
                <FormControlLabel value="male" control={<Radio size="small" />} label="Male" />
                <FormControlLabel value="female" control={<Radio size="small" />} label="Female" />
              </RadioGroup>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Level</InputLabel>
              <Select value={editForm.level} label="Level" onChange={(e) => setEditForm((f) => ({ ...f, level: e.target.value }))} MenuProps={{ sx: { zIndex: 1400 } }}>
                <MenuItem value="Lv1">Lv1</MenuItem>
                <MenuItem value="Lv2">Lv2</MenuItem>
                <MenuItem value="Lv5">Lv5</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Label</InputLabel>
              <Select value={editForm.label} label="Label" onChange={(e) => setEditForm((f) => ({ ...f, label: e.target.value }))} MenuProps={{ sx: { zIndex: 1400 } }}>
                <MenuItem value="Empty">Empty</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Country</InputLabel>
              <Select value={editForm.country} label="Country" onChange={(e) => setEditForm((f) => ({ ...f, country: e.target.value }))} MenuProps={{ sx: { zIndex: 1400 } }}>
                <MenuItem value="India(356)">India(356)</MenuItem>
                <MenuItem value="US(1)">US(1)</MenuItem>
                <MenuItem value="EG(20)">Egypt(20)</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Personal signature" value={editForm.personalSignature} onChange={(e) => setEditForm((f) => ({ ...f, personalSignature: e.target.value }))} fullWidth size="small" multiline />
            <FormControl>
              <FormLabel>Status</FormLabel>
              <ToggleButtonGroup value={editForm.status} exclusive onChange={(_, v) => v && setEditForm((f) => ({ ...f, status: v }))} size="small">
                <ToggleButton value="Valid">Valid</ToggleButton>
                <ToggleButton value="Invalid">Invalid</ToggleButton>
              </ToggleButtonGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Permanent ban</FormLabel>
              <ToggleButtonGroup value={editForm.permanentBan} exclusive onChange={(_, v) => v && setEditForm((f) => ({ ...f, permanentBan: v }))} size="small">
                <ToggleButton value="No">No</ToggleButton>
                <ToggleButton value="Yes">Yes</ToggleButton>
              </ToggleButtonGroup>
            </FormControl>
            <TextField label="End time of ban" type="datetime-local" value={editForm.banEndTime} onChange={(e) => setEditForm((f) => ({ ...f, banEndTime: e.target.value }))} fullWidth size="small" InputLabelProps={{ shrink: true }} helperText="If empty, live status is normal; otherwise banned before end time." />
            <FormControl>
              <FormLabel>Is VIP</FormLabel>
              <ToggleButtonGroup value={editForm.isVip} exclusive onChange={(_, v) => v && setEditForm((f) => ({ ...f, isVip: v }))} size="small">
                <ToggleButton value="No">No</ToggleButton>
                <ToggleButton value="Yes">Yes</ToggleButton>
              </ToggleButtonGroup>
            </FormControl>
            <TextField label="Anchor withdrawal ratio" value={editForm.anchorWithdrawalRatio} onChange={(e) => setEditForm((f) => ({ ...f, anchorWithdrawalRatio: e.target.value }))} fullWidth size="small" helperText="Set withdrawal ratio for anchor. If empty, use general ratio (e.g. 100*0.01=1 $)" />
            <FormControl>
              <FormLabel>Certification review</FormLabel>
              <ToggleButtonGroup value={editForm.certificationReview} exclusive onChange={(_, v) => v && setEditForm((f) => ({ ...f, certificationReview: v }))} size="small">
                <ToggleButton value="Not verified">Not verified</ToggleButton>
                <ToggleButton value="Pending review">Pending review</ToggleButton>
                <ToggleButton value="Certification">Certification</ToggleButton>
                <ToggleButton value="Audit failed">Audit failed</ToggleButton>
              </ToggleButtonGroup>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Ban User */}
      <Dialog open={modal === 'ban'} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>Ban</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="Start Time" type="datetime-local" value={banForm.startTime} onChange={(e) => setBanForm((f) => ({ ...f, startTime: e.target.value }))} fullWidth size="small" InputLabelProps={{ shrink: true }} />
          <TextField label="End Time" type="datetime-local" value={banForm.endTime} onChange={(e) => setBanForm((f) => ({ ...f, endTime: e.target.value }))} fullWidth size="small" InputLabelProps={{ shrink: true }} />
          <TextField label="Days" value={banForm.days} onChange={(e) => setBanForm((f) => ({ ...f, days: e.target.value }))} fullWidth size="small" />
          <TextField label="Note" value={banForm.note} onChange={(e) => setBanForm((f) => ({ ...f, note: e.target.value }))} fullWidth size="small" multiline />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="info">Log information</Button>
          <Button variant="contained" onClick={handleBanConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Status Change Confirmation */}
      <Dialog open={modal === 'statusConfirm'} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box component="span" sx={{ color: 'warning.main', fontSize: 24 }}>!</Box>
          Prompt
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Confirm modifying this status</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleStatusConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Account Log */}
      <Dialog open={modal === 'accountLog'} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { maxHeight: '90vh' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Account logs
          <IconButton size="small" onClick={onClose}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            User nickname {u.nickname} ({u.userId}) Account Log
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Log type</InputLabel>
              <Select label="Log type" defaultValue="">
                <MenuItem value="">Please select</MenuItem>
                {LOG_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
            </FormControl>
            <Button variant="contained" size="small">Q Query</Button>
            <Button variant="outlined" color="error" size="small">Clear conditions</Button>
          </Box>
          <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 360 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow sx={{ '& th': { bgcolor: 'grey.50', fontWeight: 600 } }}>
                  <TableCell padding="checkbox"><Checkbox size="small" /></TableCell>
                  <TableCell>Number</TableCell><TableCell>Content</TableCell><TableCell>Add Time</TableCell><TableCell>Number of Changes</TableCell><TableCell>Points</TableCell><TableCell>Coin</TableCell><TableCell>Operation</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell padding="checkbox"><Checkbox size="small" /></TableCell>
                  <TableCell>81219</TableCell>
                  <TableCell>Earn points for first daily login +5</TableCell>
                  <TableCell>2026-02-19 18:06:14</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>5</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell><Button size="small" color="error">Delete</Button></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Button variant="outlined" color="error" size="small" startIcon={<Delete />} sx={{ mt: 2 }}>Delete</Button>
        </DialogContent>
      </Dialog>

      {/* Contribution List */}
      <Dialog open={modal === 'contribution'} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Contribution List
          <IconButton size="small" onClick={onClose}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            User nickname {u.nickname} ({u.userId}) Contribution List
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead><TableRow sx={{ '& th': { bgcolor: 'grey.50', fontWeight: 600 } }}><TableCell>User ID</TableCell><TableCell>User nickname</TableCell><TableCell>Avatar</TableCell><TableCell>Contribution Quantity</TableCell></TableRow></TableHead>
              <TableBody><TableRow><TableCell colSpan={4} align="center" sx={{ py: 6 }}><Typography variant="body2" color="text.secondary">No Data</Typography></TableCell></TableRow></TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      {/* Gift Log */}
      <Dialog open={modal === 'giftLog'} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { maxHeight: '90vh' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Gift log
          <IconButton size="small" onClick={onClose}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            User nickname {u.nickname} ({u.userId}) Gift Log
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <TextField size="small" label="User ID" value={u.userId} sx={{ width: 120 }} />
            <TextField size="small" label="Anchor ID" placeholder="Please enter anchor ID" sx={{ width: 160 }} />
            <FormControl size="small" sx={{ minWidth: 120 }}><InputLabel>Gift name</InputLabel><Select label="Gift name"><MenuItem value="all">All</MenuItem></Select></FormControl>
            <FormControl size="small" sx={{ minWidth: 80 }}><InputLabel>Year</InputLabel><Select label="Year"><MenuItem value="2026">2026</MenuItem></Select></FormControl>
            <FormControl size="small" sx={{ minWidth: 80 }}><InputLabel>Month</InputLabel><Select label="Month"><MenuItem value="02">02</MenuItem></Select></FormControl>
            <Button variant="contained" size="small">Q Query</Button>
            <Button variant="outlined" color="error" size="small">Clear conditions</Button>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>consumption: — • Family division: — • Gift income: —</Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 320 }}>
            <Table size="small" stickyHeader>
              <TableHead><TableRow sx={{ '& th': { bgcolor: 'grey.50', fontWeight: 600 } }}><TableCell>User nickname</TableCell><TableCell>Gift (ID/Quantity)</TableCell><TableCell>consumption</TableCell><TableCell>Gift recipient</TableCell><TableCell>Gift income</TableCell><TableCell>Live room</TableCell><TableCell>Family</TableCell><TableCell>Family division</TableCell><TableCell>Gifted time</TableCell></TableRow></TableHead>
              <TableBody><TableRow><TableCell colSpan={9} align="center" sx={{ py: 6 }}><Typography variant="body2" color="text.secondary">No Data</Typography></TableCell></TableRow></TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      {/* Gift Received Log */}
      <Dialog open={modal === 'giftReceived'} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { maxHeight: '90vh' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Gift Received Log
          <IconButton size="small" onClick={onClose}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            User nickname {u.nickname} ({u.userId}) Gift Received Log
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <TextField size="small" label="User ID" placeholder="Please enter user ID" sx={{ width: 140 }} />
            <TextField size="small" label="User nickname" placeholder="User nickname" sx={{ width: 140 }} />
            <FormControl size="small" sx={{ minWidth: 120 }}><InputLabel>Gift name</InputLabel><Select label="Gift name"><MenuItem value="all">All</MenuItem></Select></FormControl>
            <FormControl size="small" sx={{ minWidth: 80 }}><InputLabel>Year</InputLabel><Select label="Year"><MenuItem value="2026">2026</MenuItem></Select></FormControl>
            <FormControl size="small" sx={{ minWidth: 80 }}><InputLabel>Month</InputLabel><Select label="Month"><MenuItem value="02">02</MenuItem></Select></FormControl>
            <Button variant="contained" size="small">Q Query</Button>
            <Button variant="outlined" color="error" size="small">Clear conditions</Button>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Quantity: 0 • Price: 0 Coin</Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 320 }}>
            <Table size="small" stickyHeader>
              <TableHead><TableRow sx={{ '& th': { bgcolor: 'grey.50', fontWeight: 600 } }}><TableCell>GiftID</TableCell><TableCell>Gift name</TableCell><TableCell>User ID</TableCell><TableCell>User nickname</TableCell><TableCell>Quantity</TableCell><TableCell>Coin</TableCell><TableCell>Gifted time</TableCell></TableRow></TableHead>
              <TableBody><TableRow><TableCell colSpan={7} align="center" sx={{ py: 6 }}><Typography variant="body2" color="text.secondary">No Data</Typography></TableCell></TableRow></TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      {/* Guardian List */}
      <Dialog open={modal === 'guardian'} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Guardian List
          <IconButton size="small" onClick={onClose}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            User nickname {u.nickname} ({u.userId}) Guardian List
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField size="small" label="User ID" value={u.userId} sx={{ width: 120 }} />
            <FormControl size="small" sx={{ minWidth: 100 }}><InputLabel>Status</InputLabel><Select label="Status"><MenuItem value="all">All</MenuItem></Select></FormControl>
            <Button variant="contained" size="small">Q Query</Button>
            <Button variant="outlined" color="error" size="small">Clear conditions</Button>
          </Box>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead><TableRow sx={{ '& th': { bgcolor: 'grey.50', fontWeight: 600 } }}><TableCell>Number</TableCell><TableCell>Guardian</TableCell><TableCell>Anchor Nickname</TableCell><TableCell>Guardian Type Name</TableCell><TableCell>Start Time</TableCell><TableCell>End Time</TableCell><TableCell>Days Guarded</TableCell><TableCell>Operation</TableCell></TableRow></TableHead>
              <TableBody><TableRow><TableCell colSpan={8} align="center" sx={{ py: 6 }}><Typography variant="body2" color="text.secondary">No Data</Typography></TableCell></TableRow></TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      {/* Wishlist */}
      <Dialog open={modal === 'wishlist'} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Wishlist
          <IconButton size="small" onClick={onClose}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            User nickname {u.nickname} ({u.userId}) Wishlist
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField size="small" label="Date" type="date" InputLabelProps={{ shrink: true }} sx={{ width: 140 }} />
            <TextField size="small" label="To" type="date" InputLabelProps={{ shrink: true }} sx={{ width: 140 }} />
            <Button variant="contained" size="small">Q Query</Button>
            <Button variant="outlined" color="error" size="small">Clear conditions</Button>
          </Box>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead><TableRow sx={{ '& th': { bgcolor: 'grey.50', fontWeight: 600 } }}><TableCell padding="checkbox" /><TableCell>Number</TableCell><TableCell>Gift name</TableCell><TableCell>Gift icon</TableCell><TableCell>Date</TableCell><TableCell>Quantity</TableCell><TableCell>Progress</TableCell><TableCell>Task</TableCell><TableCell>Operation</TableCell></TableRow></TableHead>
              <TableBody><TableRow><TableCell colSpan={9} align="center" sx={{ py: 6 }}><Typography variant="body2" color="text.secondary">No Data</Typography></TableCell></TableRow></TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      {/* Login Log */}
      <Dialog open={modal === 'loginLog'} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Login Log - {u.nickname}
          <IconButton size="small" onClick={onClose}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
            <Table size="small">
              <TableHead><TableRow sx={{ '& th': { bgcolor: 'grey.50', fontWeight: 600 } }}><TableCell>Login Time</TableCell><TableCell>Login IP</TableCell><TableCell>Device Number</TableCell><TableCell>Login Device</TableCell></TableRow></TableHead>
              <TableBody>
                <TableRow><TableCell>2026-02-21 14:20:56</TableCell><TableCell>45.249.85.197</TableCell><TableCell>258f7e7947fd23f1f845701871495dd6c</TableCell><TableCell>Android skq1.210908.001</TableCell></TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      {/* Prohibited Payment - simple confirm */}
      <Dialog open={modal === 'prohibitedPayment'} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>Prohibited payment</DialogTitle>
        <DialogContent><DialogContentText>Confirm prohibited payment for user {u.nickname} ({u.userId})?</DialogContentText></DialogContent>
        <DialogActions><Button onClick={onClose}>Cancel</Button><Button variant="contained" color="error" onClick={onClose}>Confirm</Button></DialogActions>
      </Dialog>

      {/* One click to pull black */}
      <Dialog open={modal === 'pullBlack'} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>One click to pull black</DialogTitle>
        <DialogContent><DialogContentText>Confirm blacklisting user {u.nickname} ({u.userId})? This will restrict their access.</DialogContentText></DialogContent>
        <DialogActions><Button onClick={onClose}>Cancel</Button><Button variant="contained" color="error" onClick={onClose}>Confirm</Button></DialogActions>
      </Dialog>
    </>
  );
}
