'use client';

import { Box, Typography } from '@mui/material';

export default function HostsPage() {
  return (
    <Box>
      <Typography variant="h5">Hosts</Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Manage platform hosts and anchors.
      </Typography>
    </Box>
  );
}
