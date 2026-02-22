'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import type { FamilyLevel } from '@/types/family-level';
import { updateFamilyLevel, createFamilyLevel } from '@/services/family-level';

interface FamilyLevelEditModalProps {
  open: boolean;
  level: FamilyLevel | null;
  onClose: () => void;
  onSaved: (mode: 'edit' | 'add', level: FamilyLevel) => void;
}

export function FamilyLevelEditModal({ open, level, onClose, onSaved }: FamilyLevelEditModalProps) {
  const [levelName, setLevelName] = useState('');
  const [requiredIntegralValue, setRequiredIntegralValue] = useState<number | ''>(0);

  useEffect(() => {
    if (open) {
      if (level) {
        setLevelName(level.levelName);
        setRequiredIntegralValue(level.requiredIntegralValue);
      } else {
        setLevelName('');
        setRequiredIntegralValue(0);
      }
    }
  }, [open, level]);

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = async () => {
    const trimmed = levelName.trim();
    if (!trimmed) return;
    const value = requiredIntegralValue === '' ? 0 : Number(requiredIntegralValue);
    if (value < 0) return;

    if (level) {
      await updateFamilyLevel(level.id, { levelName: trimmed, requiredIntegralValue: value });
      onSaved('edit', { ...level, levelName: trimmed, requiredIntegralValue: value });
    } else {
      const created = await createFamilyLevel({ levelName: trimmed, requiredIntegralValue: value });
      onSaved('add', created);
    }
    onClose();
  };

  const isValid = levelName.trim() !== '' && (requiredIntegralValue === '' ? false : Number(requiredIntegralValue) >= 0);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
        {level ? 'Edit' : 'Add'}
        <IconButton size="small" onClick={handleClose} aria-label="Close">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 2 }}>
        {level && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Level {level.level}
          </Typography>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Level Name"
            required
            fullWidth
            value={levelName}
            onChange={(e) => setLevelName(e.target.value)}
            variant="outlined"
            placeholder="e.g. Lv1"
          />
          <Box>
            <TextField
              label="Required"
              required
              type="number"
              fullWidth
              value={requiredIntegralValue}
              onChange={(e) =>
                setRequiredIntegralValue(e.target.value === '' ? '' : Number(e.target.value))
              }
              inputProps={{ min: 0 }}
              variant="outlined"
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              integral value
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" color="inherit" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleConfirm} disabled={!isValid}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
