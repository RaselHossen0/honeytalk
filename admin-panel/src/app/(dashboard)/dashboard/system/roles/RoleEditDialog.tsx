'use client';

import { useState, useEffect } from 'react';
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
import type { Role } from '@/types/role';

interface Props {
  item: Role;
  open: boolean;
  onClose: () => void;
  onSave: (id: number, roleCode: string, roleName: string, note: string, status: 'Ban' | 'Unban') => Promise<void>;
}

export function RoleEditDialog({ item, open, onClose, onSave }: Props) {
  const [roleCode, setRoleCode] = useState(item.roleCode);
  const [roleName, setRoleName] = useState(item.roleName);
  const [note, setNote] = useState(item.note);
  const [status, setStatus] = useState<'Ban' | 'Unban'>(item.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setRoleCode(item.roleCode);
      setRoleName(item.roleName);
      setNote(item.note);
      setStatus(item.status);
      setError('');
    }
  }, [open, item]);

  const handleSubmit = async () => {
    const trimmedName = roleName.trim();
    if (!trimmedName) {
      setError('Role name is required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onSave(item.id, roleCode.trim(), trimmedName, note.trim(), status);
      onClose();
    } catch (e) {
      setError('Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Edit
        <IconButton size="small" onClick={onClose} aria-label="Close">
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
            <InputLabel id="role-edit-status-label" shrink>Status</InputLabel>
            <Select
              labelId="role-edit-status-label"
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
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
