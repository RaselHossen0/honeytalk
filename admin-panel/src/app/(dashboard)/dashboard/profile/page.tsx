'use client';

import { Box, Typography } from '@mui/material';

export default function ProfilePage() {
  return (
    <Box>
      <Typography variant="h5">Admin Profile</Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Manage your administrator profile.
      </Typography>
    </Box>
  );
}
