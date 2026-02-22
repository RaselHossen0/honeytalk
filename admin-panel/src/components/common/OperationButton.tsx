'use client';

import { useState } from 'react';
import { IconButton, Menu, MenuItem, Divider, ListItemIcon, ListItemText } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';

export interface OperationItem {
  label: string;
  onClick: () => void;
  /** Optional icon shown before the label in the menu */
  icon?: React.ReactNode;
  /** Style as destructive/danger action (red text) */
  danger?: boolean;
}

interface OperationButtonProps {
  /** Primary action items (Edit, View, etc.) */
  items?: OperationItem[];
  /** Optional: divider before destructive actions. Items here are styled as danger. */
  dangerItems?: OperationItem[];
}

/**
 * Compact operation dropdown - icon button (⋯) that opens an action menu.
 * Use instead of bulky stacked "Comment list" / "Delete" buttons in table rows.
 * Provides a clean, professional look consistent across admin tables.
 */
export function OperationButton({ items = [], dangerItems }: OperationButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleItemClick = (item: OperationItem) => {
    item.onClick();
    handleClose();
  };

  const renderItem = (item: OperationItem, isDanger: boolean) => (
    <MenuItem
      key={item.label}
      onClick={() => handleItemClick(item)}
      sx={{
        fontSize: 14,
        py: 1.25,
        minHeight: 40,
        ...(isDanger && { color: 'error.main', '&:hover': { bgcolor: 'error.lighter' } }),
      }}
    >
      {item.icon && <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>{item.icon}</ListItemIcon>}
      <ListItemText primary={item.label} />
    </MenuItem>
  );

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        sx={{
          color: 'text.secondary',
          '&:hover': { bgcolor: 'action.hover', color: 'primary.main' },
        }}
        aria-label="Actions"
      >
        <MoreHoriz fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          elevation: 8,
          sx: {
            minWidth: 176,
            mt: 1.5,
            borderRadius: 1.5,
            py: 0.5,
            '& .MuiListItemIcon-root': { minWidth: 36 },
          },
        }}
      >
        {items.map((item) => renderItem(item, item.danger ?? false))}
        {dangerItems && dangerItems.length > 0 && (
          <>
            <Divider sx={{ my: 1 }} />
            {dangerItems.map((item) => renderItem(item, true))}
          </>
        )}
      </Menu>
    </>
  );
}
