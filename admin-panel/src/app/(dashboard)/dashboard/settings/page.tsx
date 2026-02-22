'use client';

import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

export default function SettingsPage() {
  const token = useAuthStore((s) => s.token);
  const [settings, setSettings] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!token) return;
    api.get<Record<string, unknown>>('/admin/settings', token)
      .then(setSettings)
      .catch(() => setSettings(null));
  }, [token]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        App Settings
      </Typography>
      <Card>
        <CardContent>
          <Typography color="text.secondary" variant="body2">
            {settings ? 'Admin settings loaded from API' : 'Connect backend to load settings'}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
