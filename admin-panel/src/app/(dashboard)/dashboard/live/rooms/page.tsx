'use client';

import { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from '@mui/material';
import { Search, Clear, KeyboardArrowDown, Close } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { LiveRoom } from '@/types/live-room';

const DEMO_ROOMS: LiveRoom[] = [
  { id: 14260, roomNumber: 14260, anchorNickname: "RJ", anchorUserId: 166853, coin: 0, participantsActual: 0, participantsTotal: 0, totalPeople: 'Video playback not displayed', robotsCurrent: 0, robotsTotal: 0, status: 'Historical data', type: 'Interactive chat room', isCharged: 'No', chargeType: '-', recommended: 'No', reportCount: 0, creationTime: '2026-02-11 08:56:47', heartbeatTime: '-', popular: 0 },
  { id: 14261, roomNumber: 14261, anchorNickname: "it's me", anchorUserId: 167121, coin: 0, participantsActual: 1, participantsTotal: 0, totalPeople: 'Video playback not displayed', robotsCurrent: 1, robotsTotal: 0, status: 'Historical data', type: 'Interactive chat room', isCharged: 'No', chargeType: '-', recommended: 'No', reportCount: 0, creationTime: '2026-02-11 08:59:25', heartbeatTime: '-', popular: 0 },
  { id: 14262, roomNumber: 14262, anchorNickname: 'ChillHost', anchorUserId: 168200, coin: 0, participantsActual: 2, participantsTotal: 1, totalPeople: 'Video playback not displayed', robotsCurrent: 2, robotsTotal: 1, status: 'Historical data', type: 'Interactive chat room', isCharged: 'No', chargeType: '-', recommended: 'No', reportCount: 0, creationTime: '2026-02-11 09:02:10', heartbeatTime: '-', popular: 0 },
  { id: 14263, roomNumber: 14263, anchorNickname: 'LiveStar', anchorUserId: 168300, coin: 150, participantsActual: 5, participantsTotal: 3, totalPeople: '12', robotsCurrent: 0, robotsTotal: 0, status: 'Live', type: 'Interactive chat room', isCharged: 'Yes', chargeType: 'Per minute', recommended: 'Yes', reportCount: 1, creationTime: '2026-02-11 09:15:33', heartbeatTime: '2026-02-11 10:30:00', popular: 120 },
  { id: 14264, roomNumber: 14264, anchorNickname: 'VoiceHost', anchorUserId: 168400, coin: 0, participantsActual: 0, participantsTotal: 0, totalPeople: 'Video playback not displayed', robotsCurrent: 0, robotsTotal: 0, status: 'Historical data', type: 'Voice room', isCharged: 'No', chargeType: '-', recommended: 'No', reportCount: 0, creationTime: '2026-02-11 09:20:18', heartbeatTime: '-', popular: 0 },
];

const OP_MENU_ITEMS = [
  'View',
  'Gift List',
  'Live settings',
  'Device Information',
  'Manually pin to top',
  'Offline Settings',
  'Streaming address',
  'Close and prohibit broadcasting',
];

type ModalType = 'view' | 'giftList' | 'liveSettings' | 'device' | 'pinToTop' | 'offlineSettings' | 'streamingAddress' | 'closeAndBan' | null;

// Sample video URL for demo (Big Buck Bunny - public domain)
const DEMO_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export default function LiveRoomListPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<LiveRoom[]>(DEMO_ROOMS);
  const [anchorEl, setAnchorEl] = useState<{ el: HTMLElement; row: LiveRoom } | null>(null);
  const [modal, setModal] = useState<ModalType>(null);
  const [modalRow, setModalRow] = useState<LiveRoom | null>(null);
  const [liveSettings, setLiveSettings] = useState({ maxRobotProportion: 0, machineCount: 0, maxRobotAvatar: 0, sort: 0 });
  const [filters, setFilters] = useState({
    anchorId: '',
    anchorNickname: '',
    anchorTitle: '',
    category: '',
    creationTimeStart: '',
    creationTimeEnd: '',
  });

  useEffect(() => {
    addTab({
      id: '/dashboard/live/rooms',
      label: 'Live room list',
      path: '/dashboard/live/rooms',
      breadcrumbs: ['Home', 'Live Management', 'Rooms', 'Live room list'],
    });
  }, [addTab]);

  const selectedRow = modalRow ?? anchorEl?.row;

  const handleOpMenu = (e: React.MouseEvent<HTMLElement>, row: LiveRoom) => setAnchorEl({ el: e.currentTarget, row });
  const handleOpClose = () => setAnchorEl(null);
  const handleQuery = () => {};
  const handleClear = () => setFilters({ anchorId: '', anchorNickname: '', anchorTitle: '', category: '', creationTimeStart: '', creationTimeEnd: '' });

  const handleOpAction = (action: string) => {
    const row = anchorEl?.row ?? null;
    setModalRow(row);
    handleOpClose();
    const map: Record<string, ModalType> = {
      View: 'view',
      'Gift List': 'giftList',
      'Live settings': 'liveSettings',
      'Device Information': 'device',
      'Manually pin to top': 'pinToTop',
      'Offline Settings': 'offlineSettings',
      'Streaming address': 'streamingAddress',
      'Close and prohibit broadcasting': 'closeAndBan',
    };
    setModal(map[action] ?? null);
    if (action === 'Live settings') setLiveSettings({ maxRobotProportion: 0, machineCount: 0, maxRobotAvatar: 0, sort: 0 });
  };

  const closeModal = () => {
    setModal(null);
    setModalRow(null);
  };

  const handleCloseAndBan = () => {
    if (selectedRow) setData((prev) => prev.filter((r) => r.id !== selectedRow.id));
    closeModal();
  };

  const handleLiveSettingsConfirm = () => closeModal();

  const stickyFirst = {
    position: 'sticky' as const,
    left: 0,
    zIndex: 3,
    minWidth: 90,
    bgcolor: 'grey.50',
    boxShadow: '2px 0 4px -2px rgba(0,0,0,0.08)',
  };
  const stickyLast = {
    position: 'sticky' as const,
    right: 0,
    zIndex: 3,
    minWidth: 100,
    bgcolor: 'grey.50',
    boxShadow: '-2px 0 4px -2px rgba(0,0,0,0.08)',
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
          <TextField size="small" label="Anchor ID" placeholder="Please enter anchor ID" value={filters.anchorId} onChange={(e) => setFilters((p) => ({ ...p, anchorId: e.target.value }))} sx={{ minWidth: 140 }} />
          <TextField size="small" label="Anchor Nickname" placeholder="Please enter user nickname" value={filters.anchorNickname} onChange={(e) => setFilters((p) => ({ ...p, anchorNickname: e.target.value }))} sx={{ minWidth: 150 }} />
          <TextField size="small" label="Anchor Title" placeholder="Please enter the anchor title" value={filters.anchorTitle} onChange={(e) => setFilters((p) => ({ ...p, anchorTitle: e.target.value }))} sx={{ minWidth: 160 }} />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Category</InputLabel>
            <Select value={filters.category} label="Category" onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}>
              <MenuItem value="">Please select</MenuItem>
              <MenuItem value="chat">Interactive chat room</MenuItem>
              <MenuItem value="voice">Voice room</MenuItem>
            </Select>
          </FormControl>
          <TextField size="small" type="date" label="Creation time" InputLabelProps={{ shrink: true }} value={filters.creationTimeStart} onChange={(e) => setFilters((p) => ({ ...p, creationTimeStart: e.target.value }))} sx={{ minWidth: 160 }} />
          <TextField size="small" type="date" label="to" InputLabelProps={{ shrink: true }} value={filters.creationTimeEnd} onChange={(e) => setFilters((p) => ({ ...p, creationTimeEnd: e.target.value }))} sx={{ minWidth: 160 }} />
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>Q Query</Button>
          <Button variant="outlined" color="error" startIcon={<Clear />} onClick={handleClear}>Clear conditions</Button>
        </Box>
      </Paper>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small" stickyHeader sx={{ minWidth: 1400 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ ...stickyFirst, fontWeight: 600 }}>Room number</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 70 }} align="right">Coin</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 110 }} align="center">Number of Participants</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Total number of people</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 110 }} align="center">Robots/People</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>Is it charged?</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Type of charge</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>Recommended</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 90 }} align="right">Reports</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 165 }}>Creation time</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>Heartbeat Time</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 70 }} align="right">Popular</TableCell>
              <TableCell sx={{ ...stickyLast, fontWeight: 600 }}>Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={row.id}
                hover
                sx={{
                  '&:nth-of-type(even)': { bgcolor: 'grey.50' },
                  '&:hover td:first-of-type': { bgcolor: 'action.hover' },
                  '&:hover td:last-of-type': { bgcolor: 'action.hover' },
                }}
              >
                <TableCell
                  sx={{
                    ...stickyFirst,
                    zIndex: 2,
                    bgcolor: index % 2 === 1 ? 'grey.50' : 'background.paper',
                  }}
                >
                  {row.roomNumber}
                </TableCell>
                <TableCell align="right">{row.coin}</TableCell>
                <TableCell align="center">{row.participantsActual}/{row.participantsTotal}</TableCell>
                <TableCell>{row.totalPeople}</TableCell>
                <TableCell align="center">{row.robotsCurrent}/{row.robotsTotal}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.isCharged}</TableCell>
                <TableCell>{row.chargeType}</TableCell>
                <TableCell>{row.recommended}</TableCell>
                <TableCell align="right">{row.reportCount}</TableCell>
                <TableCell>{row.creationTime}</TableCell>
                <TableCell>{row.heartbeatTime}</TableCell>
                <TableCell align="right">{row.popular}</TableCell>
                <TableCell
                  sx={{
                    ...stickyLast,
                    zIndex: 2,
                    bgcolor: index % 2 === 1 ? 'grey.50' : 'background.paper',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Button size="small" variant="outlined" endIcon={<KeyboardArrowDown />} onClick={(e) => handleOpMenu(e, row)}>
                    Operation
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu anchorEl={anchorEl?.el} open={Boolean(anchorEl)} onClose={handleOpClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        {OP_MENU_ITEMS.map((item) => (
          <MenuItem key={item} onClick={() => handleOpAction(item)}>{item}</MenuItem>
        ))}
      </Menu>

      {/* View - Video player */}
      <Dialog open={modal === 'view'} onClose={closeModal} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Live stream – Room {selectedRow?.roomNumber}
          <IconButton onClick={closeModal} size="small" aria-label="Close"><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ bgcolor: 'black', borderRadius: 1, overflow: 'hidden', aspectRatio: '16/9' }}>
            <video
              src={DEMO_VIDEO_URL}
              controls
              autoPlay
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            >
              Your browser does not support the video tag.
            </video>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Room {selectedRow?.roomNumber}
            {selectedRow?.anchorNickname && ` • ${selectedRow.anchorNickname}${selectedRow.anchorUserId ? `(${selectedRow.anchorUserId})` : ''}`}
          </Typography>
        </DialogContent>
      </Dialog>

      {/* Gift List */}
      <Dialog open={modal === 'giftList'} onClose={closeModal} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {selectedRow ? `${selectedRow.anchorNickname ?? 'Anchor'}(${selectedRow.anchorUserId ?? selectedRow.roomNumber}) Gift Received Log (Room number: ${selectedRow.roomNumber})` : 'Gift Received Log'}
          <IconButton onClick={closeModal} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <TextField size="small" placeholder="Please enter user ID" sx={{ minWidth: 140 }} />
            <TextField size="small" placeholder="User nickname" sx={{ minWidth: 140 }} />
            <TextField size="small" label="Live room.ID" value={selectedRow?.roomNumber ?? ''} sx={{ minWidth: 120 }} />
            <FormControl size="small" sx={{ minWidth: 120 }}><InputLabel>Gift name</InputLabel><Select label="Gift name"><MenuItem value="all">All</MenuItem></Select></FormControl>
            <FormControl size="small" sx={{ minWidth: 100 }}><InputLabel>Gifted time</InputLabel><Select label="Year"><MenuItem value="2026">2026</MenuItem></Select></FormControl>
            <FormControl size="small" sx={{ minWidth: 100 }}><InputLabel>Month</InputLabel><Select label="Month"><MenuItem value="02">02</MenuItem></Select></FormControl>
            <Button variant="contained" size="small">Q Query</Button>
            <Button variant="outlined" color="error" size="small">Clear conditions</Button>
          </Box>
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
            <Table size="small">
              <TableHead><TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>GiftID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Gift name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>User ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>User nickname</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Coin</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Gifted time</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>IP</TableCell>
              </TableRow></TableHead>
              <TableBody>
                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>No Data (API integration ready)</TableCell></TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      {/* Live settings */}
      <Dialog open={modal === 'liveSettings'} onClose={closeModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Live settings
          <IconButton onClick={closeModal} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField fullWidth label="Room number" value={selectedRow?.roomNumber ?? ''} InputProps={{ readOnly: true }} sx={{ mb: 2 }} />
          <TextField fullWidth label="Maximum proportion with robot" type="number" value={liveSettings.maxRobotProportion} onChange={(e) => setLiveSettings((p) => ({ ...p, maxRobotProportion: +e.target.value }))} sx={{ mb: 2 }} />
          <TextField fullWidth label="Set the number of machines" type="number" value={liveSettings.machineCount} onChange={(e) => setLiveSettings((p) => ({ ...p, machineCount: +e.target.value }))} sx={{ mb: 2 }} />
          <TextField fullWidth label="The largest robot avatar" type="number" value={liveSettings.maxRobotAvatar} onChange={(e) => setLiveSettings((p) => ({ ...p, maxRobotAvatar: +e.target.value }))} sx={{ mb: 2 }} />
          <TextField fullWidth label="Sort" type="number" value={liveSettings.sort} onChange={(e) => setLiveSettings((p) => ({ ...p, sort: +e.target.value }))} />
        </DialogContent>
        <DialogActions><Button onClick={closeModal}>Cancel</Button><Button variant="contained" onClick={handleLiveSettingsConfirm}>Confirm</Button></DialogActions>
      </Dialog>

      {/* Device Information */}
      <Dialog open={modal === 'device'} onClose={closeModal} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {selectedRow ? `${selectedRow.anchorNickname ?? 'Anchor'}(${selectedRow.anchorUserId ?? selectedRow.roomNumber}) Device Information` : 'Device Information'}
          <Box><Button size="small">Refresh</Button><IconButton onClick={closeModal} size="small"><Close /></IconButton></Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>User device:</Typography>
          <Box sx={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100', borderRadius: 2 }}>
            <Typography color="text.secondary">Charts: Number of views, Coin, APP CPU, System CPU, Upload/Download speed, Packet loss, Video frame rate</Typography>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Manually pin to top - Confirm */}
      <Dialog open={modal === 'pinToTop'} onClose={closeModal}>
        <DialogTitle>Prompt</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ color: 'warning.main', fontSize: 32 }}>⚠</Box>
            <Typography>Confirm whether to proceed?</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button variant="contained" onClick={closeModal}>Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Offline Settings */}
      <Dialog open={modal === 'offlineSettings'} onClose={closeModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Offline Settings – Room {selectedRow?.roomNumber}
          <IconButton onClick={closeModal} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Room number" value={selectedRow?.roomNumber ?? ''} InputProps={{ readOnly: true }} sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">Configure offline playback, replay visibility, and related settings.</Typography>
          <Box sx={{ height: 80, mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">Settings form (API integration ready)</Typography>
          </Box>
        </DialogContent>
        <DialogActions><Button onClick={closeModal}>Cancel</Button><Button variant="contained" onClick={closeModal}>Confirm</Button></DialogActions>
      </Dialog>

      {/* Streaming address */}
      <Dialog open={modal === 'streamingAddress'} onClose={closeModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Streaming address
          <IconButton onClick={closeModal} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>Room number {selectedRow?.roomNumber}</Typography>
          <TextField fullWidth label="Streaming URL" value={`rtmp://stream.example.com/live/room-${selectedRow?.roomNumber}`} InputProps={{ readOnly: true }} />
        </DialogContent>
      </Dialog>

      {/* Close and prohibit broadcasting */}
      <Dialog open={modal === 'closeAndBan'} onClose={closeModal}>
        <DialogTitle>Prompt</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ color: 'warning.main', fontSize: 32 }}>⚠</Box>
            <Typography>Confirm to close this live broadcast and ban it.</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleCloseAndBan}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
