'use client';

import { Box, Typography } from '@mui/material';

export default function LivePage() {
  return (
    <Box>
      <Typography variant="h5">Live Streams</Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Manage live streaming sessions.
      </Typography>
    </Box>
  );
}
