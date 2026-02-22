'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  Box,
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
  Typography,
  IconButton,
} from '@mui/material';
import { Close, CloudUpload } from '@mui/icons-material';
import { CrudTable } from '@/components/common/CrudTable';
import type { CrudTableColumn } from '@/components/common/CrudTable';
import type { AdvertisingConfig } from '@/types/advertising';
import { demoAdvertising } from '@/lib/demo-data';
import { useTabsStore } from '@/store/tabs';
import { uploadImageToS3, isAcceptedImageType } from '@/services/upload';

const DISPLAY_POSITIONS = ['Carousel', 'Banner', 'Popup'];
const TYPES = ['None', 'Ranking list APP jump', 'Webpage URL link'];

export default function AdvertisingConfigPage() {
  const addTab = useTabsStore((s) => s.addTab);

  const [data, setData] = useState<AdvertisingConfig[]>(demoAdvertising);
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<AdvertisingConfig | null>(null);
  const [form, setForm] = useState({
    title: '',
    imageUrl: '',
    displayPosition: 'Carousel',
    type: 'Ranking list APP jump',
    sort: 0,
  });
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    addTab({
      id: '/dashboard/system/advertising',
      label: 'Advertising Configuration',
      path: '/dashboard/system/advertising',
      breadcrumbs: ['Home', 'System Management', 'Advertising Configuration'],
    });
  }, [addTab]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, page, rowsPerPage]);

  const columns: CrudTableColumn<AdvertisingConfig>[] = [
    { id: 'number', label: 'Number', minWidth: 80, align: 'center' },
    {
      id: 'title',
      label: 'Title',
      minWidth: 140,
      render: (row) => (
        <Box component="a" href="#" sx={{ color: 'primary.main', textDecoration: 'none' }}>
          {row.title}
        </Box>
      ),
    },
    {
      id: 'imageUrl',
      label: 'Image',
      minWidth: 100,
      render: (row) =>
        row.imageUrl ? (
          <Box sx={{ width: 80, height: 32, position: 'relative', borderRadius: 1, overflow: 'hidden' }}>
            <Image src={row.imageUrl} alt="" fill sizes="80px" style={{ objectFit: 'cover' }} unoptimized />
          </Box>
        ) : (
          '-'
        ),
    },
    { id: 'displayPosition', label: 'Display Position', minWidth: 120 },
    { id: 'type', label: 'Type', minWidth: 160 },
    { id: 'sort', label: 'Sort', minWidth: 80, align: 'center' },
  ];

  const handleAdd = () => {
    setEditing(null);
    setForm({ title: '', imageUrl: '', displayPosition: 'Carousel', type: 'Ranking list APP jump', sort: 0 });
    setEditOpen(true);
  };

  const handleEdit = (row: AdvertisingConfig) => {
    setEditing(row);
    setForm({
      title: row.title,
      imageUrl: row.imageUrl ?? '',
      displayPosition: row.displayPosition,
      type: row.type,
      sort: row.sort,
    });
    setEditOpen(true);
  };

  const handleDelete = (row: AdvertisingConfig) => {
    if (confirm(`Delete "${row.title}"?`)) {
      setData((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selected.length} items?`)) {
      setData((prev) => prev.filter((r) => !selected.includes(r.id)));
      setSelected([]);
    }
  };

  const handleSave = () => {
    if (editing) {
      setData((prev) =>
        prev.map((r) =>
          r.id === editing.id ? { ...r, ...form, number: r.number } : r
        )
      );
    } else {
      const nextNum = Math.max(...data.map((r) => r.number), 0) + 1;
      setData((prev) => [
        ...prev,
        { id: nextNum, number: nextNum, ...form } as AdvertisingConfig,
      ]);
    }
    setEditOpen(false);
  };

  const handleFile = useCallback(
    async (file: File) => {
      if (!isAcceptedImageType(file.type, false)) {
        alert('Please upload an image (JPG or PNG)');
        return;
      }
      setUploading(true);
      try {
        const url = await uploadImageToS3(file);
        setForm((f) => ({ ...f, imageUrl: url }));
      } catch (err) {
        console.error('Upload failed:', err);
        alert('Upload failed. Please try again.');
      } finally {
        setUploading(false);
      }
    },
    []
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  return (
    <Box>
      <CrudTable<AdvertisingConfig>
        columns={columns}
        rows={paginatedRows}
        selected={selected}
        onSelect={setSelected}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={data.length}
        onPageChange={setPage}
        onRowsPerPageChange={(r) => { setRowsPerPage(r); setPage(0); }}
      />
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {editing ? 'Edit' : 'Add'}
          <IconButton size="small" onClick={() => setEditOpen(false)} aria-label="Close">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="* Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              fullWidth
              required
            />

            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Image
              </Typography>
              <Box
                onClick={() => !uploading && inputRef.current?.click()}
                sx={{
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  overflow: 'hidden',
                  cursor: uploading ? 'default' : 'pointer',
                  bgcolor: 'grey.50',
                  '&:hover': uploading ? {} : { borderColor: 'primary.main', bgcolor: 'action.hover' },
                }}
              >
                {form.imageUrl ? (
                  <Box sx={{ position: 'relative', width: '100%', aspectRatio: '710/188' }}>
                    <Image
                      src={form.imageUrl}
                      alt="Preview"
                      fill
                      sizes="(max-width: 600px) 100vw, 560px"
                      style={{ objectFit: 'cover' }}
                      unoptimized
                    />
                  </Box>
                ) : (
                  <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <CloudUpload sx={{ fontSize: 48, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {uploading ? 'Uploading...' : 'Click to upload'}
                    </Typography>
                  </Box>
                )}
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                Upload rules: Images can only be uploaded in JPG/PNG format: Size: 710px X 188 px
              </Typography>
            </Box>

            <FormControl fullWidth>
              <InputLabel>Display Position</InputLabel>
              <Select
                value={form.displayPosition}
                label="Display Position"
                onChange={(e) => setForm((f) => ({ ...f, displayPosition: e.target.value }))}
              >
                {DISPLAY_POSITIONS.map((p) => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={form.type}
                label="Type"
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              >
                {TYPES.map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="* Sort"
              type="number"
              value={form.sort}
              onChange={(e) => setForm((f) => ({ ...f, sort: parseInt(e.target.value, 10) || 0 }))}
              fullWidth
              required
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
