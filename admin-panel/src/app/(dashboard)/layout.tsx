'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Drawer } from '@mui/material';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthStore } from '@/store/auth';
import { LAYOUT, Z_INDEX } from '@/components/layout/constants';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!token) router.push('/login');
  }, [token, router]);

  const handleCloseDrawer = useCallback(() => setMobileOpen(false), []);
  const handleToggleDrawer = useCallback(() => setMobileOpen((prev) => !prev), []);

  return (
    <Box
      component="div"
      sx={{
        display: 'flex',
        minHeight: { xs: '100dvh', lg: '100vh' },
        bgcolor: 'background.default',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Desktop sidebar - fixed left */}
      <Box
        component="aside"
        sx={{
          width: LAYOUT.SIDEBAR_WIDTH,
          flexShrink: 0,
          display: { xs: 'none', lg: 'block' },
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: Z_INDEX.SIDEBAR,
        }}
      >
        <Sidebar />
      </Box>

      {/* Mobile/tablet drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleCloseDrawer}
        ModalProps={{
          keepMounted: true,
          disableScrollLock: false,
        }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            width: { xs: 'min(280px, 85vw)', sm: LAYOUT.SIDEBAR_WIDTH },
            maxWidth: '100%',
            boxSizing: 'border-box',
            top: 0,
            height: '100%',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <Sidebar onNavigateClose={handleCloseDrawer} />
      </Drawer>

      {/* Main content area */}
      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          ml: { xs: 0, lg: `${LAYOUT.SIDEBAR_WIDTH}px` },
          minHeight: { xs: '100dvh', lg: '100vh' },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <DashboardHeader onMenuClick={handleToggleDrawer} />
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            width: '100%',
            maxWidth: '100%',
            overflow: 'auto',
            p: { xs: 1.5, sm: 2, md: 2.5 },
            pt: { xs: 1.5, sm: 2 },
            pb: { xs: 8, sm: 6 },
          }}
        >
          <Box sx={{ width: '100%', maxWidth: LAYOUT.CONTENT_MAX_WIDTH, mx: 'auto' }}>
            {children}
          </Box>
          <Box
            component="a"
            href="mailto:support@honeytalk.com"
            sx={{
              position: 'fixed',
              right: { xs: 16, sm: 24 },
              // Extra bottom offset so rotated button stays fully on screen (rotation extends it downward)
              bottom: { xs: 70, sm: 80 },
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(-90deg)',
              transformOrigin: 'bottom right',
              py: { xs: 1.5, sm: 2 },
              px: { xs: 1.25, sm: 1.5 },
              bgcolor: 'primary.main',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 2,
              fontSize: { xs: 12, sm: 13 },
              fontWeight: 600,
              zIndex: Z_INDEX.FLOATING_ACTION,
              transition: 'background-color 0.2s ease',
              display: { xs: 'none', sm: 'flex' },
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            Contact Us
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
