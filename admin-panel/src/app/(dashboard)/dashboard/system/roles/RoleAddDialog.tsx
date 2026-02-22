'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (roleCode: string, roleName: string, note: string, status: 'Ban' | 'Unban') => Promise<void>;
}

export function RoleAddDialog({ open, onClose, onAdd }: Props) {
  const [roleCode, setRoleCode] = useState('');
  const [roleName, setRoleName] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'Ban' | 'Unban'>('Unban');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const trimmedName = roleName.trim();
    if (!trimmedName) {
      setError('Role name is required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onAdd(roleCode.trim(), trimmedName, note.trim(), status);
      setRoleCode('');
      setRoleName('');
      setNote('');
      setStatus('Unban');
      onClose();
    } catch (e) {
      setError('Failed to add role');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRoleCode('');
    setRoleName('');
    setNote('');
    setStatus('Unban');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Create
        <IconButton size="small" onClick={handleClose} aria-label="Close">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Role code"
            fullWidth
            value={roleCode}
            onChange={(e) => setRoleCode(e.target.value)}
          />
          <TextField
            label="* Role Name"
            fullWidth
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            required
            error={!!error}
            helperText={error}
          />
          <Box>
            <Box component="label" sx={{ fontSize: 14, fontWeight: 500, color: 'text.primary', display: 'block', mb: 0.5 }}>
              Character description
            </Box>
            <TextField
              placeholder="description"
              fullWidth
              multiline
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              sx={{ mt: 0.5 }}
            />
          </Box>
          <FormControl fullWidth>
            <InputLabel id="role-add-status-label" shrink>Status</InputLabel>
            <Select
              labelId="role-add-status-label"
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value as 'Ban' | 'Unban')}
            >
              <MenuItem value="Unban">Unban</MenuItem>
              <MenuItem value="Ban">Ban</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
