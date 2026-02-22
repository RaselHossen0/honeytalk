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
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import type { Task, TaskType } from '@/types/task';

const TASK_TYPES: TaskType[] = [
  'Online tasks',
  'Game task',
  'Rewarding Anchor Task',
  'Share anchor tasks',
  'Follow streamer tasks',
];

interface Props {
  item: Task;
  open: boolean;
  onClose: () => void;
  onSave: (
    id: number,
    data: {
      title: string;
      description?: string;
      type: TaskType;
      targetQuantity: number;
      rewardAmount: number;
      taskTimes: number;
      timeInterval: number;
      status: 'Valid' | 'Invalid';
    }
  ) => Promise<void>;
}

export function TaskEditDialog({ item, open, onClose, onSave }: Props) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description ?? '');
  const [type, setType] = useState<TaskType>(item.type);
  const [targetQuantity, setTargetQuantity] = useState<number | ''>(item.targetQuantity);
  const [rewardAmount, setRewardAmount] = useState<number | ''>(item.rewardAmount);
  const [taskTimes, setTaskTimes] = useState<number | ''>(item.taskTimes);
  const [timeInterval, setTimeInterval] = useState<number | ''>(item.timeInterval);
  const [status, setStatus] = useState<'Valid' | 'Invalid'>(item.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(item.title);
      setDescription(item.description ?? '');
      setType(item.type);
      setTargetQuantity(item.targetQuantity);
      setRewardAmount(item.rewardAmount);
      setTaskTimes(item.taskTimes);
      setTimeInterval(item.timeInterval);
      setStatus(item.status);
      setError('');
    }
  }, [open, item]);

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
      await onSave(item.id, {
        title: trimmed,
        description: description.trim() || undefined,
        type,
        targetQuantity: Number(targetQuantity) || 0,
        rewardAmount: Number(rewardAmount) || 0,
        taskTimes: Number(taskTimes) || 0,
        timeInterval: Number(timeInterval) || 0,
        status,
      });
      onClose();
    } catch (e) {
      setError('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
        Edit
        <IconButton size="small" onClick={onClose} aria-label="Close">
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
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving...' : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
