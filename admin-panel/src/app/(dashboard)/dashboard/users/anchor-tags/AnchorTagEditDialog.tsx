'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import type { AnchorTag } from '@/types/anchor-tag';

interface Props {
  item: AnchorTag;
  open: boolean;
  onClose: () => void;
  onSave: (id: number, label: string, gender: 'Male' | 'Female', color: string) => Promise<void>;
}

export function AnchorTagEditDialog({ item, open, onClose, onSave }: Props) {
  const [label, setLabel] = useState(item.label);
  const [gender, setGender] = useState<'Male' | 'Female'>(item.gender);
  const [color, setColor] = useState(item.color);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setLabel(item.label);
      setGender(item.gender);
      setColor(item.color);
      setError('');
    }
  }, [open, item]);

  const handleSubmit = async () => {
    const trimmed = label.trim();
    if (!trimmed) {
      setError('Label is required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onSave(item.id, trimmed, gender, color);
      onClose();
    } catch (e) {
      setError('Failed to update anchor tag');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Anchor Tag</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="Label"
          fullWidth
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          error={!!error}
          helperText={error}
          sx={{ mt: 1 }}
        />
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Gender</InputLabel>
          <Select
            value={gender}
            label="Gender"
            onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
          >
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="color"
          fullWidth
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          sx={{ mt: 2 }}
          InputProps={{
            sx: { height: 48 },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
