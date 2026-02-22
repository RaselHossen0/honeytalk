'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { OperationButton } from '@/components/common/OperationButton';
import { LevelEditModal } from './LevelEditModal';
import type { Level, LevelGender } from '@/types/level';
import { fetchLevels, deleteLevel } from '@/services/level';

interface LevelListContentProps {
  gender: LevelGender;
  tabLabel: string;
  tabPath: string;
  breadcrumbs: string[];
  onAddTab: (config: { id: string; label: string; path: string; breadcrumbs: string[] }) => void;
}

export function LevelListContent({
  gender,
  tabLabel,
  tabPath,
  breadcrumbs,
  onAddTab,
}: LevelListContentProps) {
  const [data, setData] = useState<Level[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchLevels(gender);
      setData(list);
    } finally {
      setLoading(false);
    }
  }, [gender]);

  useEffect(() => {
    onAddTab({ id: tabPath, label: tabLabel, path: tabPath, breadcrumbs });
  }, [onAddTab, tabPath, tabLabel, breadcrumbs]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected(data.map((r) => r.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this level?')) return;
    await deleteLevel(id);
    setData((prev) => prev.filter((r) => r.id !== id));
    setSelected((prev) => prev.filter((x) => x !== id));
  };

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<Level | null>(null);

  const handleEdit = (row: Level) => {
    setEditingLevel(row);
    setEditModalOpen(true);
  };

  const handleAdd = () => {
    setEditingLevel(null);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setEditingLevel(null);
  };

  const handleEditSaved = (mode: 'edit' | 'add', level: Level) => {
    if (mode === 'edit') {
      setData((prev) => prev.map((r) => (r.id === level.id ? level : r)));
    } else {
      setData((prev) => [...prev, level].sort((a, b) => a.level - b.level));
    }
  };

  const hasDecoration = (row: Level) => row.level <= 4 || row.level === 10;

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          + Add
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < data.length}
                  checked={data.length > 0 && selected.length === data.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Level Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Level</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Required integral value</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Level Decoration</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(row.id)}
                      onChange={() => handleSelectOne(row.id)}
                    />
                  </TableCell>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.levelName}</TableCell>
                  <TableCell>{row.level}</TableCell>
                  <TableCell>{row.requiredIntegralValue}</TableCell>
                  <TableCell>
                    {hasDecoration(row) ? (
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {[1, 2, 3].slice(0, row.level <= 2 ? 1 : row.level <= 4 ? 2 : 3).map((i) => (
                          <Box
                            key={i}
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: 1,
                              bgcolor: 'grey.200',
                              border: '1px solid',
                              borderColor: 'grey.300',
                            }}
                          />
                        ))}
                      </Box>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell sx={{ width: 56 }}>
                    <OperationButton
                      items={[{ label: 'Edit', onClick: () => handleEdit(row), icon: <Edit fontSize="small" /> }]}
                      dangerItems={[{ label: 'Delete', onClick: () => handleDelete(row.id), icon: <Delete fontSize="small" /> }]}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <LevelEditModal
        open={editModalOpen}
        level={editingLevel}
        gender={gender}
        onClose={handleEditModalClose}
        onSaved={handleEditSaved}
      />
    </Box>
  );
}
