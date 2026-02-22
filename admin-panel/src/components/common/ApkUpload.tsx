'use client';

import { useRef, useCallback, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { CloudUpload, Close } from '@mui/icons-material';
import { uploadApkToS3, isAcceptedApkType } from '@/services/upload';

export interface ApkUploadProps {
  value: string | undefined;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
  helperText?: string;
  disabled?: boolean;
}

export function ApkUpload({
  value,
  onChange,
  label = 'Add file',
  required = false,
  helperText = 'Uploading installation packages can only be in APK format!',
  disabled = false,
}: ApkUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string>('');

  const handleFile = useCallback(
    async (file: File) => {
      if (!isAcceptedApkType(file.type, file.name)) {
        alert('Please upload an APK file (Android installation package only)');
        return;
      }
      setUploading(true);
      try {
        const url = await uploadApkToS3(file);
        setFileName(file.name);
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

  const hasFile = (value ?? '').trim() !== '';

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
          bgcolor: dragOver ? 'action.hover' : hasFile ? 'grey.50' : 'transparent',
          opacity: disabled ? 0.6 : 1,
          position: 'relative',
          minHeight: 120,
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
          accept=".apk,application/vnd.android.package-archive"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        {hasFile ? (
          <>
            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{fileName || 'APK uploaded'}</Typography>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setFileName('');
                onChange('');
              }}
              disabled={disabled}
              sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper' }}
            >
              <Close fontSize="small" />
            </IconButton>
          </>
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
