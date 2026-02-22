'use client';

import { Box, Typography } from '@mui/material';

export default function HostsPage() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        My Hosts
      </Typography>
      <Typography color="text.secondary">
        Manage hosts under your agency.
      </Typography>
    </Box>
  );
}
