'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Box,
} from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (key: string, packingAndFilling: boolean, valid: boolean) => Promise<void>;
}

export function EncryptionKeyAddDialog({ open, onClose, onAdd }: Props) {
  const [key, setKey] = useState('');
  const [packingAndFilling, setPackingAndFilling] = useState(true);
  const [valid, setValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const trimmed = key.trim();
    if (!trimmed) {
      setError('Encryption key is required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onAdd(trimmed, packingAndFilling, valid);
      setKey('');
      setPackingAndFilling(true);
      setValid(true);
      onClose();
    } catch (e) {
      setError('Failed to add encryption key');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setKey('');
    setPackingAndFilling(true);
    setValid(true);
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Encryption Key</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="Encryption key configuration"
          fullWidth
          value={key}
          onChange={(e) => setKey(e.target.value)}
          error={!!error}
          helperText={error}
          placeholder="e.g. 1400480612000000"
          sx={{ mt: 1 }}
        />
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={packingAndFilling}
                onChange={(e) => setPackingAndFilling(e.target.checked)}
                color="primary"
              />
            }
            label="Packing and filling"
          />
          <FormControlLabel
            control={
              <Switch
                checked={valid}
                onChange={(e) => setValid(e.target.checked)}
                color="primary"
              />
            }
            label="Valid"
          />
        </Box>
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
