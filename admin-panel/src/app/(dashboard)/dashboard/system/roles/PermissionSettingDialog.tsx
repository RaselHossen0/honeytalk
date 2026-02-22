'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Tabs,
  Tab,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import type { Role } from '@/types/role';
import { demoAdministrators } from '@/lib/demo-data';

const MENU_PERMISSIONS = [
  'Home',
  'common',
  'System Management',
  'User Management',
  'Live Management',
  'Prop management',
  'Short Video Management',
  'Dynamic Management',
  'Fund Management',
  'Feedback Management',
  'Agent Recharge Management',
  'Article Management',
  'SMS Management',
  'Plugin management',
  'Version Management',
];

interface Props {
  role: Role | null;
  open: boolean;
  onClose: () => void;
}

export function PermissionSettingDialog({ role, open, onClose }: Props) {
  const [tab, setTab] = useState(0);
  const [assignedUsers, setAssignedUsers] = useState<string[]>(['dev']);
  const [assignedMenus, setAssignedMenus] = useState<string[]>(() => [...MENU_PERMISSIONS]);

  const users = demoAdministrators.map((a) => a.account);

  const handleUserToggle = (account: string) => {
    setAssignedUsers((prev) =>
      prev.includes(account) ? prev.filter((u) => u !== account) : [...prev, account]
    );
  };

  const handleMenuToggle = (menu: string) => {
    setAssignedMenus((prev) =>
      prev.includes(menu) ? prev.filter((m) => m !== menu) : [...prev, menu]
    );
  };

  const handleSelectAllMenus = () => setAssignedMenus([...MENU_PERMISSIONS]);
  const handleUnselectAllMenus = () => setAssignedMenus([]);

  const handleSave = () => {
    onClose();
  };

  if (!role) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ fontWeight: 600 }}>
        Role: {role.roleName}
      </DialogTitle>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Assigning Users" />
          <Tab label="Assignments Menu" />
        </Tabs>
      </Box>
      <DialogContent sx={{ pt: 2 }}>
        {tab === 0 && (
          <Box>
            <Button variant="contained" onClick={handleSave} sx={{ mb: 2 }}>
              Save
            </Button>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {users.map((account) => (
                <FormControlLabel
                  key={account}
                  control={
                    <Checkbox
                      checked={assignedUsers.includes(account)}
                      onChange={() => handleUserToggle(account)}
                    />
                  }
                  label={account}
                />
              ))}
            </Box>
          </Box>
        )}
        {tab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
              <Button variant="outlined" onClick={handleSelectAllMenus}>
                Select All
              </Button>
              <Button variant="outlined" onClick={handleUnselectAllMenus}>
                Unselect All
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {MENU_PERMISSIONS.map((menu) => (
                <FormControlLabel
                  key={menu}
                  control={
                    <Checkbox
                      checked={assignedMenus.includes(menu)}
                      onChange={() => handleMenuToggle(menu)}
                    />
                  }
                  label={menu}
                />
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
