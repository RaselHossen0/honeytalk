'use client';

import { useRef, useCallback, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { CloudUpload, Close } from '@mui/icons-material';
import { uploadImageToS3, isAcceptedImageType } from '@/services/upload';

export interface ImageUploadProps {
  value: string | undefined;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
  helperText?: string;
  disabled?: boolean;
}

const DEFAULT_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';

export function ImageUpload({
  value,
  onChange,
  label = 'Image',
  accept = DEFAULT_ACCEPT,
  helperText = 'Uploaded images can only be JPG/PNG/WebP. Files will be stored on AWS S3.',
  disabled = false,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      const acceptAll = accept?.includes('image/*');
      if (!isAcceptedImageType(file.type, acceptAll)) {
        alert('Please upload an image (JPG, PNG, WebP, GIF, or SVG)');
        return;
      }
      setUploading(true);
      try {
        const url = await uploadImageToS3(file);
        onChange(url);
      } catch (err) {
        console.error('Upload failed:', err);
        alert('Upload failed. Please try again.');
      } finally {
        setUploading(false);
      }
    },
    [onChange, accept]
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

  return (
    <Box>
      {label && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {label}
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
          bgcolor: dragOver ? 'action.hover' : (value ?? '').trim() ? 'grey.50' : 'transparent',
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
          accept={accept}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        {(value ?? '').trim() ? (
          <>
            <Box
              component="img"
              src={value ?? ''}
              alt="Preview"
              sx={{
                maxHeight: 120,
                maxWidth: '100%',
                objectFit: 'contain',
                borderRadius: 1,
              }}
            />
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
          </>
        ) : (
          <>
            <CloudUpload sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {uploading ? 'Uploading...' : 'Drag the file here or click to upload'}
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
