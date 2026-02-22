'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme } from '@/theme';

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
