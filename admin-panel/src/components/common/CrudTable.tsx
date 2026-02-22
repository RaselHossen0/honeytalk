'use client';

import React from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  Paper,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { OperationButton } from './OperationButton';

export interface CrudTableColumn<T> {
  id: keyof T | string;
  label: string;
  align?: 'left' | 'right' | 'center';
  minWidth?: number;
  render?: (row: T) => React.ReactNode;
}

interface CrudTableProps<T extends { id: string | number }> {
  title?: string;
  columns: CrudTableColumn<T>[];
  rows: T[];
  selected: (string | number)[];
  onSelect: (ids: (string | number)[]) => void;
  onAdd: () => void;
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  onBulkDelete?: () => void;
  page: number;
  rowsPerPage: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

export function CrudTable<T extends { id: string | number }>({
  title,
  columns,
  rows,
  selected,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  onBulkDelete,
  page,
  rowsPerPage,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
}: CrudTableProps<T>) {
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onSelect(rows.map((r) => r.id));
    } else {
      onSelect([]);
    }
  };

  const handleSelectOne = (id: string | number) => {
    if (selected.includes(id)) {
      onSelect(selected.filter((s) => s !== id));
    } else {
      onSelect([...selected, id]);
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: { xs: 1.5, sm: 2 } }}>
        <Button variant="contained" size="small" startIcon={<Add />} onClick={onAdd} sx={{ fontSize: { xs: 12, sm: 14 } }}>
          Add
        </Button>
      </Box>
      <TableContainer sx={{ maxHeight: { xs: 400, sm: 520 }, overflowX: 'auto' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < rows.length}
                  checked={rows.length > 0 && selected.length === rows.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              {columns.map((col) => (
                <TableCell
                  key={String(col.id)}
                  align={col.align ?? 'left'}
                  sx={{ minWidth: col.minWidth, fontWeight: 600, bgcolor: 'grey.50' }}
                >
                  {col.label}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 600, bgcolor: 'grey.50', width: 56 }}>
                Operation
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} hover selected={selected.includes(row.id)}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.includes(row.id)}
                    onChange={() => handleSelectOne(row.id)}
                  />
                </TableCell>
                {columns.map((col) => {
                  const raw = col.render ? col.render(row) : (row as Record<string, unknown>)[String(col.id)] ?? '—';
                  const value: React.ReactNode =
                    raw != null && typeof raw === 'object' && !React.isValidElement(raw) && !Array.isArray(raw)
                      ? null
                      : (raw as React.ReactNode);
                  return (
                    <TableCell key={String(col.id)} align={col.align ?? 'left'}>
                      {value}
                    </TableCell>
                  );
                })}
                <TableCell align="right" sx={{ width: 56 }}>
                  <OperationButton
                    items={[{ label: 'Edit', onClick: () => onEdit(row), icon: <Edit fontSize="small" /> }]}
                    dangerItems={[{ label: 'Delete', onClick: () => onDelete(row), icon: <Delete fontSize="small" /> }]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selected.length > 0 && onBulkDelete && (
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={onBulkDelete}
          >
            Delete ({selected.length} selected)
          </Button>
        </Box>
      )}
      <TablePagination
        component="div"
        count={totalRows}
        page={page}
        onPageChange={(_, p) => onPageChange(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Rows"
      />
    </Paper>
  );
}
