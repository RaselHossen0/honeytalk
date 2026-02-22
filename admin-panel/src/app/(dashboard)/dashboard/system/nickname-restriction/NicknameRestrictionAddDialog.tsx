'use client';

import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (nickname: string) => Promise<void>;
}

export function NicknameRestrictionAddDialog({ open, onClose, onAdd }: Props) {
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const trimmed = nickname.trim();
    if (!trimmed) {
      setError('Nickname is required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onAdd(trimmed);
      setNickname('');
      onClose();
    } catch (e) {
      setError('Failed to add nickname');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNickname('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Nickname Restriction</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="Nickname Restriction"
          fullWidth
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          error={!!error}
          helperText={error}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Adding...' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
