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
import { Search, Clear, KeyboardArrowDown, Add, Close } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import type { VoiceRoom } from '@/types/voice-room';

const DEMO_VOICE_ROOMS: VoiceRoom[] = [
  { id: 1, roomNumber: 14265, title: 'Party Time 🎉🎉', coverImageUrl: 'https://i.pravatar.cc/80?img=10', anchorNickname: 'Bogo168422', anchorUserId: 168422, category: 'Sing', password: '', participantsActual: 1, participantsTotal: 0, totalPeople: '', robotsCurrent: 1, robotsTotal: 0, recommended: 'No', reportCount: 0, creationTime: '2026-02-14 12:45:36' },
  { id: 2, roomNumber: 14266, title: 'Chill Vibes', coverImageUrl: 'https://i.pravatar.cc/80?img=11', anchorNickname: 'User123', anchorUserId: 168500, category: 'Chat', password: '', participantsActual: 5, participantsTotal: 3, totalPeople: '8', robotsCurrent: 0, robotsTotal: 0, recommended: 'Yes', reportCount: 0, creationTime: '2026-02-14 14:20:00' },
  { id: 3, roomNumber: 14267, title: 'Karaoke Night', coverImageUrl: 'https://i.pravatar.cc/80?img=12', anchorNickname: 'StarSinger', anchorUserId: 168600, category: 'Sing', password: '***', participantsActual: 12, participantsTotal: 10, totalPeople: '22', robotsCurrent: 2, robotsTotal: 1, recommended: 'Yes', reportCount: 1, creationTime: '2026-02-14 15:30:15' },
];

const OP_MENU_ITEMS = [
  'View',
  'Edit',
  'Administrator List',
  'List of wheat positions',
  'Audience List',
  'Gift List',
  'Live settings',
  'Device Information',
  'Manually pin to top',
  'Offline Settings',
  'Streaming address',
  'Close room',
  'Close and prohibit broadcasting',
];

const DEMO_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

type ModalType = 'view' | 'administrator' | 'wheat' | 'audience' | 'gift' | 'liveSettings' | 'device' | 'pinToTop' | 'offlineSettings' | 'streamingAddress' | 'closeRoom' | 'closeAndBan' | null;

