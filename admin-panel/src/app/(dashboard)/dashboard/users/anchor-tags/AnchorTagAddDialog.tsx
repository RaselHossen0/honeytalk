'use client';

import { useState } from 'react';
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

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (label: string, gender: 'Male' | 'Female', color: string) => Promise<void>;
}

export function AnchorTagAddDialog({ open, onClose, onAdd }: Props) {
  const [label, setLabel] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Female');
  const [color, setColor] = useState('#F61073');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const trimmed = label.trim();
    if (!trimmed) {
      setError('Label is required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onAdd(trimmed, gender, color);
      setLabel('');
      setGender('Female');
      setColor('#F61073');
      onClose();
    } catch (e) {
      setError('Failed to add anchor tag');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setLabel('');
    setGender('Female');
    setColor('#F61073');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Anchor Tag</DialogTitle>
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
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Adding...' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
