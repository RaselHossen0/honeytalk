'use client';

import { useRef, useCallback, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { CloudUpload, Close, PlayArrow, Pause, MoreVert } from '@mui/icons-material';
import { uploadAudioToS3, isAcceptedAudioType } from '@/services/upload';

export interface AudioUploadProps {
  value: string | undefined;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
  helperText?: string;
  disabled?: boolean;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function AudioUpload({
  value,
  onChange,
  label = 'Link',
  required = false,
  helperText = 'Uploading rule: Uploading audio can only be in MP3 format!',
  disabled = false,
}: AudioUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleFile = useCallback(
    async (file: File) => {
      if (!isAcceptedAudioType(file.type)) {
        alert('Please upload an audio file (MP3 format only)');
        return;
      }
      setUploading(true);
      try {
        const url = await uploadAudioToS3(file);
        onChange(url);
      } catch (err) {
        console.error('Upload failed:', err);
        alert('Upload failed. Please try again.');
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const hasAudio = (value ?? '').trim() !== '';

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  };

  return (
    <Box>
      {label && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {label}
          {required && <Box component="span" sx={{ color: 'error.main' }}> *</Box>}
        </Typography>
      )}
      <Box
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && !uploading && inputRef.current?.click()}
        sx={{
          border: '2px dashed',
          borderColor: dragOver ? 'primary.main' : 'divider',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: disabled || uploading ? 'default' : 'pointer',
          bgcolor: dragOver ? 'action.hover' : hasAudio ? 'grey.50' : 'transparent',
          opacity: disabled ? 0.6 : 1,
          position: 'relative',
          minHeight: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': disabled || uploading ? {} : { borderColor: 'primary.main', bgcolor: 'action.hover' },
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="audio/mpeg,audio/mp3,audio/*"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        {hasAudio ? (
          <Box sx={{ width: '100%' }} onClick={(e) => e.stopPropagation()}>
            <audio
              ref={audioRef}
              src={value ?? ''}
              preload="metadata"
              onTimeUpdate={(e) => setCurrentTime((e.target as HTMLAudioElement).currentTime)}
              onLoadedMetadata={(e) => setDuration((e.target as HTMLAudioElement).duration)}
              onEnded={() => setPlaying(false)}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <IconButton size="small" onClick={togglePlay} color="primary" sx={{ p: 0.5 }}>
                {playing ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
              </IconButton>
              <Typography variant="caption" sx={{ minWidth: 70 }}>
                {formatTime(currentTime)} / {formatTime(isNaN(duration) ? 0 : duration)}
              </Typography>
              <Box sx={{ flex: 1, height: 4, bgcolor: 'grey.300', borderRadius: 1, mx: 1 }} />
              <IconButton size="small" sx={{ p: 0.5 }}>
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              disabled={disabled}
              sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper' }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <>
            <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {uploading ? 'Uploading...' : 'Drag the file here or click upload'}
            </Typography>
          </>
        )}
      </Box>
      {helperText && (
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );
}
