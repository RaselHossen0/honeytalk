'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People,
  AccountBalance,
  ShowChart,
  Store,
} from '@mui/icons-material';
import { useAuthStore } from '@/store/auth';

const DRAWER_WIDTH = 260;

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/dashboard/hosts', label: 'My Hosts', icon: <People /> },
  { path: '/dashboard/commissions', label: 'Commissions', icon: <AccountBalance /> },
  { path: '/dashboard/analytics', label: 'Analytics', icon: <ShowChart /> },
  { path: '/dashboard/sub-agencies', label: 'Sub-Agencies', icon: <Store /> },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!token) router.push('/login');
  }, [token, router]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap color="primary">
            HoneyTalk Agency
          </Typography>
        </Toolbar>
        <List>
          {navItems.map(({ path, label, icon }) => (
            <ListItemButton
              key={path}
              selected={pathname.startsWith(path)}
              onClick={() => router.push(path)}
            >
              <ListItemIcon color="primary">{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <DashboardHeader />
        {children}
      </Box>
    </Box>
  );
}
