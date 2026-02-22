'use client';

import { useState } from 'react';
import Image from 'next/image';
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
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { Close, Check } from '@mui/icons-material';
import type { Level } from '@/types/level';
import { LEVEL_AVATAR_FRAMES_DEMO } from '@/lib/demo-data';
import { updateLevel, createLevel } from '@/services/level';

interface LevelEditModalProps {
  open: boolean;
  level: Level | null;
  gender: 'female' | 'male';
  onClose: () => void;
  onSaved: (mode: 'edit' | 'add', level: Level) => void;
}

export function LevelEditModal({ open, level, gender, onClose, onSaved }: LevelEditModalProps) {
  const [form, setForm] = useState({
    level: 1,
    levelName: '',
    requiredIntegralValue: 0,
  });
  const [selectedRewards, setSelectedRewards] = useState<Record<number, { days: number; sort: number }>>({});

  const handleOpen = () => {
    if (level) {
      setForm({
        level: level.level,
        levelName: level.levelName,
        requiredIntegralValue: level.requiredIntegralValue,
      });
      const rewards: Record<number, { days: number; sort: number }> = {};
      (level.avatarFrameRewards ?? []).forEach((r) => {
        rewards[r.frameId] = { days: r.days, sort: r.sort };
      });
      setSelectedRewards(rewards);
    } else {
      setForm({ level: 1, levelName: 'Lv1', requiredIntegralValue: 100 });
      setSelectedRewards({});
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = async () => {
    const avatarFrameRewards = Object.entries(selectedRewards).map(([frameId, cfg]) => ({
      frameId: Number(frameId),
      days: cfg.days,
      sort: cfg.sort,
    }));
    const payload = {
      level: form.level,
      levelName: form.levelName,
      requiredIntegralValue: form.requiredIntegralValue,
      avatarFrameRewards,
    };
    if (level) {
      await updateLevel(level.id, payload);
      onSaved('edit', {
        ...level,
        ...payload,
        avatarFrameRewards: Object.entries(selectedRewards).map(([frameId, cfg]) => {
          const frame = LEVEL_AVATAR_FRAMES_DEMO.find((f) => f.id === Number(frameId));
          return {
            frameId: Number(frameId),
            frameName: frame?.name ?? '',
            imageUrl: frame?.imageUrl ?? '',
            days: cfg.days,
            sort: cfg.sort,
          };
        }),
      });
    } else {
      const created = await createLevel(gender, payload);
      onSaved('add', created);
    }
    onClose();
  };

  const toggleFrame = (frameId: number, frameName: string, imageUrl: string) => {
    if (frameId in selectedRewards) {
      const next = { ...selectedRewards };
      delete next[frameId];
      setSelectedRewards(next);
    } else {
      setSelectedRewards((prev) => ({
        ...prev,
        [frameId]: { days: 7, sort: Object.keys(prev).length + 1 },
      }));
    }
  };

  const updateRewardConfig = (frameId: number, field: 'days' | 'sort', value: number) => {
    setSelectedRewards((prev) => {
      const cfg = prev[frameId];
      if (!cfg) return prev;
      return { ...prev, [frameId]: { ...cfg, [field]: value } };
    });
  };

  const handleClearSelection = () => setSelectedRewards({});

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      onTransitionEnter={handleOpen}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
        {level ? 'Edit' : 'Add'}
        <IconButton size="small" onClick={handleClose} aria-label="Close">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Basic Information */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} color="primary" sx={{ borderBottom: 2, borderColor: 'primary.main', pb: 0.5, mb: 2 }}>
              Basic Information
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Level</InputLabel>
                <Select
                  value={form.level}
                  label="Level"
                  onChange={(e) => setForm((p) => ({ ...p, level: Number(e.target.value) }))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lv) => (
                    <MenuItem key={lv} value={lv}>
                      {lv}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                size="small"
                label="Level Name"
                value={form.levelName}
                onChange={(e) => setForm((p) => ({ ...p, levelName: e.target.value }))}
                sx={{ minWidth: 120 }}
              />
              <Box>
                <TextField
                  size="small"
                  label="Required"
                  type="number"
                  value={form.requiredIntegralValue}
                  onChange={(e) => setForm((p) => ({ ...p, requiredIntegralValue: Number(e.target.value) || 0 }))}
                  sx={{ minWidth: 120 }}
                  inputProps={{ min: 0 }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  integral value
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Avatar frame */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} color="primary" sx={{ borderBottom: 2, borderColor: 'primary.main', pb: 0.5 }}>
                Avatar frame
              </Typography>
              <Button size="small" variant="outlined" color="inherit" onClick={handleClearSelection}>
                Clear selection
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select rewards and set the number of days and sort
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
              {LEVEL_AVATAR_FRAMES_DEMO.map((frame) => {
                const selected = frame.id in selectedRewards;
                const cfg = selectedRewards[frame.id];
                return (
                  <Box
                    key={frame.id}
                    sx={{
                      p: 1.5,
                      border: 2,
                      borderColor: selected ? 'primary.main' : 'grey.300',
                      borderRadius: 2,
                      cursor: 'pointer',
                      bgcolor: selected ? 'action.hover' : 'grey.50',
                      position: 'relative',
                      '&:hover': { borderColor: selected ? 'primary.main' : 'grey.400' },
                    }}
                    onClick={() => toggleFrame(frame.id, frame.name, frame.imageUrl)}
                  >
                    {selected && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Check sx={{ fontSize: 16 }} />
                      </Box>
                    )}
                    <Box sx={{ position: 'relative', width: '100%', aspectRatio: 1, borderRadius: 1, overflow: 'hidden', mb: 1 }}>
                      <Image src={frame.imageUrl} alt={frame.name} fill sizes="80px" style={{ objectFit: 'cover' }} unoptimized />
                    </Box>
                    <Typography variant="body2" fontWeight={500} textAlign="center" sx={{ mb: selected ? 1.5 : 0 }}>
                      {frame.name}
                    </Typography>
                    {selected && cfg && (
                      <Box
                        sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <TextField
                          size="small"
                          label="Days"
                          type="number"
                          value={cfg.days}
                          onChange={(e) => updateRewardConfig(frame.id, 'days', Number(e.target.value) || 0)}
                          inputProps={{ min: 1 }}
                        />
                        <TextField
                          size="small"
                          label="Sort"
                          type="number"
                          value={cfg.sort}
                          onChange={(e) => updateRewardConfig(frame.id, 'sort', Number(e.target.value) || 0)}
                          inputProps={{ min: 0 }}
                        />
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" color="inherit" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
