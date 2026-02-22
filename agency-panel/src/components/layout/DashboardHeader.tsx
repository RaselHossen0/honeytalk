'use client';

import { useRouter } from 'next/navigation';
import { Button, Box } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useAuthStore } from '@/store/auth';

export function DashboardHeader() {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
    router.refresh();
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
      <Button startIcon={<Logout />} onClick={handleLogout} size="small">
        Logout
      </Button>
    </Box>
  );
}
