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
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import type { EncryptionKeyConfig } from '@/types/encryption-key';

interface Props {
  item: EncryptionKeyConfig;
  open: boolean;
  onClose: () => void;
  onSave: (
    id: number,
    key: string,
    packingAndFilling: boolean,
    valid: boolean
  ) => Promise<void>;
}

export function EncryptionKeyEditDialog({ item, open, onClose, onSave }: Props) {
  const [key, setKey] = useState(item.key);
  const [packingAndFilling, setPackingAndFilling] = useState(item.packingAndFilling);
  const [valid, setValid] = useState(item.valid);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setKey(item.key);
      setPackingAndFilling(item.packingAndFilling);
      setValid(item.valid);
      setError('');
    }
  }, [open, item]);

  const handleSubmit = async () => {
    const trimmed = key.trim();
    if (!trimmed) {
      setError('Encryption key is required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onSave(item.id, trimmed, packingAndFilling, valid);
      onClose();
    } catch (e) {
      setError('Failed to update encryption key');
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            autoFocus
            label="* Encryption key"
            fullWidth
            value={key}
            onChange={(e) => setKey(e.target.value)}
            error={!!error}
            helperText={error || '(长度: 16位)'}
            placeholder="1400480612000000"
          />

          <Box sx={{ pt: 1 }}>
            <FormLabel sx={{ mb: 1, display: 'block' }}>configuration</FormLabel>
            <FormControl component="fieldset" sx={{ mt: 1 }}>
              <FormLabel component="legend" sx={{ fontSize: 14, mb: 1 }}>
                Packing and filling
              </FormLabel>
              <RadioGroup
                row
                value={packingAndFilling ? 'Yes' : 'No'}
                onChange={(e) => setPackingAndFilling(e.target.value === 'Yes')}
              >
                <FormControlLabel value="Yes" control={<Radio size="small" />} label="Yes" />
                <FormControlLabel value="No" control={<Radio size="small" />} label="No" />
              </RadioGroup>
            </FormControl>
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend" sx={{ fontSize: 14, mb: 1 }}>
                Whether to enable
              </FormLabel>
              <RadioGroup
                row
                value={valid ? 'Valid' : 'Invalid'}
                onChange={(e) => setValid(e.target.value === 'Valid')}
              >
                <FormControlLabel value="Valid" control={<Radio size="small" />} label="Valid" />
                <FormControlLabel value="Invalid" control={<Radio size="small" />} label="Invalid" />
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving...' : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
