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
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import type { TaskType } from '@/types/task';

const TASK_TYPES: TaskType[] = [
  'Online tasks',
  'Game task',
  'Rewarding Anchor Task',
  'Share anchor tasks',
  'Follow streamer tasks',
];

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (data: {
    title: string;
    description?: string;
    type: TaskType;
    targetQuantity: number;
    rewardAmount: number;
    taskTimes: number;
    timeInterval: number;
    status?: 'Valid' | 'Invalid';
  }) => Promise<void>;
}

export function TaskAddDialog({ open, onClose, onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TaskType>('Online tasks');
  const [targetQuantity, setTargetQuantity] = useState<number | ''>('');
  const [rewardAmount, setRewardAmount] = useState<number | ''>('');
  const [taskTimes, setTaskTimes] = useState<number | ''>('');
  const [timeInterval, setTimeInterval] = useState<number | ''>('');
  const [status, setStatus] = useState<'Valid' | 'Invalid'>('Valid');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Name is required');
      return;
    }
    if (rewardAmount === '' || Number(rewardAmount) < 0) {
      setError('Reward is required');
      return;
    }
    if (taskTimes === '' || Number(taskTimes) < 0) {
      setError('Task times is required');
      return;
    }
    if (timeInterval === '' || Number(timeInterval) < 0) {
      setError('Time Interval (s) is required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onAdd({
        title: trimmed,
        description: description.trim() || undefined,
        type,
        targetQuantity: Number(targetQuantity) || 0,
        rewardAmount: Number(rewardAmount) || 0,
        taskTimes: Number(taskTimes) || 0,
        timeInterval: Number(timeInterval) || 0,
        status,
      });
      resetForm();
      onClose();
    } catch (e) {
      setError('Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('Online tasks');
    setTargetQuantity('');
    setRewardAmount('');
    setTaskTimes('');
    setTimeInterval('');
    setStatus('Valid');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
        Create
        <IconButton size="small" onClick={handleClose} aria-label="Close">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
        <TextField
          label="Name"
          required
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={!!error && !title.trim()}
          helperText={error && !title.trim() ? error : undefined}
          variant="outlined"
          placeholder="Task name"
        />
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          variant="outlined"
          placeholder="Task description"
        />
        <FormControl fullWidth size="small">
          <InputLabel>Type</InputLabel>
          <Select value={type} label="Type" onChange={(e) => setType(e.target.value as TaskType)}>
            {TASK_TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Target quantity"
          type="number"
          fullWidth
          value={targetQuantity}
          onChange={(e) => setTargetQuantity(e.target.value === '' ? '' : Number(e.target.value))}
          inputProps={{ min: 0 }}
          variant="outlined"
        />
        <TextField
          label="Reward"
          required
          type="number"
          fullWidth
          value={rewardAmount}
          onChange={(e) => setRewardAmount(e.target.value === '' ? '' : Number(e.target.value))}
          error={!!error && (rewardAmount === '' || Number(rewardAmount) < 0)}
          inputProps={{ min: 0 }}
          variant="outlined"
        />
        <TextField
          label="Task times"
          required
          type="number"
          fullWidth
          value={taskTimes}
          onChange={(e) => setTaskTimes(e.target.value === '' ? '' : Number(e.target.value))}
          error={!!error && (taskTimes === '' || Number(taskTimes) < 0)}
          inputProps={{ min: 0 }}
          variant="outlined"
        />
        <TextField
          label="Time Interval (s)"
          required
          type="number"
          fullWidth
          value={timeInterval}
          onChange={(e) => setTimeInterval(e.target.value === '' ? '' : Number(e.target.value))}
          error={!!error && (timeInterval === '' || Number(timeInterval) < 0)}
          inputProps={{ min: 0 }}
          variant="outlined"
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Status
          </Typography>
          <ToggleButtonGroup
            value={status}
            exclusive
            onChange={(_, v) => v != null && setStatus(v)}
            size="small"
            sx={{ alignSelf: 'flex-start' }}
          >
            <ToggleButton value="Valid" sx={{ px: 2 }}>
              Valid
            </ToggleButton>
            <ToggleButton value="Invalid" sx={{ px: 2 }}>
              Invalid
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" color="inherit" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Adding...' : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