export default function VoiceRoomsPage() {
  const addTab = useTabsStore((s) => s.addTab);
  const [data, setData] = useState<VoiceRoom[]>(DEMO_VOICE_ROOMS);
  const [anchorEl, setAnchorEl] = useState<{ el: HTMLElement; row: VoiceRoom } | null>(null);
  const [modal, setModal] = useState<ModalType>(null);
  const [modalRow, setModalRow] = useState<VoiceRoom | null>(null);
  const [liveSettings, setLiveSettings] = useState({ maxRobotProportion: 0, machineCount: 1, maxRobotAvatar: 0, sort: 0 });
  const [filters, setFilters] = useState({
    anchorId: '',
    anchorNickname: '',
    anchorTitle: '',
    wheatPosition: '',
    category: '',
    creationTimeStart: '',
    creationTimeEnd: '',
  });

  const selectedRow = modalRow ?? anchorEl?.row;

  useEffect(() => {
    addTab({
      id: '/dashboard/live/voice-rooms',
      label: 'Voice room',
      path: '/dashboard/live/voice-rooms',
      breadcrumbs: ['Home', 'Live Management', 'Rooms', 'Voice room'],
    });
  }, [addTab]);

  const handleOpMenu = (e: React.MouseEvent<HTMLElement>, row: VoiceRoom) => setAnchorEl({ el: e.currentTarget, row });
  const handleOpClose = () => setAnchorEl(null);

  const handleOpAction = (action: string) => {
    setModalRow(anchorEl?.row ?? null);
    handleOpClose();
    const map: Record<string, ModalType> = {
      View: 'view',
      Edit: null, // TODO: open edit form
      'Administrator List': 'administrator',
      'List of wheat positions': 'wheat',
      'Audience List': 'audience',
      'Gift List': 'gift',
      'Live settings': 'liveSettings',
      'Device Information': 'device',
      'Manually pin to top': 'pinToTop',
      'Offline Settings': 'offlineSettings',
      'Streaming address': 'streamingAddress',
      'Close room': 'closeRoom',
      'Close and prohibit broadcasting': 'closeAndBan',
    };
    setModal(map[action] ?? null);
    if (action === 'Live settings') setLiveSettings({ maxRobotProportion: 0, machineCount: 1, maxRobotAvatar: 0, sort: 0 });
  };

  const handleQuery = () => {};
  const handleClear = () => setFilters({ anchorId: '', anchorNickname: '', anchorTitle: '', wheatPosition: '', category: '', creationTimeStart: '', creationTimeEnd: '' });

  const handleCloseRoom = () => {
    if (selectedRow) setData((prev) => prev.filter((r) => r.id !== selectedRow.id));
    setModal(null);
    setModalRow(null);
  };

  const handleLiveSettingsConfirm = () => {
    setModal(null);
    setModalRow(null);
  };

  const closeModal = () => {
    setModal(null);
    setModalRow(null);
  };

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

  const renderEmptyTable = (cols: { label: string; minWidth?: number }[]) => (
    <Table size="small">
      <TableHead>
        <TableRow sx={{ bgcolor: 'grey.50' }}>
          {cols.map((c) => (
            <TableCell key={c.label} sx={{ fontWeight: 600, minWidth: c.minWidth ?? 100 }}>{c.label}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell colSpan={cols.length} align="center" sx={{ py: 4, color: 'text.secondary' }}>No Data</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
          <TextField size="small" label="Anchor ID" placeholder="Please enter anchor ID" value={filters.anchorId} onChange={(e) => setFilters((p) => ({ ...p, anchorId: e.target.value }))} sx={{ minWidth: 140 }} />
          <TextField size="small" label="Anchor Nickname" placeholder="Please enter user nickname" value={filters.anchorNickname} onChange={(e) => setFilters((p) => ({ ...p, anchorNickname: e.target.value }))} sx={{ minWidth: 150 }} />
          <TextField size="small" label="Anchor Title" placeholder="Please enter the anchor title" value={filters.anchorTitle} onChange={(e) => setFilters((p) => ({ ...p, anchorTitle: e.target.value }))} sx={{ minWidth: 160 }} />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>List of wheat positions</InputLabel>
            <Select value={filters.wheatPosition} label="List of wheat positions" onChange={(e) => setFilters((p) => ({ ...p, wheatPosition: e.target.value }))}>
              <MenuItem value="">Please select</MenuItem>
              <MenuItem value="1">Position 1</MenuItem>
              <MenuItem value="2">Position 2</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Category</InputLabel>
            <Select value={filters.category} label="Category" onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}>
              <MenuItem value="">Please select</MenuItem>
              <MenuItem value="Sing">Sing</MenuItem>
              <MenuItem value="Chat">Chat</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField size="small" type="date" label="Creation time" InputLabelProps={{ shrink: true }} value={filters.creationTimeStart} onChange={(e) => setFilters((p) => ({ ...p, creationTimeStart: e.target.value }))} sx={{ minWidth: 160 }} />
          <TextField size="small" type="date" label="to" InputLabelProps={{ shrink: true }} value={filters.creationTimeEnd} onChange={(e) => setFilters((p) => ({ ...p, creationTimeEnd: e.target.value }))} sx={{ minWidth: 160 }} />
          <Button variant="contained" startIcon={<Search />} onClick={handleQuery}>Query</Button>
          <Button variant="outlined" color="error" startIcon={<Clear />} onClick={handleClear}>Clear conditions</Button>
        </Box>
      </Paper>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small" stickyHeader sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ ...stickyFirst, fontWeight: 600 }}>Room number</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 80 }}>Cover image</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 160 }}>Anchor Nickname</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>Password</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 130 }} align="center">Participants</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Total people</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 110 }} align="center">Robots/People</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>Recommended</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 90 }} align="right">Reports</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 165 }}>Creation time</TableCell>
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
                <TableCell>{row.title}</TableCell>
                <TableCell>
                  {row.coverImageUrl ? (
                    <Box sx={{ width: 48, height: 48, borderRadius: 1, overflow: 'hidden' }}>
                      <img src={row.coverImageUrl} alt="" width={48} height={48} style={{ objectFit: 'cover' }} />
                    </Box>
                  ) : (
                    <Box sx={{ width: 48, height: 48, borderRadius: 1, bgcolor: 'grey.300' }} />
                  )}
                </TableCell>
                <TableCell>{row.anchorNickname} ({row.anchorUserId})</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.password || '—'}</TableCell>
                <TableCell align="center">{row.participantsActual} / {row.participantsTotal}</TableCell>
                <TableCell>{row.totalPeople || '—'}</TableCell>
                <TableCell align="center">{row.robotsCurrent} / {row.robotsTotal}</TableCell>
                <TableCell>{row.recommended}</TableCell>
                <TableCell align="right">{row.reportCount}</TableCell>
                <TableCell>{row.creationTime}</TableCell>
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
            <video src={DEMO_VIDEO_URL} controls autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'contain' }}>
              Your browser does not support the video tag.
            </video>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Room {selectedRow?.roomNumber} • {selectedRow?.title} • {selectedRow?.anchorNickname}({selectedRow?.anchorUserId})
          </Typography>
        </DialogContent>
      </Dialog>

      {/* Administrator List */}
      <Dialog open={modal === 'administrator'} onClose={closeModal} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Administrator List
          <IconButton onClick={closeModal} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Button variant="contained" startIcon={<Add />} sx={{ mb: 2 }}>Add</Button>
          <TableContainer>{renderEmptyTable([{ label: 'User ID' }, { label: 'User nickname' }, { label: 'Add Time' }, { label: 'Operation' }])}</TableContainer>
        </DialogContent>
      </Dialog>

      {/* Audience List */}
      <Dialog open={modal === 'audience'} onClose={closeModal} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Audience List – Room {selectedRow?.roomNumber}
          <IconButton onClick={closeModal} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <TableContainer>{renderEmptyTable([{ label: 'User ID' }, { label: 'User nickname' }, { label: 'Avatar' }, { label: 'Join time' }, { label: 'Operation' }])}</TableContainer>
        </DialogContent>
      </Dialog>

      {/* List of wheat positions */}
      <Dialog open={modal === 'wheat'} onClose={closeModal} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          List of wheat positions
          <IconButton onClick={closeModal} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <TableContainer>{renderEmptyTable([{ label: 'User ID' }, { label: 'User nickname' }, { label: 'Avatar' }, { label: 'Display Position' }, { label: 'Add Time' }, { label: 'Operation' }])}</TableContainer>
        </DialogContent>
      </Dialog>

      {/* Gift Received Log */}
      <Dialog open={modal === 'gift'} onClose={closeModal} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {selectedRow ? `${selectedRow.anchorNickname}(${selectedRow.anchorUserId}) Gift Received Log (Room number: ${selectedRow.roomNumber})` : 'Gift Received Log'}
          <IconButton onClick={closeModal} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <TextField size="small" placeholder="Please enter user ID" sx={{ minWidth: 140 }} />
            <TextField size="small" placeholder="User nickname" sx={{ minWidth: 140 }} />
            <TextField size="small" label="Live room ID" value={selectedRow?.roomNumber ?? ''} sx={{ minWidth: 120 }} />
            <FormControl size="small" sx={{ minWidth: 120 }}><InputLabel>Gift name</InputLabel><Select label="Gift name"><MenuItem value="all">All</MenuItem></Select></FormControl>
            <FormControl size="small" sx={{ minWidth: 100 }}><InputLabel>Year</InputLabel><Select label="Year"><MenuItem value="2026">2026</MenuItem></Select></FormControl>
            <FormControl size="small" sx={{ minWidth: 100 }}><InputLabel>Month</InputLabel><Select label="Month"><MenuItem value="02">02</MenuItem></Select></FormControl>
            <Button variant="contained" size="small">Query</Button>
            <Button variant="outlined" color="error" size="small">Clear conditions</Button>
          </Box>
          <TableContainer>{renderEmptyTable([{ label: 'GiftID' }, { label: 'Gift name' }, { label: 'User ID' }, { label: 'User nickname' }, { label: 'Quantity' }, { label: 'Coin' }, { label: 'Gifted time' }, { label: 'IP' }])}</TableContainer>
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
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button variant="contained" onClick={handleLiveSettingsConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Device Information */}
      <Dialog open={modal === 'device'} onClose={closeModal} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {selectedRow ? `${selectedRow.anchorNickname}(${selectedRow.anchorUserId}) Device Information` : 'Device Information'}
          <Box><Button size="small">Refresh</Button><IconButton onClick={closeModal} size="small"><Close /></IconButton></Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>User device:</Typography>
          <Box sx={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100', borderRadius: 2 }}>
            <Typography color="text.secondary">Charts: Number of views, Coin, APP CPU, System CPU, Upload/Download speed, Packet loss, Video frame rate</Typography>
          </Box>
        </DialogContent>
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

      {/* Manually pin to top */}
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

      {/* Close room - Confirm */}
      <Dialog open={modal === 'closeRoom'} onClose={closeModal}>
        <DialogTitle>Prompt</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ color: 'warning.main', fontSize: 32 }}>⚠</Box>
            <Typography>Confirm to close the live broadcast</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleCloseRoom}>Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Close and prohibit broadcasting */}
      <Dialog open={modal === 'closeAndBan'} onClose={closeModal}>
        <DialogTitle>Prompt</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ color: 'warning.main', fontSize: 32 }}>⚠</Box>
            <Typography>Confirm to close this live broadcast and ban it</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleCloseRoom}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
